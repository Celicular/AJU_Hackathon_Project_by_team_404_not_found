import styles from './SubComponents.module.css';

export default function Attendance() {
  return (
    <div className={styles.componentContainer}>
      <h1 className={styles.componentTitle}>Attendance</h1>
      <div className={styles.contentArea}>
        <p className={styles.placeholder}>Attendance records will be displayed here.</p>
      </div>
    </div>
  );
} 