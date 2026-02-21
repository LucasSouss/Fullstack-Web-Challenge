import styles from './Notification.module.css';

export default function Notification({ notifications, onClose }) {
  if (notifications.length === 0) return null;

  return (
    <div className={styles.notificationContainer}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.notification} ${styles[notification.type]}`}
        >
          <div className={styles.notificationContent}>
            <p>{notification.message}</p>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => onClose(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}