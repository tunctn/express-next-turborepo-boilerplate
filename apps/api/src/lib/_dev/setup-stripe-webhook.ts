import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { env, updateStripeWebhookSecretEnv } from "@/lib/env";
import { STRIPE_EVENT_TYPES, stripe } from "@/lib/stripe";
import { logger } from "@/utils/logger";
import dayjs from "dayjs";

const TUNNEL_URL_FILE = join(__dirname, "tunnel.local.txt");
const STRIPE_WEBHOOK_FILE = join(__dirname, "stripe-webhook.local.txt");
const SEPARATOR = "======";

export const setupStripeWebhook = async () => {
  if (env.NODE_ENV !== "development") return;

  // Get the tunnel URL from the file
  const tunnelUrl = await readFile(TUNNEL_URL_FILE, "utf-8");
  if (!tunnelUrl) throw new Error("Could not found Tunnel url");

  const developerEmail = process.env["DEVELOPER_EMAIL"];
  if (!developerEmail) {
    throw new Error(`Please set DEVELOPER_EMAIL=your@email.com in the .env.local file located in the root of the project`);
  }

  if (!existsSync(STRIPE_WEBHOOK_FILE)) {
    writeFile(STRIPE_WEBHOOK_FILE, "");
  }

  const existingWebhooks = await stripe.webhookEndpoints.list({
    limit: 100,
  });

  if (existingWebhooks.data.length >= 10) {
    logger.debug(`Deleting old webhooks.`);
    for (const webhook of existingWebhooks.data) {
      await stripe.webhookEndpoints.del(webhook.id);
    }
  }

  // Delete old webhooks
  for (const webhook of existingWebhooks.data) {
    if (webhook.metadata["is_local_webhook"] !== "true") {
      continue;
    }

    const now = dayjs();
    const createdAt = dayjs.unix(webhook.created);
    const diff = now.diff(createdAt, "day");
    if (diff >= 1) {
      logger.debug(`Deleting old webhook: ${webhook.id}`);
      await stripe.webhookEndpoints.del(webhook.id);
    }
  }

  try {
    const existingWebhook = await readFile(STRIPE_WEBHOOK_FILE, "utf-8");
    if (existingWebhook) {
      const [id, url, secret] = existingWebhook.split(SEPARATOR);
      if (id && url && secret) {
        const endpoint = await stripe.webhookEndpoints.retrieve(id);
        if (endpoint.url === url && url.startsWith(tunnelUrl)) {
          updateStripeWebhookSecretEnv(secret);
          logger.debug(`Stripe webhook is ready to use: ${endpoint.url}`);
          return;
        }
      }
    }
  } catch (_error) {
    logger.error(`Current webhook is failed to use: ${_error}.`);
    logger.debug(`Creating new webhook.`);
  }

  const newWebhookUrl = `${tunnelUrl}/v1/stripe/webhook`;

  const createdAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const endpoint = await stripe.webhookEndpoints.create({
    url: newWebhookUrl,
    enabled_events: STRIPE_EVENT_TYPES,
    description: `Created at ${createdAt} for ${developerEmail} using setup-stripe-webhook.ts`,
    api_version: "2023-10-16",
    metadata: {
      developer_email: developerEmail,
      tunnel_url: tunnelUrl,
      created_at: createdAt,
      is_local_webhook: "true",
    },
  });

  logger.debug(`Stripe webhook created: ${endpoint.id}. Listening to ${newWebhookUrl}`);
  const endpointSecret = endpoint.secret;
  if (endpointSecret) {
    updateStripeWebhookSecretEnv(endpointSecret);
  } else {
    throw new Error("Could not found stripe webhook secret");
  }

  await writeFile(STRIPE_WEBHOOK_FILE, `${endpoint.id}${SEPARATOR}${newWebhookUrl}${SEPARATOR}${endpointSecret}`);
};
