import { prisma } from "../lib/prisma.js";

export default async function handler(req, res) {
  // Use the 'res' object provided by the Vercel/Node runtime
  if (req.method === "GET") {
    try {
      const recipes = await prisma.recipe.findMany({
        include: {
          ingredients: true,
          steps: {
            orderBy: { order: "asc" },
          },
        },
      });

      // Sending the response and closing the connection
      return res.status(200).json(recipes);
    } catch (error) {
      console.error("DB ERROR:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
