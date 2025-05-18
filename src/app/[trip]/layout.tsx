export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // <div className="flex h-[87vh] flex-col md:flex-row md:overflow-hidden">
    <div className="flex flex-col h-screen pb-16 md:flex-row md:overflow-hidden">
      <div className="flex-grow h-screen pb-16 md:overflow-y-auto md:p-12 md:overflow-hidden">{children}</div>
    </div>
  );
}