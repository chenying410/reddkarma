const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDbConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    
  const user = await prisma.user.findUnique({
    where: {
      email: 'chen.ying.1992410@gmail.com',
    }
  })

  console.log('user', user)

    console.log(`✅ PostgreSQL is running at ${process.env.DATABASE_HOST}://${process.env.DATABASE_PORT}...`);
    process.exit(0); // Exit with success to continue to Next.js
  } catch (error) {
    console.error("❌ PostgreSQL is down!", error.message);
    process.exit(1); // Exit with error to stop the Next.js app
  } finally {
    await prisma.$disconnect();
  }
}

checkDbConnection();
