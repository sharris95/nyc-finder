import { useEffect } from 'react'

type ToastProps = {
  message: string | null
  onClose: () => void
}

const Toast = ({ message, onClose }: ToastProps) => {
  useEffect(() => {
    if (!message) {
      return
    }

    const timer = window.setTimeout(() => {
      onClose()
    }, 2200)

    return () => {
      window.clearTimeout(timer)
    }
  }, [message, onClose])

  if (!message) {
    return null
  }

  return <div className="toast">{message}</div>
}

export default Toast
