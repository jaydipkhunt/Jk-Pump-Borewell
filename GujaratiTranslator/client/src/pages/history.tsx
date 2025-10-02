import { useState } from "react";
import { useLocation } from "wouter";
import { QuotationHistory } from "@/components/quotation-history";
import { QuotationForm } from "@/components/quotation-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Quotation } from "@/lib/quotation-storage";

export default function History() {
  const [, setLocation] = useLocation();
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);

  if (editingQuotation) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 bg-card border-b">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingQuotation(null)}
              data-testid="button-back-to-history"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to History
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4">
          <QuotationForm
            initialQuotation={editingQuotation}
            onSave={() => setEditingQuotation(null)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Quotation History</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <QuotationHistory
          onEdit={(quotation) => setEditingQuotation(quotation)}
          onView={(quotation) => console.log("View quotation:", quotation)}
        />
      </main>
    </div>
  );
}
