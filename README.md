Android App Prompt: Borwell Quotation Management App

App Name: Borwell Quotation Manager

Description:
Build an Android app that helps manage quotations for borewell-related work. The app should allow users to create, edit, and save quotations with editable item details and automatically calculate totals. Each quotation should be stored in history with date, customer name, and quotation number.

Core Features:

Quotation Creation:

Input customer name, date, quotation number (auto-generated).

Add items (e.g., "Boring 5", "Casing ISO", "Stainer Pipe", etc.).

Editable fields: Item name, quantity, price per unit.

Automatic total calculation.

Add notes (like "Soil hardness extra cost").

Quotation History:

Store all past quotations in local database (SQLite or Room DB).

Show history list with customer name, quotation date, and total amount.

Option to view, edit, duplicate, or delete old quotations.

Export & Share:

Export quotation to PDF.

Share via WhatsApp/Email.

UI/UX:

Clean, easy-to-use interface with table-like structure (similar to Excel).

Editable rows for quantity and price.

Auto-calculated "Total" at the bottom.

Other Requirements:

App should work offline (no internet needed).

One-year warranty note and other default notes auto-added at the end.

Dark and light mode support.

Tech Stack (Preferred):

Android (Kotlin + Jetpack Compose) or Flutter (cross-platform).

Local storage using SQLite/Room DB.

PDF generation library for exporting.

Extra:

Settings page to update default items (so user can pre-load borewell materials & prices).

Option to add GST/taxes if required.
