import { Link } from "react-router-dom";
import styles from "./RecipeCard.module.css";

export default function RecipeCard({ recipe }) {
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
  };

  return (
    <Link to={`/recipes/${recipe.id}`} className={styles.card}>
      <div className={styles.img}>
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} />
        ) : (
          <span>🍽️</span>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
        <span className={styles.categoryBadge}>{recipe.category}</span>
          {/* <span className={styles.subreddit}>r/{recipe.subreddit}</span> */}
          <span className={styles.upvotes}>
            ▲ {recipe.upvotes.toLocaleString()}
          </span>
        </div>
        <h2 className={styles.title}>{recipe.title}</h2>
        {/* <p className={styles.desc}>{recipe.description}</p> */}
        <div className={styles.footer}>
          <div className={styles.tags}>
            {recipe.tags.slice(0, 2).map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          {totalTime > 0 && (
            <span className={styles.time}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {formatTime(totalTime)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
