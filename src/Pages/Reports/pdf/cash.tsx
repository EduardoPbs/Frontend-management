import jsPDF from "jspdf";

function initializer(orientation: "portrait" | "landscape"): { doc: jsPDF; } {
    const doc: jsPDF = new jsPDF({
        orientation: orientation,
        format: "A4"
    });

    return { doc };
}

function drawColoredBox(doc: jsPDF, x: number, y: number, width: number, height: number, color: [number, number, number]) { 
    doc.setFillColor(color[0], color[1], color[2]); 
    doc.rect(x, y, width, height, 'DF');
};

function horizontalLine(doc: jsPDF, y_axys: number): jsPDF {
    return doc.line(10, y_axys, 200, y_axys, "FD");
}


function generateCashReport(): jsPDF {
    return new jsPDF();
}