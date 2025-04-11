import styles from './SubComponents.module.css';

export default function LectureNotes() {
  return (
    <div className={styles.componentContainer}>
      <h1 className={styles.componentTitle}>Lecture Notes</h1>
      <div className={styles.contentArea}>
        <p className={styles.placeholder}>Course lecture notes will be available here.</p>
      </div>
    </div>
  );
} 