import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.plan.upsert({
    where: { id: 'free' },
    update: {},
    create: { id: 'free', name: 'Free', ttsLimit: 5000 },
  })

  await prisma.plan.upsert({
    where: { id: 'pro' },
    update: {},
    create: { id: 'pro', name: 'Pro', ttsLimit: 0 },
  })

  console.log('Seed completado: planes Free y Pro creados')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
