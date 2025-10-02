import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getBusinessCard, saveBusinessCard, type BusinessCard } from "@/lib/pdf-export";

interface DefaultItem {
  id: string;
  name: string;
  pricePerUnit: number;
}

const SETTINGS_KEY = "borwell_settings";

export function SettingsPage() {
  const { toast } = useToast();
  const [businessCard, setBusinessCard] = useState<BusinessCard>(getBusinessCard());
  const [defaultItems, setDefaultItems] = useState<DefaultItem[]>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved).defaultItems : [
      { id: "1", name: "Boring 5\"", pricePerUnit: 180 },
      { id: "2", name: "Boring 6\"", pricePerUnit: 220 },
      { id: "3", name: "Casing ISO", pricePerUnit: 450 },
      { id: "4", name: "Stainer Pipe", pricePerUnit: 380 },
    ];
  });

  const addItem = () => {
    setDefaultItems([
      ...defaultItems,
      { id: crypto.randomUUID(), name: "", pricePerUnit: 0 },
    ]);
  };

  const updateItem = (id: string, field: keyof DefaultItem, value: string | number) => {
    setDefaultItems(
      defaultItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setDefaultItems(defaultItems.filter((item) => item.id !== id));
  };

  const saveSettings = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ defaultItems }));
    saveBusinessCard(businessCard);
    toast({
      title: "Success",
      description: "Settings saved successfully",
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage business card and default items</p>
      </div>

      <Card className="p-4 md:p-6 space-y-4">
        <h3 className="text-lg font-semibold">Business Card Information</h3>
        <p className="text-sm text-muted-foreground">This information will appear on PDF quotations</p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              value={businessCard.companyName}
              onChange={(e) => setBusinessCard({ ...businessCard, companyName: e.target.value })}
              placeholder="Enter company name"
              data-testid="input-company-name"
            />
          </div>
          
          <div>
            <Label htmlFor="owner-name">Owner/Contact Name</Label>
            <Input
              id="owner-name"
              value={businessCard.ownerName}
              onChange={(e) => setBusinessCard({ ...businessCard, ownerName: e.target.value })}
              placeholder="Enter owner name"
              data-testid="input-owner-name"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={businessCard.phone}
                onChange={(e) => setBusinessCard({ ...businessCard, phone: e.target.value })}
                placeholder="+91 98765 43210"
                data-testid="input-phone"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={businessCard.email}
                onChange={(e) => setBusinessCard({ ...businessCard, email: e.target.value })}
                placeholder="contact@example.com"
                data-testid="input-email"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={businessCard.address}
              onChange={(e) => setBusinessCard({ ...businessCard, address: e.target.value })}
              placeholder="Your complete address"
              data-testid="input-address"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Default Items</h3>
            <Button onClick={addItem} size="sm" data-testid="button-add-default-item">
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            These items will automatically appear in every new quotation
          </p>
        </div>

        <div className="space-y-3">
          {defaultItems.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_150px_40px] gap-2 items-center">
              <div>
                <Label className="sr-only">Item name</Label>
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  placeholder="Item name"
                  data-testid={`input-default-item-name-${item.id}`}
                />
              </div>
              <div>
                <Label className="sr-only">Price per unit</Label>
                <Input
                  type="number"
                  value={item.pricePerUnit}
                  onChange={(e) => updateItem(item.id, "pricePerUnit", parseFloat(e.target.value) || 0)}
                  placeholder="Price"
                  data-testid={`input-default-item-price-${item.id}`}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                data-testid={`button-remove-default-item-${item.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <Button onClick={saveSettings} className="w-full" data-testid="button-save-settings">
          Save Settings
        </Button>
      </Card>
    </div>
  );
}
