export default function LayoutContainer({ children }) {
  return (
    <div
      id="app-scroll-container"
      className="min-h-screen bg-surface overflow-y-auto overflow-x-hidden snap-y snap-mandatory hide-scrollbar"
    >
      {children}
    </div>
  );
}
