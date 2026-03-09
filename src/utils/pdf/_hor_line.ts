import jsPDF from "jspdf";

export function _horLine(doc: jsPDF, y_axys: number, width: number): jsPDF {
    return doc.line(5, y_axys, width, y_axys, "FD");
}
