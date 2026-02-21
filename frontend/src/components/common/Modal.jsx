import styles from './Modal.module.css';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onConfirm, 
  confirmText = 'Confirmar',
  showConfirm = false 
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className={styles.modalContent}>
          {children}
        </div>

        {showConfirm && (
          <div className={styles.modalFooter}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button className={styles.confirmButton} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}