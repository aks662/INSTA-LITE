const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const { users, posts } = require('./seed-data.cjs');

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up existing data
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  await prisma.user.createMany({ data: users, skipDuplicates: true });
  const allUsers = await prisma.user.findMany({ select: { id: true } });

  // Assign random author to each post
  const postsWithAuthor = posts.map(p => {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    return { ...p, userId: randomUser.id };
  });

  // Create posts
  await prisma.post.createMany({ data: postsWithAuthor, skipDuplicates: true });
  const allPosts = await prisma.post.findMany({ select: { id: true } });

  // Generate likes (29 random likes)
  const likes = [];
  const targetLikeCount = 29;
  while (likes.length < targetLikeCount) {
    const user = allUsers[Math.floor(Math.random() * allUsers.length)];
    const post = allPosts[Math.floor(Math.random() * allPosts.length)];
    const combo = `${user.id}-${post.id}`;
    if (!likes.find(l => `${l.userId}-${l.postId}` === combo)) {
      likes.push({ userId: user.id, postId: post.id });
    }
  }
  await prisma.like.createMany({ data: likes, skipDuplicates: true });

  console.log(`✅ Seed finished: ${allUsers.length} users, ${allPosts.length} posts, ${likes.length} likes.`);
}

main()
  .catch(e => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
