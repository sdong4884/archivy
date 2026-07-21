import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ArchiveBoxIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
import { useAuthStore } from "../../store/authStore";

export function Layout() {
  const user = useAuthStore((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleGoogleLogin = async () => {
    await signInWithPopup(auth, googleProvider);
    navigate("/");
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-gray-100">
      <header className="flex shrink-0 items-center justify-between border-b border-gray-800 px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <ArchiveBoxIcon className="h-6 w-6" />
          <span className="text-xl font-semibold">Archivy</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/search" aria-label="검색">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </Link>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen((open) => !open)}
                className="cursor-pointer"
              >
                <img
                  src={user.photoURL ?? undefined}
                  alt={user.displayName ?? "사용자"}
                  className="h-8 w-8 rounded-full"
                />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded border border-gray-700 bg-gray-800 shadow-md">
                  <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer px-4 py-2 text-left text-sm hover:bg-gray-700"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="cursor-pointer rounded border border-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-800"
            >
              로그인
            </button>
          )}
        </div>
      </header>
      <main className="flex flex-1 flex-col p-4">
        <Outlet />
      </main>
    </div>
  );
}
