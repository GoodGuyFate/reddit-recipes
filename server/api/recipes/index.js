import { prisma } from '../../lib/prisma.js'

export default async function handler(req) {
  if (req.method === 'GET') {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: true,
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return Response.json(recipes)
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}