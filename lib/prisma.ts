import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

const prismaClientSingleton = () => {
  // On Vercel (production), the filesystem is read-only except /tmp.
  // We must copy the SQLite database to /tmp so Prisma can create journal files.
  if (process.env.VERCEL) {
    const tmpDbPath = '/tmp/dev.db'
    
    // Only copy if not already there (avoids re-copying on warm starts)
    if (!fs.existsSync(tmpDbPath)) {
      // Try multiple possible source locations
      const possibleSources = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(__dirname, '..', 'prisma', 'dev.db'),
        path.resolve('prisma', 'dev.db'),
      ]
      
      for (const src of possibleSources) {
        try {
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, tmpDbPath)
            console.log(`Copied database from ${src} to ${tmpDbPath}`)
            break
          }
        } catch (e) {
          console.error(`Failed to copy from ${src}:`, e)
        }
      }
    }
    
    return new PrismaClient({
      datasources: {
        db: {
          url: `file:${tmpDbPath}`,
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
