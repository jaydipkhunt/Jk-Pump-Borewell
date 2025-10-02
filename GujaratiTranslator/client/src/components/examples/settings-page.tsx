import { SettingsPage } from "../settings-page";
import { ThemeProvider } from "@/lib/theme-provider";

export default function SettingsPageExample() {
  return (
    <ThemeProvider>
      <div className="max-w-4xl mx-auto p-4">
        <SettingsPage />
      </div>
    </ThemeProvider>
  );
}
