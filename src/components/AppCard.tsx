import { Check, Trash2, Loader2 } from "lucide-react";
import type { AppName } from "../hooks/useInstaller";
import { ExcelIcon, WordIcon, PowerPointIcon } from "./icons";

interface AppCardProps {
  app: AppName;
  officeInstalled: boolean;
  manifestInstalled: boolean;
  supported: boolean;
  loading: boolean;
  message: string | null;
  error: string | null;
  onInstall: () => void;
  onUninstall: () => void;
}

const appIcons: Record<AppName, typeof ExcelIcon> = {
  Excel: ExcelIcon,
  Word: WordIcon,
  PowerPoint: PowerPointIcon,
};

export function AppCard({
  app,
  officeInstalled,
  manifestInstalled,
  supported,
  loading,
  message,
  error,
  onInstall,
  onUninstall,
}: AppCardProps) {
  const Icon = appIcons[app];
  const comingSoon = !supported;
  const canInstall = supported && officeInstalled;

  return (
    <div>
      <div
        className={`flex items-center justify-between border border-black/[0.08] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.02] px-3 py-2.5 ${
          comingSoon ? "opacity-35" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center">
            <Icon className="h-8 w-8" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-medium">{app}</span>
            {comingSoon && (
              <span className="text-[10px] font-medium uppercase tracking-wider opacity-30">
                Coming Soon
              </span>
            )}
          </div>
        </div>

        {canInstall && (
          <div className="flex items-center gap-3">
            {manifestInstalled ? (
              <>
                <span className="flex items-center gap-1.5 text-sm opacity-50">
                  <Check className="h-4 w-4" />
                  Installed
                </span>
                <button
                  onClick={onUninstall}
                  disabled={loading}
                  className="p-1.5 opacity-25 transition-opacity hover:opacity-50 disabled:opacity-20"
                  title="Uninstall"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={onInstall}
                disabled={loading}
                className="inline-flex items-center gap-1.5 border border-black/[0.12] dark:border-white/[0.12] bg-black/[0.04] dark:bg-white/[0.06] px-4 py-1.5 text-sm font-medium transition-colors hover:bg-black/[0.08] dark:hover:bg-white/[0.1] disabled:opacity-50"
              >
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {loading ? "Installing..." : "Install"}
              </button>
            )}
          </div>
        )}

        {supported && !officeInstalled && (
          <span className="text-xs opacity-25">Not detected</span>
        )}
      </div>

      {(message || error) && (
        <div
          className={`border-x border-b border-black/[0.08] dark:border-white/[0.07] px-4 py-2 text-xs ${
            error ? "text-red-500 dark:text-red-400/80" : "text-emerald-600 dark:text-emerald-400/70"
          }`}
        >
          {error || message}
        </div>
      )}
    </div>
  );
}
