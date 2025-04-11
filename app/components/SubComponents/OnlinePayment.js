import styles from './SubComponents.module.css';

export default function OnlinePayment() {
  return (
    <div className={styles.componentContainer}>
      <h1 className={styles.componentTitle}>Online Payment</h1>
      <div className={styles.contentArea}>
        <p className={styles.placeholder}>Payment options will be displayed here.</p>
      </div>
    </div>
  );
} 