import { SettingsPage } from "@/components/settings-page";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Settings</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <SettingsPage />
      </main>
    </div>
  );
}
