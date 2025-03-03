import Stripe from "stripe";
import { env } from "./env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const STRIPE_EVENT_TYPES = [
  // Fired when a customer completes the checkout process
  "checkout.session.completed",
  // Fired when a new subscription is created
  "customer.subscription.created",
  // Fired when a subscription is canceled
  "customer.subscription.deleted",
  // Fired when a subscription is paused (e.g., temporary hold)
  "customer.subscription.paused",
  // Fired when a scheduled subscription update is applied
  "customer.subscription.pending_update_applied",
  // Fired when a scheduled subscription update expires without being applied
  "customer.subscription.pending_update_expired",
  // Fired when a paused subscription is resumed
  "customer.subscription.resumed",
  // Fired 3 days before a trial ends
  "customer.subscription.trial_will_end",
  // Fired when a subscription is modified (e.g., plan change, quantity update)
  "customer.subscription.updated",
  // Fired when an invoice is marked as uncollectible (bad debt)
  "invoice.marked_uncollectible",
  // Fired when an invoice is paid successfully
  "invoice.paid",
  // Fired when additional customer action is required to complete payment
  "invoice.payment_action_required",
  // Fired when an invoice payment attempt fails
  "invoice.payment_failed",
  // Fired when an invoice is successfully paid
  "invoice.payment_succeeded",
  // Fired when an upcoming invoice is generated (but not yet paid)
  "invoice.upcoming",
  // Fired when a payment intent is canceled
  "payment_intent.canceled",
  // Fired when a payment intent fails
  "payment_intent.payment_failed",
  // Fired when a payment intent succeeds
  "payment_intent.succeeded",
] as const satisfies Stripe.Event.Type[];
export type StripeEventType = (typeof STRIPE_EVENT_TYPES)[number];
