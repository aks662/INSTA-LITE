
const {PrismaClient}  = require("@prisma/client")
const {PrismaPg} = require("@prisma/adapter-pg")
const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL})
const prisma = new PrismaClient({adapter})



async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data first (optional, prevents unique constraint errors on re-run)
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create Users with nested Posts
  const user1 = await prisma.user.create({
    data: {
      username: 'riya_travels',
      email: 'riya@example.com',
      fullname: 'Riya Sharma',
      bio: 'Exploring the world one city at a time ✈️',
      isPrivate: false,
      posts: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
            caption: 'Beautiful sunset at the beach!',
            location: 'Goa, India'
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
            caption: 'Mountain road trip adventures.',
            location: 'Leh Ladakh'
          }
        ]
      }
    }
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'code_wizard',
      email: 'wizard@example.com',
      fullname: 'Alex Smith',
      bio: 'Full-stack developer & coffee addict ☕',
      isPrivate: true,
      posts: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
            caption: 'Late night coding setup.',
            location: 'San Francisco, CA'
          }
        ]
      }
    }
  });

  console.log(`✅ Seed finished successfully! Created user IDs: ${user1.id} and ${user2.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });