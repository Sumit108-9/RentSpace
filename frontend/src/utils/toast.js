import { toast } from 'react-toastify';

/**
 * Toast notification utility
 * Standardized toast notifications across the app
 * All toasts auto-close in 500ms (0.5 seconds)
 */

const defaultOptions = {
  position: 'top-right',
  autoClose: 500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  newestOnTop: true,
};

/**
 * Show success toast
 * @param {string} message - Success message
 */
export const showSuccess = (message) => {
  toast.success(message, defaultOptions);
};

/**
 * Show error toast
 * @param {string} message - Error message
 */
export const showError = (message) => {
  toast.error(message, defaultOptions);
};

/**
 * Show info toast
 * @param {string} message - Info message
 */
export const showInfo = (message) => {
  toast.info(message, defaultOptions);
};

/**
 * Show warning toast
 * @param {string} message - Warning message
 */
export const showWarning = (message) => {
  toast.warning(message, defaultOptions);
};

// Default export for convenience
export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
};
