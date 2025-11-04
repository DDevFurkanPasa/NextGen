'use client';

import { useEffect } from 'react';

function ErrorComponent() {
  useEffect(() => {
    // Intentionally throw error for testing error boundary
    throw new Error('Intentional test error');
  }, []);

  return <div>This should not render</div>;
}

function ErrorFallback() {
  return (
    <div data-testid="error-fallback">
      <h1>Something went wrong</h1>
      <p>An error occurred while rendering this component.</p>
    </div>
  );
}

export default function ErrorTestPage() {
  try {
    return <ErrorComponent />;
  } catch (error) {
    return <ErrorFallback />;
  }
}
