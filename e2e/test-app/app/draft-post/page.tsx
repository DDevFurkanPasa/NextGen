export default function DraftPostPage() {
  return (
    <main>
      <div data-testid="preview-mode">
        <p>Preview Mode Active</p>
      </div>
      <div data-testid="draft-content">
        <h1>Draft Post</h1>
        <p>This is draft content only visible in preview mode</p>
      </div>
    </main>
  );
}
