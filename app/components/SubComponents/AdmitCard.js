import styles from './SubComponents.module.css';

export default function AdmitCard() {
  return (
    <div className={styles.componentContainer}>
      <h1 className={styles.componentTitle}>Admit Card</h1>
      <div className={styles.contentArea}>
        <p className={styles.placeholder}>Exam admit cards will be available for download here.</p>
      </div>
    </div>
  );
} 