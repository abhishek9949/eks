
export interface ToastMessageProps {
  isOpen: boolean,
  message: string,
  severity: 'success' | 'info' | 'warning' | 'error'
}