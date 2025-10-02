import { useState } from "react";
import { Search, Eye, Edit, Copy, Trash2, FileDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getQuotations,
  deleteQuotation,
  duplicateQuotation,
  type Quotation,
} from "@/lib/quotation-storage";
import { generatePDF } from "@/lib/pdf-export";
import { useToast } from "@/hooks/use-toast";

interface QuotationHistoryProps {
  onEdit?: (quotation: Quotation) => void;
  onView?: (quotation: Quotation) => void;
}

export function QuotationHistory({ onEdit, onView }: QuotationHistoryProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [quotations, setQuotations] = useState<Quotation[]>(getQuotations());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredQuotations = quotations.filter(
    (q) =>
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteQuotation(deleteId);
      setQuotations(getQuotations());
      setDeleteId(null);
      toast({
        title: "Success",
        description: "Quotation deleted successfully",
      });
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateQuotation(id);
    setQuotations(getQuotations());
    toast({
      title: "Success",
      description: "Quotation duplicated successfully",
    });
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by customer name or quotation number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search-quotations"
        />
      </div>

      {filteredQuotations.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {searchQuery ? "No quotations found matching your search" : "No quotations yet"}
          </p>
        </Card>
      )}

      <div className="space-y-3">
        {filteredQuotations.map((quotation) => (
          <Card key={quotation.id} className="p-4 hover-elevate" data-testid={`card-quotation-${quotation.id}`}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg" data-testid={`text-customer-${quotation.id}`}>
                    {quotation.customerName}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`text-quotation-number-${quotation.id}`}>
                    {quotation.quotationNumber} • {new Date(quotation.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary tabular-nums" data-testid={`text-amount-${quotation.id}`}>
                    ₹{quotation.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {quotation.items.length} item{quotation.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {onView && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(quotation)}
                    data-testid={`button-view-${quotation.id}`}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(quotation)}
                    data-testid={`button-edit-${quotation.id}`}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicate(quotation.id)}
                  data-testid={`button-duplicate-${quotation.id}`}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generatePDF(quotation)}
                  data-testid={`button-pdf-${quotation.id}`}
                >
                  <FileDown className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteId(quotation.id)}
                  data-testid={`button-delete-${quotation.id}`}
                >
                  <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quotation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quotation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
