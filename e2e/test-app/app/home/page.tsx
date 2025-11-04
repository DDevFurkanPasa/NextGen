import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - Test App',
  description: 'Home page for E2E testing',
  openGraph: {
    title: 'Home - Test App',
    description: 'Home page for E2E testing',
  },
};

export default function HomePage() {
  return (
    <main>
      <h1>Home</h1>
      <div data-testid="preview-mode" style={{ display: 'none' }}>
        Preview Mode Active
      </div>
      <div data-testid="draft-content" style={{ display: 'none' }}>
        Draft Content
      </div>
      <p>Welcome to the home page</p>
    </main>
  );
}
