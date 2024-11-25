import { jsPDF } from 'jspdf';
import { ItemOrderCreate, OrderCreate } from '@/types';
import LFLogo from '@/assets/LogicFlare_nobg.png';

function initializer(data: OrderCreate, orientation: "portrait" | "landscape"): { doc: jsPDF; items: ItemOrderCreate[];} {
    const doc: jsPDF = new jsPDF({
        orientation: orientation,
        format: "A4"
    });
    const items: ItemOrderCreate[] = data.data_items;
    
    return { doc, items }
}

let y_axys: number = 32;

function drawColoredBox(doc: jsPDF, x: number, y: number, width: number, height: number, color: [number, number, number]) { 
    doc.setFillColor(color[0], color[1], color[2]); 
    doc.rect(x, y, width, height, 'DF');
};

function horizontalLine(doc: jsPDF, y_axys: number): jsPDF {
    return doc.line(10, y_axys, 200, y_axys, "FD");
}

function _horLine(doc: jsPDF, y_axys: number, width: number): jsPDF {
    return doc.line(5, y_axys, width, y_axys, "FD");
}

function verticalLine(doc: jsPDF, x: number, yStart: number, yEnd: number): jsPDF { 
    return doc.line(x, yStart, x, yEnd); 
}

function generateBudgeTable(data: OrderCreate) {
    if (data.data_items.length < 1) {
        alert('Escolha produtos antes de gerar um documento.');
        return;
    }
    
    const { doc, items } = initializer(data, "portrait");
    let x_axys: number = 10;

    // Valor de soma de cada uma das colunas
    let x_QTDE_axys: number = 112;
    let x_VALOR_UN_axys: number = 132;
    let x_SUB_axys: number = 157;

    const headerSize: number = 14;
    const valueSize: number = 11;
    const pageHeight: number = doc.internal.pageSize.height;

    doc.addImage(LFLogo, "PNG", 10, 0, 50, 50);    
    doc.text(`ORÇAMENTO - ${new Date().toLocaleDateString('pt-Br')} - ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')} ${new Date().getHours() > 12 ? 'PM' : 'AM'}`, 100, 27.5);

    // header
    drawColoredBox(doc, 10, y_axys, 190, 10, [220, 220, 220]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(headerSize);
    
    doc.text("Produto", x_axys + 2, y_axys + 7);
    doc.text("QTDE.", x_axys + x_QTDE_axys, y_axys + 7);
    doc.text("Valor Un.", x_axys + x_VALOR_UN_axys, y_axys + 7);
    doc.text("Sub.", x_axys + x_SUB_axys, y_axys + 7);

    doc.setFont("helvetica", "normal")
    doc.setFontSize(valueSize);
    items.map((item: ItemOrderCreate) => {
        if (y_axys + 45 > pageHeight) {
            doc.addPage();
            y_axys = 10;
        }

        doc.text(item.produto_nome.length > 60 ? `${item.produto_nome.slice(0, 59)}...` : item.produto_nome, x_axys + 2, y_axys + 15);
        doc.text(String(item.quantidade), x_axys + x_QTDE_axys, y_axys + 15);
        doc.text(Number(item.valor_unitario).toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' }), x_axys + x_VALOR_UN_axys, y_axys + 15);
        doc.text(Number(item.quantidade * item.valor_unitario).toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' }), x_axys + x_SUB_axys, y_axys + 15);
        horizontalLine(doc, y_axys + 18);
        
        y_axys += 8;
    });

    verticalLine(doc, 10, 32, y_axys + 10);
    verticalLine(doc, x_QTDE_axys + 8, 32, y_axys + 10);
    verticalLine(doc, x_VALOR_UN_axys + 8, 32, y_axys + 10);
    verticalLine(doc, x_SUB_axys + 8, 32, y_axys + 10);
    verticalLine(doc, 200, 32, y_axys + 10);

    const total: string = items
        .reduce((acc: number, currVal: ItemOrderCreate) => acc + currVal.quantidade * currVal.valor_unitario, 0)
        .toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`TOTAL:`, x_axys + 2, y_axys + 15);
    doc.text(`${total}`, x_axys + x_SUB_axys, y_axys + 15);
    doc.save(`orcamento_${String(new Date().getDate()).padStart(2, "0")}_${String(new Date().getMonth()).padStart(2, "0")}_${String(new Date().getFullYear()).padStart(2, "0")}_hora_${String(new Date().getHours()).padStart(2, "0")}_${String(new Date().getMinutes()).padStart(2, "0")}.pdf`);

    y_axys = 32;
}

function generateBudgetTableLandscape(data: OrderCreate) {
    if (data.data_items.length < 1) {
        alert('Escolha produtos antes de gerar um documento.');
        return;
    }
    
    const { doc, items } = initializer(data, "landscape");
    let x_axys: number = 5;

    let x_QTDE_axys: number = 58;
    let x_VALOR_UN_axys: number = 78;
    let x_SUB_axys: number = 113;

    const headerSize: number = 14;
    const valueSize: number = 11;
    const pageHeight: number = doc.internal.pageSize.height;

    doc.addImage(LFLogo, "PNG", 2, 0, 50, 50);  
    doc.setFontSize(headerSize);  
    doc.text(`ORÇAMENTO - ${new Date().toLocaleDateString('pt-Br')} - ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')} ${new Date().getHours() > 12 ? 'PM' : 'AM'}`, 53, 27.5);

    // header
    drawColoredBox(doc, 5, y_axys, 135, 10, [220, 220, 220]);
    doc.setFont("helvetica", "bold");
    
    doc.text("Produto", x_axys + 2, y_axys + 7);
    doc.text("QTDE.", x_axys + x_QTDE_axys, y_axys + 7);
    doc.text("Valor Un.", x_axys + x_VALOR_UN_axys, y_axys + 7);
    doc.text("Sub.", x_axys + x_SUB_axys, y_axys + 7);

    doc.setFont("helvetica", "normal")
    doc.setFontSize(valueSize);
    items.map((item: ItemOrderCreate) => {
        if (y_axys + 45 > pageHeight) {
            doc.addPage();
            y_axys = 32;
        }

        doc.text(item.produto_nome.length > 30 ? `${item.produto_nome.slice(0, 29)}...` : item.produto_nome, x_axys + 1, y_axys + 15);
        doc.text(String(item.quantidade), x_axys + x_QTDE_axys, y_axys + 15);
        doc.text(Number(item.valor_unitario).toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' }), x_axys + x_VALOR_UN_axys, y_axys + 15);
        doc.text(Number(item.quantidade * item.valor_unitario).toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' }), x_axys + x_SUB_axys, y_axys + 15);
        _horLine(doc, y_axys + 18, 140);
        
        y_axys += 8;

        verticalLine(doc, 5, 32, y_axys + 10);
        verticalLine(doc, x_QTDE_axys + 4, 32, y_axys + 10);
        verticalLine(doc, x_VALOR_UN_axys + 4, 32, y_axys + 10);
        verticalLine(doc, x_SUB_axys + 4, 32, y_axys + 10);
        verticalLine(doc, 140, 32, y_axys + 10);
    });

    

    const total: string = items
        .reduce((acc: number, currVal: ItemOrderCreate) => acc + currVal.quantidade * currVal.valor_unitario, 0)
        .toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`TOTAL:`, x_axys + 2, y_axys + 15);
    doc.text(`${total}`, x_axys + x_SUB_axys, y_axys + 15);
    doc.save(`orcamento_${String(new Date().getDate()).padStart(2, "0")}_${String(new Date().getMonth()).padStart(2, "0")}_${String(new Date().getFullYear()).padStart(2, "0")}_hora_${String(new Date().getHours()).padStart(2, "0")}_${String(new Date().getMinutes()).padStart(2, "0")}.pdf`);

    y_axys = 32;
}

function generateBudgetList(data: OrderCreate) {
    if (data.data_items.length < 1) {
        alert('Escolha produtos antes de gerar um documento.');
        return;
    }

    const doc = new jsPDF();
    const items: ItemOrderCreate[] = data.data_items;

    doc.setFont("times", "bold");
    doc.setFontSize(20);
    doc.text(`ORÇAMENTO - ${new Date().toLocaleDateString('pt-Br')} - ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')} ${new Date().getHours() > 12 ? 'PM' : 'AM'}`, 10, 10);
    doc.text("_".repeat(53), 10, 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let y_axys: number = 18;
    let x_axys: number = 20;
    const fieldSize: number = 14;
    const valueSize: number = 11;
    const pageHeight: number = doc.internal.pageSize.height;
    items.map((item: ItemOrderCreate, index: number) => {
        if (y_axys + 45 > pageHeight) {
            doc.addPage();
            y_axys = 20;
        }
        doc.setFont("helvetica", "bold")
        doc.text(`${index + 1}• `, 10, y_axys)
        // start line
        doc.text("Item:", x_axys, y_axys);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fieldSize);
        doc.text(`${item.produto_nome}`, 50, y_axys);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(valueSize);
        // end line
        // start line
        doc.text("Valor unitário:", x_axys, y_axys + 6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fieldSize);
        doc.text(`${Number(item.valor_unitario).toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })}`, 50, y_axys + 6);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(valueSize);
        // end line
        // start line
        doc.text("Quantidade:", x_axys, y_axys + 11);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fieldSize);
        doc.text(`${item.quantidade}`, 50, y_axys + 11);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(valueSize);
        // end line
        doc.text("-".repeat(60), x_axys, y_axys + 15);
        // start line
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fieldSize);
        doc.text("Subtotal:", x_axys, y_axys + 20);
        doc.text(`${Number(item.quantidade * item.valor_unitario).toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })}`, 50, y_axys + 20);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(valueSize);
        // end line
        doc.text("_".repeat(80), 10, y_axys + 20);
        y_axys += 30;
    });
    const total: string = items
        .reduce((acc: number, currVal: ItemOrderCreate) => acc + currVal.quantidade * currVal.valor_unitario, 0)
        .toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`TOTAL:`, 10, y_axys + 5);
    doc.text(`${total}`, 50, y_axys + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.save(`orcamento_${new Date().getDate()}_${new Date().getMonth()}_${new Date().getFullYear()}_${new Date().getHours()}H${String(new Date().getMinutes()).padStart(2, '0')}M.pdf`);
}

export {
    generateBudgetList,
    generateBudgeTable,
    generateBudgetTableLandscape
}