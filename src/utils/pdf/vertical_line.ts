import jsPDF from "jspdf";

export function verticalLine(doc: jsPDF, x: number, yStart: number, yEnd: number): jsPDF { 
    return doc.line(x, yStart, x, yEnd); 
}