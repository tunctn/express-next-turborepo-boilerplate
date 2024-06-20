import { logger } from '@/utils/logger';

const seedSomething = async () => {
  // await db.insert(table).values(data);
};

export const seedDatabase = async () => {
  logger.info(`Seeding database...`);
  await seedSomething();
  logger.info(`Database seeded.`);
};
