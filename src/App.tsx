import { AppCard } from "./components/AppCard";
import { useInstaller, type AppName } from "./hooks/useInstaller";
import { ExcelIcon, WordIcon, PowerPointIcon, OptiviseLogo } from "./components/icons";
import { Loader2, Trash2 } from "lucide-react";

const APP_ORDER: AppName[] = ["Excel", "Word", "PowerPoint"];

const launchIcons: Record<AppName, typeof ExcelIcon> = {
  Excel: ExcelIcon,
  Word: WordIcon,
  PowerPoint: PowerPointIcon,
};

export default function App() {
  const { apps, initialLoading, installManifest, uninstallManifest, uninstallAll, openApp } =
    useInstaller();

  const launchableApps = APP_ORDER.filter(
    (name) => apps[name].supported && apps[name].officeInstalled,
  );

  const hasAnyInstalled = APP_ORDER.some((name) => apps[name].manifestInstalled);

  return (
    <div className="flex h-screen select-none">
      {/* Draggable title bar — full width, above everything */}
      <div
        data-tauri-drag-region
        className="fixed inset-x-0 top-0 z-[9999] h-11"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      />

      {/* Left Panel — Installer (transparent for vibrancy) */}
      <div className="flex w-[55%] flex-col">
        <div className="flex-1 overflow-auto px-6 pt-12 pb-6">
          {initialLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin opacity-30" />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Section 1 — Install */}
              <section className="border border-black/[0.08] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.02]">
                <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
                  <span className="text-sm font-medium opacity-40">1.</span>
                  <h2 className="text-sm font-semibold opacity-80">To install</h2>
                </div>
                <div className="flex flex-col gap-2 px-3 pb-3">
                  {APP_ORDER.map((name) => {
                    const state = apps[name];
                    return (
                      <AppCard
                        key={name}
                        app={name}
                        officeInstalled={state.officeInstalled}
                        manifestInstalled={state.manifestInstalled}
                        supported={state.supported}
                        loading={state.loading}
                        message={state.message}
                        error={state.error}
                        onInstall={() => installManifest(name)}
                        onUninstall={() => uninstallManifest(name)}
                      />
                    );
                  })}
                </div>
              </section>

              {/* Section 2 — Open Apps */}
              <section className="border border-black/[0.08] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.02]">
                <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
                  <span className="text-sm font-medium opacity-40">2.</span>
                  <h2 className="text-sm font-semibold opacity-80">Open Microsoft 365 apps</h2>
                </div>
                <div className="flex gap-2 px-4 pb-4">
                  {launchableApps.length > 0 ? (
                    launchableApps.map((name) => {
                      const Icon = launchIcons[name];
                      return (
                        <button
                          key={name}
                          onClick={() => openApp(name)}
                          className="flex h-16 w-16 items-center justify-center border border-black/[0.08] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.03] transition-all hover:bg-black/[0.05] dark:hover:bg-white/[0.07]"
                          title={`Open ${name}`}
                        >
                          <Icon className="h-8 w-8" />
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-xs opacity-25">Install an add-in first</p>
                  )}
                </div>
              </section>

              {/* Section 3 — Add-ins */}
              <section className="border border-black/[0.08] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.02]">
                <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
                  <span className="text-sm font-medium opacity-40">3.</span>
                  <h2 className="text-sm font-semibold opacity-80">Click Add-ins and sign in</h2>
                </div>
                <p className="px-4 pb-4 text-xs leading-relaxed opacity-30">
                  In the ribbon, click Add-ins and look for Optivise AI. If it doesn't appear, restart the Office app.
                </p>
              </section>

              {/* Uninstall All */}
              {hasAnyInstalled && (
                <button
                  onClick={uninstallAll}
                  className="flex items-center justify-center gap-1.5 py-2 text-[11px] opacity-20 transition-opacity hover:opacity-40"
                >
                  <Trash2 className="h-3 w-3" />
                  Uninstall all add-ins
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel — Hero */}
      <div className="relative flex w-[45%] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0D1F17] via-[#152E22] to-[#0a1a10]">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2A4A3A] opacity-20 blur-[80px]" />

        {/* Content */}
        <div className="relative flex flex-col items-center gap-6 px-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.08] shadow-lg shadow-black/20">
            <OptiviseLogo className="h-8 w-8 text-white/70" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white/90">
              Optivise Installer
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-white/35">
              Install the Optivise AI add-in for your Microsoft Office apps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-white/10" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-[#C9A962]/50">
              Optivise
            </span>
            <div className="h-px w-8 bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
