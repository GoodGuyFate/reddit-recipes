import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styles from './Recipe.module.css'

const formatTime = (minutes) => {
  if (!minutes) return null
  if (minutes < 60) return `${minutes} min`
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`
}

const difficultyLabel = { EASY: 'Easy', MEDIUM: 'Medium', HARD: 'Hard' }

export default function Recipe() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [checkedSteps, setCheckedSteps] = useState({})

  useEffect(() => {
    fetch(`/api/recipes/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Recipe not found')
        return res.json()
      })
      .then(data => {
        setRecipe(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  const toggleStep = (i) => {
    setCheckedSteps(prev => ({ ...prev, [i]: !prev[i] }))
  }

  if (loading) return (
    <div className={styles.state}>
      <div className={styles.spinner} />
      <p>Loading recipe...</p>
    </div>
  )

  if (error) return (
    <div className={styles.state}>
      <p className={styles.errorMsg}>{error}</p>
      <Link to="/" className={styles.backLink}>← Back to recipes</Link>
    </div>
  )

  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)

  return (
    <div className={styles.page}>

      {/* ── HEADER ── */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
        
          <div className={styles.headerLeft}>
            <Link to="/" className={styles.back}>← All Recipes</Link>

            <div className={styles.eyebrow}>
              {/* <span className={styles.subreddit}>r/{recipe.subreddit}</span> */}
              <span className={styles.upvotes}>▲ {recipe.upvotes.toLocaleString()} upvotes</span>
            </div>

            <h1 className={styles.title}>{recipe.title}</h1>
            <p className={styles.description}>{recipe.description}</p>

            <div className={styles.tags}>
              {recipe.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>

            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.redditLink}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
              View original post
            </a>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.statsCard}>
              {recipe.prepTime && (
                <div className={styles.stat}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  <div>
                    <span className={styles.statLabel}>Prep</span>
                    <span className={styles.statValue}>{formatTime(recipe.prepTime)}</span>
                  </div>
                </div>
              )}
              {recipe.cookTime && (
                <div className={styles.stat}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2v4M4.93 4.93l2.83 2.83M2 12h4M4.93 19.07l2.83-2.83M12 22v-4M19.07 19.07l-2.83-2.83M22 12h-4M19.07 4.93l-2.83 2.83"/>
                  </svg>
                  <div>
                    <span className={styles.statLabel}>Cook</span>
                    <span className={styles.statValue}>{formatTime(recipe.cookTime)}</span>
                  </div>
                </div>
              )}
              {totalTime > 0 && (
                <div className={styles.stat}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    <path d="M12 6v6l3 3"/>
                  </svg>
                  <div>
                    <span className={styles.statLabel}>Total</span>
                    <span className={styles.statValue}>{formatTime(totalTime)}</span>
                  </div>
                </div>
              )}
              {recipe.servings && (
                <div className={styles.stat}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <div>
                    <span className={styles.statLabel}>Serves</span>
                    <span className={styles.statValue}>{recipe.servings}</span>
                  </div>
                </div>
              )}
              {recipe.difficulty && (
                <div className={styles.stat}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 20h20M5 20V10l7-7 7 7v10"/>
                  </svg>
                  <div>
                    <span className={styles.statLabel}>Difficulty</span>
                    <span className={styles.statValue}>{difficultyLabel[recipe.difficulty]}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO IMAGE ── */}
      {recipe.imageUrl && (
        <div className={styles.heroImage}>
          <img src={recipe.imageUrl} alt={recipe.title} />
        </div>
      )}

      {/* ── BODY ── */}
      <div className={styles.body}>

        {/* Ingredients */}
        <div className={styles.ingredientsCol}>
          <div className={styles.ingredientsCard}>
            <h2 className={styles.sectionTitle}>Ingredients</h2>
            <ul className={styles.ingredientList}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className={styles.ingredient}>
                  <span className={styles.ingredientDot} />
                  <span>
                    {ing.amount && <strong>{ing.amount}</strong>}
                    {ing.unit && <span> {ing.unit}</span>}
                    {ing.name && <span> {ing.name}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Steps */}
        <div className={styles.stepsCol}>
          <h2 className={styles.sectionTitle}>Instructions</h2>
          <ol className={styles.stepList}>
            {recipe.steps.map((step, i) => (
              <li
                key={i}
                className={`${styles.step} ${checkedSteps[i] ? styles.stepDone : ''}`}
                onClick={() => toggleStep(i)}
              >
                <div className={styles.stepNum}>{i + 1}</div>
                <p className={styles.stepText}>{step.instruction}</p>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  )
}