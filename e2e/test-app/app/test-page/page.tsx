export default function TestPage() {
  return (
    <main>
      <h1 data-testid="title">Test Page</h1>
      <div data-component="sections.hero">
        <h2>Hero Component</h2>
        <p>This is a hero section</p>
      </div>
      <div data-component="sections.features">
        <h2>Features Component</h2>
        <p>This is a features section</p>
      </div>
      <div data-component="sections.cta">
        <h2>CTA Component</h2>
        <p>This is a call-to-action section</p>
      </div>
    </main>
  );
}
