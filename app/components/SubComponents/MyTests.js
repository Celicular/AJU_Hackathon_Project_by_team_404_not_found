import styles from './SubComponents.module.css';

export default function MyTests() {
  return (
    <div className={styles.componentContainer}>
      <h1 className={styles.componentTitle}>My Tests</h1>
      <div className={styles.contentArea}>
        <p className={styles.placeholder}>Upcoming and past tests will be displayed here.</p>
      </div>
    </div>
  );
} 