import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Welcome to Our ERP System</h1>
          <p className={styles.description}>
            Streamline your business operations with our comprehensive enterprise resource planning solution.
          </p>
          <div className={styles.buttonGroup}>
            <button className="btn btn-primary">Get Started</button>
            <button className={`btn ${styles.btnSecondary}`}>Learn More</button>
          </div>
        </div>
      </div>
    </div>
  )
} 