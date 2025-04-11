import styles from './SubComponents.module.css';

export default function ReceiptGeneration() {
  return (
    <div className={styles.componentContainer}>
      <h1 className={styles.componentTitle}>Receipt Generation</h1>
      <div className={styles.contentArea}>
        <p className={styles.placeholder}>Receipt generation tools will be displayed here.</p>
      </div>
    </div>
  );
} 