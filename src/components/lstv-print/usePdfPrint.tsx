import jsPDF from "jspdf";
import { HeaderLabel2 } from "@/models";
import { SalesItem } from "@/models/sales";
import { Orientation } from "@/models/sales";

export const usePdfPrint = (
  data: any,
  tableHead: HeaderLabel2[],
  orientation: Orientation = "portrait"
) => {
  return () => {
    const isLandscape = orientation === "landscape";
    // Set the page width and height based on orientation
    const pageWidth = isLandscape ? 297 : 210; // Width in mm for Landscape (297 mm) or Portrait (210 mm)
    const pageHeight = isLandscape ? 210 : 297; // Height in mm for Landscape (210 mm) or Portrait (297 mm)
    const doc = new jsPDF(isLandscape ? "l" : "p", "mm", [
      pageWidth,
      pageHeight,
    ]);

    const margin = 10; // Margin space from the edges
    const contentWidth = pageWidth - 2 * margin; // Width available for content after margins
    const startX = margin; // X position to start content
    const headerHeight = 30; // Height reserved for the header section
    const tableHeaderHeight = 10; // Height reserved for the table header
    const rowHeight = 8; // Height of each row in the table
    let startY = margin + headerHeight + tableHeaderHeight; // Initial Y position accounting for header and table header

    console.log("startY", startY);
    let currentPage = 1; // Track the current page number
    const now = new Date(); // Get current date and time

    const formattedDate = now.toLocaleDateString(); // Format the current date
    const formattedTime = now.toLocaleTimeString(); // Format the current time

    // Function to add a header on each page
    const addHeader = () => {
      startY = margin; // Reset Y position for the header
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Sample Company", startX, startY); // Print company name
      startY += 5; // Move down for the next line

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      const title = "Sales Order";
      doc.text(title, startX, startY); // Print report title
      startY += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.setFontSize(10);
      doc.text(
        `Date Printed: ${formattedDate}, ${formattedTime}`,
        startX,
        startY
      ); // Print date and time of print
      startY += 10; // Add extra space after the header
    };

    // Function to print the table headers on each page
    const printTableHeader = () => {
      startY += 5; // Add some spacing before the table header
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      let headerX = startX; // Initialize starting X position for headers

      console.log("headerX Print Table", headerX);

      tableHead.forEach((header, index) => {
        const headerText = header.header || ""; // Default to an empty string if header is undefined
        let textX = headerX;

        // Center-align 'advdoc' header
        if (header.id === "docnum") {
          const textWidth = doc.getTextWidth(headerText); // Get width of header text
          textX = headerX + (adjustedCellWidths[index] - textWidth) / 2; // Center align the text
        } else if (header.id === "totamtdisfor") {
          // Align 'totamtdisfor' (amount) to the right
          const textWidth = doc.getTextWidth(headerText); // Get width of header text
          textX = headerX + adjustedCellWidths[index] - textWidth - 1; // Right align the text
        }

        doc.text(headerText, textX, startY); // Print the header text

        // Draw borders for the table headers
        doc.line(
          headerX - 1,
          startY - 6,
          headerX + adjustedCellWidths[index] - 1,
          startY - 6
        ); // Top border of header
        doc.line(
          headerX - 1,
          startY + 2,
          headerX + adjustedCellWidths[index] - 1,
          startY + 2
        ); // Bottom border of header

        headerX += adjustedCellWidths[index]; // Move X position for the next header
      });

      startY += rowHeight; // Move down after printing the table header
    };

    // Function to add page numbers
    const addPageNumber = () => {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const pageText = `Page ${currentPage} of ${totalPages}`; // Page number text
      const textWidth = doc.getTextWidth(pageText); // Get the width of the text
      const textX = (pageWidth - textWidth) / 2; // Center the text horizontally
      const textY = pageHeight - margin + 5; // Position the text slightly below the margin
      doc.text(pageText, textX, textY); // Add the page number to the page
    };

    // Calculate cell widths and scale them to fit the page
    const cellWidths = tableHead.map((header) => header.size || 30); // Use 'size' from header or default to 30
    const totalWidth = cellWidths.reduce((a, b) => a + b, 0); // Sum of all column widths
    const scale = contentWidth / totalWidth; // Scale factor to fit within content width
    const adjustedCellWidths = cellWidths.map((width) => width * scale); // Adjust widths based on scale

    console.log("adjustedCellWidths", adjustedCellWidths);

    // Calculate total pages before generating the content
    const calculateTotalPages = () => {
      let estimatedY = startY; // Estimate Y position
      let pages = 1; // Start with one page

      data.forEach((row: any) => {
        estimatedY += rowHeight; // Move down for each row
        if (estimatedY >= pageHeight - margin) {
          pages += 1; // Add a new page if necessary
          estimatedY = margin + headerHeight + tableHeaderHeight; // Reset the Y position for the new page
        }
      });

      return pages; // Return the total number of pages
    };

    const totalPages = calculateTotalPages(); // Calculate total number of pages

    addHeader(); // Add header to the first page
    printTableHeader(); // Print table headers on the first page
    addPageNumber(); // Add page number to the first page

    let totalAmount = 0; // Initialize total amount for the report
    let lastAmountX = startX; // Track the last X position for amount column

    // Iterate through each row of data
    data.forEach((row: any) => {
      if (startY >= pageHeight - margin) {
        currentPage++; // Move to the next page
        doc.addPage(); // Add a new page
        addHeader(); // Add header on the new page
        printTableHeader(); // Print table headers on the new page
        addPageNumber(); // Add page number to the new page
        startY = margin + headerHeight + tableHeaderHeight; // Reset Y position after headers
      }

      let headerX = startX; // Reset X position for each row
      tableHead.forEach((header, cellIndex) => {
        const cellValue = row[header.id as keyof SalesItem] || ""; // Get the cell value
        let text = String(cellValue); // Convert value to string
        let textX = headerX;

        if (header.id === "docnum") {
          // Center-align 'docnum' data
          const textWidth = doc.getTextWidth(text); // Get width of text
          textX = headerX + (adjustedCellWidths[cellIndex] - textWidth) / 2; // Center align the text
        } else if (
          header.id === "totamtdisfor" &&
          typeof cellValue === "string"
        ) {
          // Align 'totamtdisfor' (amount) to the right
          const amount = parseFloat(cellValue);
          if (!isNaN(amount)) {
            text = amount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }); // Format amount with two decimal places
            totalAmount += amount; // Accumulate total amount
            lastAmountX = headerX + adjustedCellWidths[cellIndex]; // Update last X position for the amount column

            const textWidth = doc.getTextWidth(text); // Get width of text
            textX = headerX + adjustedCellWidths[cellIndex] - textWidth - 1; // Right align the text
          }
        }

        doc.text(text, textX, startY); // Print the cell value

        headerX += adjustedCellWidths[cellIndex]; // Move X position for the next cell
      });

      startY += rowHeight; // Move down for the next row
    });

    const totalAmountX = pageWidth - margin; // Align total amount to the right margin

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");

    // Calculate the width of the total amount text
    const totalAmountText = `Total Amount: ${totalAmount.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
    const totalAmountTextWidth = doc.getTextWidth(totalAmountText);

    // Align the total amount text to the right by adjusting the X position
    doc.text(totalAmountText, totalAmountX - totalAmountTextWidth, startY);

    const borderY = startY - 4;
    doc.line(startX, borderY, pageWidth - margin, borderY);

    addPageNumber();

    doc.save("sales_order.pdf");
  };
};
