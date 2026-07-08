/**
 * Global loading UI — shown instantly during page transitions.
 * Makes navigation feel snappy even if the page takes time to render.
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
