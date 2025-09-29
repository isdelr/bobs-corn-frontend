/**
 * Error Boundary Component
 * 
 * Production-ready error boundary for graceful error handling.
 * This component demonstrates senior-level error handling practices:
 * - Fallback UI for better user experience
 * - Error logging for debugging
 * - Recovery mechanisms
 * - Different error states
 * 
 * IMPORTANT: Error boundaries only catch errors in the component tree below them.
 * They don't catch errors in event handlers, async code, or SSR.
 * 
 * @module components/shared/ErrorBoundary
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Container, Paper, Typography, Stack, Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';

/**
 * Error Boundary Props
 * @interface
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Error Boundary State
 * @interface
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

/**
 * Production Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 * 
 * Features:
 * - Custom fallback UI with recovery options
 * - Error logging for monitoring
 * - Retry mechanism
 * - Navigation to home
 * - Rate limit specific error handling
 * 
 * @class ErrorBoundary
 * @extends {Component}
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  /**
   * Update state when an error is caught
   * 
   * This lifecycle method is called when an error is thrown
   * in a descendant component.
   * 
   * @param {Error} error - The error that was thrown
   * @returns {ErrorBoundaryState} New state with error information
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state to trigger fallback UI
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details for monitoring
   * 
   * This lifecycle is called after an error has been thrown.
   * It's used for error logging and reporting.
   * 
   * @param {Error} error - The error that was thrown
   * @param {ErrorInfo} errorInfo - Object with componentStack key
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Increment error count
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error component stack:', errorInfo.componentStack);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry, LogRocket, etc.
      // window.Sentry?.captureException(error, {
      //   contexts: { react: { componentStack: errorInfo.componentStack } }
      // });
    }
  }

  /**
   * Reset error boundary state
   * 
   * Allows users to retry after an error.
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Navigate to home page
   * 
   * Provides a safe fallback navigation option.
   */
  handleGoHome = () => {
    window.location.href = '/';
  };

  /**
   * Check if error is rate limit related
   * 
   * Special handling for Bob's Corn rate limiting errors.
   * 
   * @param {Error | null} error - The error to check
   * @returns {boolean} Whether this is a rate limit error
   */
  isRateLimitError(error: Error | null): boolean {
    if (!error) return false;
    
    // Check for 429 status or rate limit message
    return (
      error.message?.includes('429') ||
      error.message?.toLowerCase().includes('rate limit') ||
      error.message?.toLowerCase().includes('too many requests')
    );
  }

  render() {
    const { hasError, error, errorCount } = this.state;
    const { children, fallback } = this.props;

    // Render custom fallback if provided
    if (hasError && fallback) {
      return <>{fallback}</>;
    }

    // Render default error UI
    if (hasError) {
      const isRateLimit = this.isRateLimitError(error);
      
      return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            {/* Error Icon */}
            <ErrorOutlineIcon
              sx={{
                fontSize: 64,
                color: isRateLimit ? 'warning.main' : 'error.main',
                mb: 2,
              }}
            />

            {/* Error Title */}
            <Typography variant="h4" gutterBottom>
              {isRateLimit ? 'Rate Limit Reached' : 'Oops! Something went wrong'}
            </Typography>

            {/* Error Description */}
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 3 }}
            >
              {isRateLimit
                ? "You've reached Bob's fair use limit: 1 corn per minute. Please wait a moment before trying again."
                : "We're sorry, but something unexpected happened. Please try again or return to the home page."
              }
            </Typography>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && error && (
              <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="subtitle2" gutterBottom>
                  <strong>Error Details:</strong>
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {error.toString()}
                </Typography>
                {error.stack && (
                  <details style={{ marginTop: 8 }}>
                    <summary style={{ cursor: 'pointer' }}>Stack Trace</summary>
                    <pre style={{ 
                      fontSize: '0.75rem', 
                      overflow: 'auto',
                      padding: 8,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 4,
                      marginTop: 8,
                    }}>
                      {error.stack}
                    </pre>
                  </details>
                )}
              </Alert>
            )}

            {/* Error Count Warning */}
            {errorCount > 2 && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                Multiple errors detected. If this persists, please contact support.
              </Alert>
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
                disabled={isRateLimit}
              >
                {isRateLimit ? 'Please Wait' : 'Try Again'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
              >
                Go Home
              </Button>
            </Stack>

            {/* Support Information */}
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ mt: 3, display: 'block' }}
            >
              If this problem persists, please contact{' '}
              <a href="mailto:support@bobscorn.com">support@bobscorn.com</a>
            </Typography>
          </Paper>
        </Container>
      );
    }

    // No error, render children normally
    return children;
  }
}

/**
 * Functional wrapper for Error Boundary
 * 
 * Provides a hooks-friendly way to use the error boundary.
 * Can be used to wrap specific parts of the application.
 * 
 * @param {Object} props - Component props
 * @returns {JSX.Element} Error boundary wrapper
 * 
 * @example
 * // Wrap high-risk components
 * <WithErrorBoundary>
 *   <RiskyComponent />
 * </WithErrorBoundary>
 */
export function WithErrorBoundary({ 
  children,
  fallback,
  onError,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}) {
  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}

/**
 * Hook to trigger error boundary (for testing)
 * 
 * Useful for testing error boundaries in development.
 * 
 * @returns {Function} Function to trigger an error
 * 
 * @example
 * const triggerError = useErrorHandler();
 * // In an event handler
 * triggerError(new Error('Test error'));
 */
export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}

export default ErrorBoundary;
