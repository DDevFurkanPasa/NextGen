import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Post - Blog',
  description: 'This is a test blog post for E2E testing',
  openGraph: {
    title: 'Test Post - Blog',
    description: 'This is a test blog post for E2E testing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Test Post - Blog',
  },
};

export default function TestPostPage() {
  return (
    <main>
      <article>
        <h1>Test Post</h1>
        <p>This is a test blog post for E2E testing.</p>
        <p>It includes metadata for SEO testing.</p>
      </article>
    </main>
  );
}
