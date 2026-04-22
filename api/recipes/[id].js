import { prisma } from "../lib/prisma.js";

export default async function handler(req, res) {
  const id = parseInt(req.query.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (req.method === "GET") {
    try {
      const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: {
          ingredients: true,
          steps: { orderBy: { order: "asc" } },
        },
      });

      if (!recipe) return res.status(404).json({ error: "Recipe not found" });

      return res.status(200).json(recipe);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "PUT") {
    try {
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
      } = req.body;

      // Update the recipe and its nested relations
      const updatedRecipe = await prisma.recipe.update({
        where: { id },
        data: {
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
          // Simplest way: delete existing and recreate new ones
          ingredients: {
            deleteMany: {},
            create: ingredients.map(({ id, recipeId, ...rest }) => rest),
          },
          steps: {
            deleteMany: {},
            create: steps.map(({ id, recipeId, ...rest }) => rest),
          },
        },
      });

      return res.status(200).json(updatedRecipe);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      // Delete related records first (Prisma won't cascade automatically unless set in schema)
      await prisma.ingredient.deleteMany({ where: { recipeId: id } });
      await prisma.step.deleteMany({ where: { recipeId: id } });
      await prisma.recipe.delete({ where: { id } });

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
