import { prisma } from '../../lib/prisma.js'

export default async function handler(req) {
  const url = new URL(req.url)
  const id = parseInt(url.pathname.split('/').pop())

  if (isNaN(id)) {
    return Response.json({ error: 'Invalid ID' }, { status: 400 })
  }

  if (req.method === 'GET') {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: true,
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!recipe) {
      return Response.json({ error: 'Recipe not found' }, { status: 404 })
    }

    return Response.json(recipe)
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}