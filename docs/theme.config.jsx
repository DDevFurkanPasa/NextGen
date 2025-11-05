export default {
  logo: <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Strapi-NextGen Framework</span>,
  project: {
    link: 'https://github.com/DDevFurkanPasa/NextGen',
  },
  docsRepositoryBase: 'https://github.com/DDevFurkanPasa/NextGen/tree/main/docs',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Strapi-NextGen',
    };
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Strapi-NextGen Framework" />
      <meta
        property="og:description"
        content="Production-ready, type-safe framework bridging Strapi CMS and Next.js with automatic cache management"
      />
      <link rel="icon" href="/favicon.ico" />
    </>
  ),
  footer: {
    text: (
      <span>
        GPL-3.0 {new Date().getFullYear()} ©{' '}
        <a href="https://github.com/DDevFurkanPasa" target="_blank" rel="noopener noreferrer">
          fuqom
        </a>
        .
      </span>
    ),
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
  },
  editLink: {
    text: 'Edit this page on GitHub →',
  },
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'documentation',
  },
  navigation: {
    prev: true,
    next: true,
  },
};
