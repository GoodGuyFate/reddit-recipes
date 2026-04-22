import { useState, useEffect } from 'react'
import styles from './Admin.module.css'

const EMPTY_FORM = {
  title: '',
  description: '',
  sourceUrl: '',
  subreddit: '',
  upvotes: 0,
  imageUrl: '',
  servings: '',
  prepTime: '',
  cookTime: '',
  difficulty: 'EASY',
  tags: '',
  ingredients: [{ name: '', amount: '', unit: '' }],
  steps: [{ order: 1, instruction: '' }]
}

export default function Admin() {
  const [tab, setTab] = useState('add')

  // ── ADD FORM STATE ──
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  // ── MANAGE STATE ──
  const [recipes, setRecipes] = useState([])
  const [loadingRecipes, setLoadingRecipes] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  useEffect(() => {
    if (tab === 'manage') fetchRecipes()
  }, [tab])

  const fetchRecipes = async () => {
    setLoadingRecipes(true)
    try {
      const res = await fetch('/api/recipes')
      const data = await res.json()
      setRecipes(data)
    } catch {
      setRecipes([])
    }
    setLoadingRecipes(false)
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setRecipes(prev => prev.filter(r => r.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
    setDeletingId(null)
    setConfirmId(null)
  }

  // ── ADD FORM HANDLERS ──
  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const updateIngredient = (index, field, value) => {
    const updated = [...form.ingredients]
    updated[index][field] = value
    setForm(prev => ({ ...prev, ingredients: updated }))
  }

  const addIngredient = () => setForm(prev => ({
    ...prev,
    ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }]
  }))

  const removeIngredient = (index) => setForm(prev => ({
    ...prev,
    ingredients: prev.ingredients.filter((_, i) => i !== index)
  }))

  const updateStep = (index, value) => {
    const updated = [...form.steps]
    updated[index].instruction = value
    setForm(prev => ({ ...prev, steps: updated }))
  }

  const addStep = () => setForm(prev => ({
    ...prev,
    steps: [...prev.steps, { order: prev.steps.length + 1, instruction: '' }]
  }))

  const removeStep = (index) => {
    const updated = form.steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, order: i + 1 }))
    setForm(prev => ({ ...prev, steps: updated }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setStatus(null)

    const payload = {
      ...form,
      upvotes: parseInt(form.upvotes) || 0,
      servings: parseInt(form.servings) || null,
      prepTime: parseInt(form.prepTime) || null,
      cookTime: parseInt(form.cookTime) || null,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      ingredients: form.ingredients.filter(i => i.name),
      steps: form.steps.filter(s => s.instruction)
    }

    try {
      const res = await fetch('/api/recipes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setStatus({ type: 'success', message: 'Recipe added successfully!' })
        setForm(EMPTY_FORM)
      } else {
        const data = await res.json()
        setStatus({ type: 'error', message: data.error || 'Something went wrong' })
      }
    } catch {
      setStatus({ type: 'error', message: 'Failed to connect to server' })
    }

    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Admin</h1>
        <p className={styles.subtitle}>Manage your recipe collection</p>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${tab === 'add' ? styles.tabActive : ''}`}
            onClick={() => setTab('add')}
          >
            Add Recipe
          </button>
          <button
            className={`${styles.tabBtn} ${tab === 'manage' ? styles.tabActive : ''}`}
            onClick={() => setTab('manage')}
          >
            Manage Recipes
          </button>
        </div>

        {/* ── ADD TAB ── */}
        {tab === 'add' && (
          <>
            {status && (
              <div className={`${styles.status} ${styles[status.type]}`}>
                {status.message}
              </div>
            )}

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Basic Info</h2>
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label>Title *</label>
                  <input value={form.title} onChange={e => updateField('title', e.target.value)} placeholder="Crispy Smashed Potatoes" />
                </div>
                <div className={styles.field}>
                  <label>Subreddit *</label>
                  <input value={form.subreddit} onChange={e => updateField('subreddit', e.target.value)} placeholder="recipes" />
                </div>
              </div>
              <div className={styles.field}>
                <label>Description *</label>
                <textarea value={form.description} onChange={e => updateField('description', e.target.value)} placeholder="Short description..." rows={3} />
              </div>
              <div className={styles.field}>
                <label>Reddit Post URL *</label>
                <input value={form.sourceUrl} onChange={e => updateField('sourceUrl', e.target.value)} placeholder="https://reddit.com/r/..." />
              </div>
              <div className={styles.field}>
                <label>Image URL</label>
                <input value={form.imageUrl} onChange={e => updateField('imageUrl', e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Details</h2>
              <div className={styles.grid4}>
                <div className={styles.field}>
                  <label>Upvotes</label>
                  <input type="number" value={form.upvotes} onChange={e => updateField('upvotes', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>Servings</label>
                  <input type="number" value={form.servings} onChange={e => updateField('servings', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>Prep Time (min)</label>
                  <input type="number" value={form.prepTime} onChange={e => updateField('prepTime', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>Cook Time (min)</label>
                  <input type="number" value={form.cookTime} onChange={e => updateField('cookTime', e.target.value)} />
                </div>
              </div>
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label>Difficulty</label>
                  <select value={form.difficulty} onChange={e => updateField('difficulty', e.target.value)}>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => updateField('tags', e.target.value)} placeholder="pasta, quick, vegetarian" />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Ingredients</h2>
              {form.ingredients.map((ing, i) => (
                <div key={i} className={styles.ingredientRow}>
                  <input placeholder="Amount" value={ing.amount} onChange={e => updateIngredient(i, 'amount', e.target.value)} className={styles.small} />
                  <input placeholder="Unit" value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)} className={styles.small} />
                  <input placeholder="Ingredient name" value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)} className={styles.grow} />
                  <button className={styles.removeBtn} onClick={() => removeIngredient(i)}>✕</button>
                </div>
              ))}
              <button className={styles.addBtn} onClick={addIngredient}>+ Add Ingredient</button>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Steps</h2>
              {form.steps.map((step, i) => (
                <div key={i} className={styles.stepRow}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <textarea
                    placeholder={`Step ${i + 1}...`}
                    value={step.instruction}
                    onChange={e => updateStep(i, e.target.value)}
                    rows={2}
                    className={styles.grow}
                  />
                  <button className={styles.removeBtn} onClick={() => removeStep(i)}>✕</button>
                </div>
              ))}
              <button className={styles.addBtn} onClick={addStep}>+ Add Step</button>
            </div>

            <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Adding...' : 'Add Recipe'}
            </button>
          </>
        )}

        {/* ── MANAGE TAB ── */}
        {tab === 'manage' && (
          <div className={styles.manageList}>
            {loadingRecipes && <p className={styles.manageState}>Loading recipes...</p>}
            {!loadingRecipes && recipes.length === 0 && (
              <p className={styles.manageState}>No recipes yet.</p>
            )}
            {recipes.map(recipe => (
              <div key={recipe.id} className={styles.manageRow}>
                <div className={styles.manageInfo}>
                  {recipe.imageUrl && (
                    <div className={styles.manageThumb}>
                      <img src={recipe.imageUrl} alt={recipe.title} />
                    </div>
                  )}
                  <div>
                    <p className={styles.manageTitle}>{recipe.title}</p>
                    <p className={styles.manageMeta}>r/{recipe.subreddit} · ▲ {recipe.upvotes.toLocaleString()}</p>
                  </div>
                </div>

                <div className={styles.manageActions}>
                  {confirmId === recipe.id ? (
                    <>
                      <span className={styles.confirmText}>Sure?</span>
                      <button
                        className={styles.confirmDeleteBtn}
                        onClick={() => handleDelete(recipe.id)}
                        disabled={deletingId === recipe.id}
                      >
                        {deletingId === recipe.id ? 'Deleting...' : 'Yes, delete'}
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => setConfirmId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setConfirmId(recipe.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}