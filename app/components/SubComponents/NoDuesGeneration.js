import styles from './SubComponents.module.css';

export default function NoDuesGeneration() {
  return (
    <div className={styles.componentContainer}>
      <h1 className={styles.componentTitle}>No Dues Generation</h1>
      <div className={styles.contentArea}>
        <p className={styles.placeholder}>No dues certificate generator will be displayed here.</p>
      </div>
    </div>
  );
} 