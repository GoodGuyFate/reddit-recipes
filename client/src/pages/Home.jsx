import { useState, useEffect } from 'react'
import RecipeCard from '../components/RecipeCard.jsx'
import styles from './Home.module.css'

const CATEGORIES = [
  'All', 'Breakfast', 'Main Dishes', 'Soups & Stews',
  'Pasta', 'Baking & Desserts', 'Quick & Easy', 'Budget Friendly', 'Vegetarian'
]

export default function Home() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    fetch('/api/recipes')
      .then(res => res.json())
      .then(data => {
        setRecipes(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load recipes')
        setLoading(false)
      })
  }, [])

  const filtered = recipes.filter(recipe => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      recipe.subreddit.toLowerCase().includes(search.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))

    const matchesCategory =
      activeCategory === 'All' ||
      recipe.tags.some(tag => tag.toLowerCase() === activeCategory.toLowerCase())

    return matchesSearch && matchesCategory
  })

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.eyebrow}>
          <span>●</span> Curated from Reddit
        </div>
        <h1 className={styles.heading}>
          Great recipes,<br /><em>no life stories.</em>
        </h1>
        <p className={styles.subheading}>
          The most upvoted recipes from Reddit's best food communities — clean, straight to the point.
        </p>

        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search recipes, ingredients, subreddits..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <p className={styles.categoriesLabel}>Browse by category</p>
        <div className={styles.categories}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.pill} ${activeCategory === cat ? styles.pillActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <div className={styles.divider}>
        <h2 className={styles.dividerTitle}>All Recipes</h2>
        <div className={styles.dividerLine} />
        <span className={styles.recipeCount}>{filtered.length} recipes</span>
      </div>

      {loading && <p className={styles.state}>Loading recipes...</p>}
      {error && <p className={styles.state}>{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className={styles.state}>No recipes found.</p>
      )}

      <div className={styles.grid}>
        {filtered.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </main>
  )
}