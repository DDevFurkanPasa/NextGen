import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Test App',
  description: 'About page for E2E testing',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main>
      <h1>About</h1>
      <p>This is the about page for E2E testing.</p>
    </main>
  );
}
