import { RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  onRefresh: () => void;
}

export function Layout({ children, onRefresh }: LayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6" />
              <path d="M10 22h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 tracking-wide">OPTIVISE</h1>
            <p className="text-[11px] text-gray-400">Office Add-in Installer</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          title="Refresh status"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto px-6 py-5">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white px-6 py-3">
        <p className="text-center text-[11px] text-gray-400">
          After installing, restart the Office app to see Optivise in the Add-ins ribbon.
        </p>
        <p className="mt-1 text-center text-[11px]">
          <a
            href="https://optivise.app/help"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600"
          >
            Need help?
          </a>
        </p>
      </footer>
    </div>
  );
}
