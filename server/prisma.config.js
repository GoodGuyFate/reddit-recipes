import path from 'path'
import { defineConfig } from 'prisma/config'
import 'dotenv/config'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL
  },
  migrate: {
    adapter: async () => {
      const { PrismaNeon } = await import('@prisma/adapter-neon')
      return new PrismaNeon({ connectionString: process.env.DATABASE_URL })
    }
  }
})