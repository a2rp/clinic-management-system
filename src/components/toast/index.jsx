import { useEffect } from "react";
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const iconByType = {
  success: FiCheckCircle,
  error: FiAlertTriangle,
  warning: FiAlertTriangle,
  info: FiInfo,
};

const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onDismiss, 4600);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;
  const Icon = iconByType[toast.type] || FiInfo;

  return (
    <div className={[styles.toast, styles[toast.type] || styles.info].join(" ")} role={toast.type === "error" ? "alert" : "status"} aria-live={toast.type === "error" ? "assertive" : "polite"}>
      <Icon className={styles.icon} aria-hidden="true" />
      <p>{toast.message}</p>
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification">
        <FiX aria-hidden="true" />
      </button>
    </div>
  );
};

export default Toast;
