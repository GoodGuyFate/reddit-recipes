import { prisma } from '../../lib/prisma.js'

export default async function handler(req) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const body = await req.json()

  const { title, description, sourceUrl, subreddit, upvotes, imageUrl,
          servings, prepTime, cookTime, difficulty, tags,
          ingredients, steps } = body

  if (!title || !description || !sourceUrl || !subreddit) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const recipe = await prisma.recipe.create({
    data: {
      title,
      description,
      sourceUrl,
      subreddit,
      upvotes: upvotes ?? 0,
      imageUrl,
      servings,
      prepTime,
      cookTime,
      difficulty: difficulty ?? 'EASY',
      tags: tags ?? [],
      ingredients: {
        create: ingredients
      },
      steps: {
        create: steps
      }
    },
    include: {
      ingredients: true,
      steps: true
    }
  })

  return Response.json(recipe, { status: 201 })
}