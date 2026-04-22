import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        reddit<span>recipes</span>
      </Link>
      <div className={styles.right}>
        <Link to="/" className={styles.navLink}>Browse</Link>
        <Link to="/submit" className={styles.navLink}>Submit a Recipe</Link>
        <div className={styles.toggleWrap}>
          <span className={styles.toggleLabel}>{darkMode ? 'Dark' : 'Light'}</span>
          <button
            className={styles.toggle}
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          />
        </div>
      </div>
    </nav>
  )
}