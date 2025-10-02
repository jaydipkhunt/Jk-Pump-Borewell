import { QuotationHistory } from "../quotation-history";
import { ThemeProvider } from "@/lib/theme-provider";

export default function QuotationHistoryExample() {
  return (
    <ThemeProvider>
      <div className="max-w-4xl mx-auto p-4">
        <QuotationHistory />
      </div>
    </ThemeProvider>
  );
}
