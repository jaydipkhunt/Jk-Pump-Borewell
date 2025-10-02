import { QuotationForm } from "../quotation-form";
import { ThemeProvider } from "@/lib/theme-provider";

export default function QuotationFormExample() {
  return (
    <ThemeProvider>
      <div className="max-w-4xl mx-auto p-4">
        <QuotationForm />
      </div>
    </ThemeProvider>
  );
}
