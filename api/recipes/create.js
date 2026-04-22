import { prisma } from '../lib/prisma.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body

  const { title, description, sourceUrl, subreddit, upvotes, imageUrl,
          servings, prepTime, cookTime, difficulty, tags,
          ingredients, steps } = body

  if (!title || !description || !sourceUrl || !subreddit) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
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
        ingredients: { create: ingredients },
        steps: { create: steps }
      },
      include: {
        ingredients: true,
        steps: true
      }
    })

    return res.status(201).json(recipe)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}