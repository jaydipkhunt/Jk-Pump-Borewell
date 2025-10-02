import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Quotation } from "./quotation-storage";

export interface BusinessCard {
  companyName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
}

const BUSINESS_CARD_KEY = "borwell_business_card";

export function getBusinessCard(): BusinessCard {
  const saved = localStorage.getItem(BUSINESS_CARD_KEY);
  return saved ? JSON.parse(saved) : {
    companyName: "Borwell Services",
    ownerName: "Your Name",
    phone: "+91 98765 43210",
    email: "contact@borwell.com",
    address: "Your Address, City, State"
  };
}

export function saveBusinessCard(card: BusinessCard) {
  localStorage.setItem(BUSINESS_CARD_KEY, JSON.stringify(card));
}

export function generatePDF(quotation: Quotation) {
  const doc = new jsPDF();
  const businessCard = getBusinessCard();

  doc.setFontSize(18);
  doc.text(businessCard.companyName, 105, 15, { align: "center" });
  
  doc.setFontSize(9);
  doc.text(businessCard.ownerName, 105, 22, { align: "center" });
  doc.text(`${businessCard.phone} | ${businessCard.email}`, 105, 27, { align: "center" });
  doc.text(businessCard.address, 105, 32, { align: "center" });
  
  doc.line(20, 36, 190, 36);

  doc.setFontSize(16);
  doc.text("QUOTATION", 105, 44, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Quotation No: ${quotation.quotationNumber}`, 20, 52);
  doc.text(`Date: ${new Date(quotation.date).toLocaleDateString()}`, 20, 59);
  doc.text(`Customer: ${quotation.customerName}`, 20, 66);

  const tableData = quotation.items.map((item) => [
    item.name,
    item.quantity.toString(),
    `₹${item.pricePerUnit.toFixed(2)}`,
    `₹${(item.quantity * item.pricePerUnit).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 75,
    head: [["Item", "Quantity", "Price/Unit", "Total"]],
    body: tableData,
    foot: [[{ content: "Total Amount", colSpan: 3, styles: { halign: "right" } }, `₹${quotation.total.toFixed(2)}`]],
    theme: "grid",
    headStyles: { fillColor: [37, 99, 235] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 75;

  if (quotation.notes) {
    doc.setFontSize(10);
    doc.text("Notes:", 20, finalY + 15);
    const notesLines = doc.splitTextToSize(quotation.notes, 170);
    doc.text(notesLines, 20, finalY + 22);
  }

  const pageHeight = doc.internal.pageSize.height;
  doc.line(20, pageHeight - 25, 190, pageHeight - 25);
  doc.setFontSize(8);
  doc.text(businessCard.companyName, 105, pageHeight - 18, { align: "center" });
  doc.text(`${businessCard.phone} | ${businessCard.email}`, 105, pageHeight - 13, { align: "center" });

  doc.save(`Quotation_${quotation.quotationNumber}.pdf`);
}

export function shareViaWhatsApp(quotation: Quotation) {
  const message = `*Borwell Quotation*%0A%0A` +
    `Quotation No: ${quotation.quotationNumber}%0A` +
    `Customer: ${quotation.customerName}%0A` +
    `Date: ${new Date(quotation.date).toLocaleDateString()}%0A%0A` +
    `*Items:*%0A` +
    quotation.items.map(item =>
      `${item.name} - Qty: ${item.quantity} @ ₹${item.pricePerUnit} = ₹${(item.quantity * item.pricePerUnit).toFixed(2)}`
    ).join('%0A') +
    `%0A%0A*Total: ₹${quotation.total.toFixed(2)}*`;

  window.open(`https://wa.me/?text=${message}`, "_blank");
}

export function shareViaEmail(quotation: Quotation) {
  const subject = `Quotation ${quotation.quotationNumber} - ${quotation.customerName}`;
  const body = `Quotation Details:\n\n` +
    `Quotation No: ${quotation.quotationNumber}\n` +
    `Customer: ${quotation.customerName}\n` +
    `Date: ${new Date(quotation.date).toLocaleDateString()}\n\n` +
    `Items:\n` +
    quotation.items.map(item =>
      `${item.name} - Qty: ${item.quantity} @ ₹${item.pricePerUnit} = ₹${(item.quantity * item.pricePerUnit).toFixed(2)}`
    ).join('\n') +
    `\n\nTotal: ₹${quotation.total.toFixed(2)}`;

  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
