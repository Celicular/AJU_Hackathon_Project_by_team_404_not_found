import styles from './SubComponents.module.css';

export default function TimeTable() {
  return (
    <div className={styles.componentContainer}>
      <h1 className={styles.componentTitle}>Time Table</h1>
      <div className={styles.contentArea}>
        <p className={styles.placeholder}>Class and exam time table will be displayed here.</p>
      </div>
    </div>
  );
} 