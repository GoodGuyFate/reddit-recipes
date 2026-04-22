import { prisma } from "../lib/prisma.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body;

  const {
    title,
    description,
    category,
    sourceUrl,
    subreddit,
    upvotes,
    imageUrl,
    servings,
    prepTime,
    cookTime,
    tags,
    ingredients,
    steps,
  } = body;

  if (!title || !description || !category) {
    return res
      .status(400)
      .json({ error: "Title and Description are required" });
  }

  try {
    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        category,
        sourceUrl,
        subreddit,
        upvotes: upvotes ?? 0,
        imageUrl,
        servings,
        prepTime,
        cookTime,
        tags: tags ?? [],
        ingredients: { create: ingredients },
        steps: { create: steps },
      },
      include: {
        ingredients: true,
        steps: true,
      },
    });

    return res.status(201).json(recipe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
