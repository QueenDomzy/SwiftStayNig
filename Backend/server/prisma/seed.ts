import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create test user
  const user = await prisma.user.create({
    data: {
      full_name: "Test Owner",
      email: "owner@test.com",
      password: "hashedpassword",
      role: "owner"
    }
  })

  // Create property
  await prisma.property.create({
    data: {
      ownerId: user.id,
      title: "SwiftStay ABnB Hotel", // ✅ Add this
      propertyName: "SwiftStay Hotel",
      description: "A nice test hotel in Enugu.",
      location: "Enugu",
      price: 50000,
      images: ["https://picsum.photos/300"]
    }
  })
}

main()
  .then(() => console.log("✅ Database seeded"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
