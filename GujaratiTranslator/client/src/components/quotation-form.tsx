import { useState, useEffect } from "react";
import { Plus, Trash2, Share2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  generateQuotationNumber,
  saveQuotation,
  defaultItems,
  type Quotation,
  type QuotationItem,
} from "@/lib/quotation-storage";
import { generatePDF, shareViaWhatsApp, shareViaEmail } from "@/lib/pdf-export";
import { useToast } from "@/hooks/use-toast";

interface QuotationFormProps {
  initialQuotation?: Quotation;
  onSave?: () => void;
}

export function QuotationForm({ initialQuotation, onSave }: QuotationFormProps) {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState(initialQuotation?.customerName || "");
  const [date, setDate] = useState(
    initialQuotation?.date || new Date().toISOString().split("T")[0]
  );
  const [quotationNumber, setQuotationNumber] = useState(
    initialQuotation?.quotationNumber || generateQuotationNumber()
  );
  
  const getDefaultItems = (): QuotationItem[] => {
    if (initialQuotation?.items) {
      return initialQuotation.items;
    }
    
    const SETTINGS_KEY = "borwell_settings";
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return [];
    
    const settings = JSON.parse(saved);
    const defaultItems = settings.defaultItems || [];
    
    return defaultItems
      .filter((item: any) => item.name && item.pricePerUnit)
      .map((item: any) => ({
        id: crypto.randomUUID(),
        name: item.name,
        quantity: 1,
        pricePerUnit: item.pricePerUnit,
      }));
  };
  
  const [items, setItems] = useState<QuotationItem[]>(getDefaultItems());
  const [notes, setNotes] = useState(
    initialQuotation?.notes || "• One year warranty included\n• Soil hardness extra cost if applicable"
  );

  const total = items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);

  const addItem = (itemName?: string, price?: number) => {
    const newItem: QuotationItem = {
      id: crypto.randomUUID(),
      name: itemName || "",
      quantity: 1,
      pricePerUnit: price || 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (!customerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter customer name",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item",
        variant: "destructive",
      });
      return;
    }

    const quotation: Quotation = {
      id: initialQuotation?.id || crypto.randomUUID(),
      quotationNumber,
      customerName,
      date,
      items,
      notes,
      total,
    };

    saveQuotation(quotation);
    toast({
      title: "Success",
      description: "Quotation saved successfully",
    });

    if (onSave) {
      onSave();
    } else {
      setCustomerName("");
      setDate(new Date().toISOString().split("T")[0]);
      setQuotationNumber(generateQuotationNumber());
      setItems(getDefaultItems());
    }
  };

  const handleExportPDF = () => {
    if (!customerName.trim() || items.length === 0) {
      toast({
        title: "Error",
        description: "Please complete the quotation before exporting",
        variant: "destructive",
      });
      return;
    }

    const quotation: Quotation = {
      id: initialQuotation?.id || crypto.randomUUID(),
      quotationNumber,
      customerName,
      date,
      items,
      notes,
      total,
    };

    generatePDF(quotation);
    toast({
      title: "Success",
      description: "PDF downloaded successfully",
    });
  };

  const handleShareWhatsApp = () => {
    if (!customerName.trim() || items.length === 0) {
      toast({
        title: "Error",
        description: "Please complete the quotation before sharing",
        variant: "destructive",
      });
      return;
    }

    const quotation: Quotation = {
      id: initialQuotation?.id || crypto.randomUUID(),
      quotationNumber,
      customerName,
      date,
      items,
      notes,
      total,
    };

    shareViaWhatsApp(quotation);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <Card className="p-4 md:p-6 space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="quotation-number">Quotation Number</Label>
            <Input
              id="quotation-number"
              value={quotationNumber}
              readOnly
              className="bg-muted"
              data-testid="input-quotation-number"
            />
          </div>

          <div>
            <Label htmlFor="customer-name">Customer Name *</Label>
            <Input
              id="customer-name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              data-testid="input-customer-name"
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-testid="input-date"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Items</h3>
          <Select onValueChange={(value) => {
            const item = defaultItems.find(i => i.name === value);
            if (item) addItem(item.name, item.pricePerUnit);
          }}>
            <SelectTrigger className="w-48" data-testid="select-add-item">
              <SelectValue placeholder="Quick add item" />
            </SelectTrigger>
            <SelectContent>
              {defaultItems.map((item) => (
                <SelectItem key={item.name} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No items added. Use the dropdown above or add custom item below.
            </p>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-2 items-center bg-accent/50 p-2 rounded-md"
            >
              <Input
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                placeholder="Item name"
                className="bg-background"
                data-testid={`input-item-name-${item.id}`}
              />
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                placeholder="Qty"
                className="bg-background"
                data-testid={`input-item-quantity-${item.id}`}
              />
              <Input
                type="number"
                value={item.pricePerUnit}
                onChange={(e) => updateItem(item.id, "pricePerUnit", parseFloat(e.target.value) || 0)}
                placeholder="Price"
                className="bg-background tabular-nums"
                data-testid={`input-item-price-${item.id}`}
              />
              <div className="text-sm font-medium tabular-nums" data-testid={`text-item-total-${item.id}`}>
                ₹{(item.quantity * item.pricePerUnit).toFixed(2)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                className="h-8 w-8"
                data-testid={`button-remove-item-${item.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() => addItem()}
          className="w-full"
          data-testid="button-add-custom-item"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Item
        </Button>
      </Card>

      <Card className="p-4 md:p-6 space-y-4">
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes..."
            rows={4}
            data-testid="textarea-notes"
          />
        </div>

        <div className="bg-primary/10 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-primary tabular-nums" data-testid="text-total-amount">
              ₹{total.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      <div className="flex flex-col md:flex-row gap-3">
        <Button onClick={handleSave} className="flex-1" data-testid="button-save-quotation">
          Save Quotation
        </Button>
        <Button
          variant="outline"
          onClick={handleExportPDF}
          className="flex-1"
          data-testid="button-export-pdf"
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        <Button
          variant="outline"
          onClick={handleShareWhatsApp}
          className="flex-1"
          data-testid="button-share-whatsapp"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share WhatsApp
        </Button>
      </div>
    </div>
  );
}
