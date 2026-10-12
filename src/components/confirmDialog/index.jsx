import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const ConfirmDialog = ({ title, description, confirmLabel = "Remove", onConfirm, onClose }) => {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  const confirmAction = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className={styles.backdrop} onMouseDown={handleBackdropClick}>
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description">
        <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close confirmation">
          <FiX aria-hidden="true" />
        </button>
        <div className={styles.alertIcon}><FiAlertTriangle aria-hidden="true" /></div>
        <p className={styles.label}>Please confirm</p>
        <h2 id="confirm-title">{title}</h2>
        <p className={styles.description} id="confirm-description">{description}</p>
        <div className={styles.actions}>
          <button className={styles.cancelButton} type="button" ref={cancelButtonRef} onClick={onClose}>Keep it</button>
          <button className={styles.confirmButton} type="button" onClick={confirmAction}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmDialog;
