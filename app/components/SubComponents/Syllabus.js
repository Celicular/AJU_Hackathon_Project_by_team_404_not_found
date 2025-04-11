import styles from './SubComponents.module.css';

export default function Syllabus() {
  return (
    <div className={styles.componentContainer}>
      <h1 className={styles.componentTitle}>Syllabus</h1>
      <div className={styles.contentArea}>
        <p className={styles.placeholder}>Course syllabi will be displayed here.</p>
      </div>
    </div>
  );
} 