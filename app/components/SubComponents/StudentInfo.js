import styles from './SubComponents.module.css';

export default function StudentInfo() {
  return (
    <div className={styles.componentContainer}>
      <h1 className={styles.componentTitle}>Student Information</h1>
      <div className={styles.contentArea}>
        <p className={styles.placeholder}>Student information will be displayed here.</p>
      </div>
    </div>
  );
} 