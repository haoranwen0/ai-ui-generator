import React, { ErrorInfo, ReactNode, useEffect, useState } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const errorHandler = (error: Error, errorInfo: ErrorInfo) => {
      console.error('ErrorBoundary caught an error: ', error, errorInfo)
      setHasError(true)
    }

    window.addEventListener('error', errorHandler as unknown as EventListener)

    return () => {
      window.removeEventListener(
        'error',
        errorHandler as unknown as EventListener
      )
    }
  }, [])

  if (hasError) {
    return <h1>Something went wrong.</h1>
  }

  return <>{children}</>
}

export default ErrorBoundary
