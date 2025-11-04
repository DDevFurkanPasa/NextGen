export default function InvalidQueryPage() {
  return (
    <main>
      <div data-testid="error-message">
        <h1>GraphQL Error</h1>
        <p>Failed to fetch data from Strapi</p>
      </div>
    </main>
  );
}
