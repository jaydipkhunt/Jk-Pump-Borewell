export interface QuotationItem {
  id: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  date: string;
  items: QuotationItem[];
  notes: string;
  total: number;
}

const STORAGE_KEY = "borwell_quotations";
const COUNTER_KEY = "borwell_quotation_counter";

export function generateQuotationNumber(): string {
  const counter = parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10) + 1;
  localStorage.setItem(COUNTER_KEY, counter.toString());
  const prefix = "BQ";
  const year = new Date().getFullYear().toString().slice(-2);
  return `${prefix}${year}${counter.toString().padStart(4, "0")}`;
}

export function saveQuotation(quotation: Quotation): void {
  const quotations = getQuotations();
  const index = quotations.findIndex((q) => q.id === quotation.id);
  
  if (index >= 0) {
    quotations[index] = quotation;
  } else {
    quotations.push(quotation);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotations));
}

export function getQuotations(): Quotation[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getQuotation(id: string): Quotation | undefined {
  return getQuotations().find((q) => q.id === id);
}

export function deleteQuotation(id: string): void {
  const quotations = getQuotations().filter((q) => q.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotations));
}

export function duplicateQuotation(id: string): Quotation {
  const original = getQuotation(id);
  if (!original) throw new Error("Quotation not found");
  
  const duplicate: Quotation = {
    ...original,
    id: crypto.randomUUID(),
    quotationNumber: generateQuotationNumber(),
    date: new Date().toISOString().split("T")[0],
  };
  
  saveQuotation(duplicate);
  return duplicate;
}

export const defaultItems = [
  { name: "Boring 5\"", pricePerUnit: 180 },
  { name: "Boring 6\"", pricePerUnit: 220 },
  { name: "Casing ISO", pricePerUnit: 450 },
  { name: "Stainer Pipe", pricePerUnit: 380 },
  { name: "PVC Pipe", pricePerUnit: 150 },
  { name: "Motor Installation", pricePerUnit: 3500 },
];
