import jsPDF from "jspdf";

export function horizontalLine(doc: jsPDF, y_axys: number): jsPDF {
    return doc.line(10, y_axys, 200, y_axys, "FD");
}
