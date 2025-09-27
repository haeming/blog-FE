import TopBar from "./TopBar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 w-full bg-custom-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4">
          <TopBar/>
        </div>
      </header>

      <main className="max-w-[1024px] mx-auto px-4">
        {children}
      </main>
    </div>
  );
}
