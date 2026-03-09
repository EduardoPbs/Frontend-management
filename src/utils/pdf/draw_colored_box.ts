import jsPDF from "jspdf";

export function drawColoredBox(doc: jsPDF, x: number, y: number, width: number, height: number, color: [number, number, number]) { 
    doc.setFillColor(color[0], color[1], color[2]); 
    doc.rect(x, y, width, height, 'DF');
};
