import styles from './SubComponents.module.css';

export default function Assignments() {
  return (
    <div className={styles.componentContainer}>
      <h1 className={styles.componentTitle}>Assignments</h1>
      <div className={styles.contentArea}>
        <p className={styles.placeholder}>Course assignments will be listed here.</p>
      </div>
    </div>
  );
} 