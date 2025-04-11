import styles from './SubComponents.module.css';

export default function Result() {
  return (
    <div className={styles.componentContainer}>
      <h1 className={styles.componentTitle}>Exam Results</h1>
      <div className={styles.contentArea}>
        <p className={styles.placeholder}>Examination results will be displayed here.</p>
      </div>
    </div>
  );
} 