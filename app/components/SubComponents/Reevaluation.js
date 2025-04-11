import styles from './SubComponents.module.css';

export default function Reevaluation() {
  return (
    <div className={styles.componentContainer}>
      <h1 className={styles.componentTitle}>Re-evaluation</h1>
      <div className={styles.contentArea}>
        <p className={styles.placeholder}>Exam re-evaluation requests can be submitted here.</p>
      </div>
    </div>
  );
} 