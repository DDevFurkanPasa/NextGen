import type { Metadata } from 'next';
import LocaleSwitcher from './components/LocaleSwitcher';

export const metadata: Metadata = {
  title: 'Test App - Strapi NextGen Framework',
  description: 'E2E test application for Strapi NextGen Framework',
  openGraph: {
    title: 'Test App - Strapi NextGen Framework',
    description: 'E2E test application for Strapi NextGen Framework',
  },
};

export default function Home() {
  return (
    <main>
      <h1 data-testid="title">Test App</h1>
      <LocaleSwitcher />
      <div data-component="hero">
        <p>Framework is working!</p>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Test App',
            description: 'E2E test application',
          }),
        }}
      />
    </main>
  );
}