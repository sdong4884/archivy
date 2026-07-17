import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-semibold">Archivy</h1>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
