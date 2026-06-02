import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

const prismaClientSingleton = () => {
  if (process.env.NODE_ENV === 'production') {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const tmpPath = '/tmp/dev.db'
    if (fs.existsSync(dbPath) && !fs.existsSync(tmpPath)) {
      fs.copyFileSync(dbPath, tmpPath)
    }
    return new PrismaClient({
      datasources: {
        db: {
          url: `file:${tmpPath}`,
        },
      },
    })
  }
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
