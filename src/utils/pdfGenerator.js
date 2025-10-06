import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Inicializar las fuentes
pdfMake.vfs = pdfFonts;

// Fuentes
const fonts = {
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-MediumItalic.ttf"
  },
};

// Función principal para generar el PDF
export const generateCobranzaPDF = (pedido, datosAdicionales, datosEfectivo) => {
  const fechaContabilidad = new Date().toLocaleDateString("es-MX");
  
  const content = [
    // Primera copia
    ...buildHeader(pedido),
    buildCommunityTable(pedido),
    buildExtrasSection(datosAdicionales),
    buildTotalRecuperacion(pedido, datosAdicionales),
    { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, dash: { length: 5 } }], margin: [0, 0, 0, 2] },
    
    // Segunda copia
    ...buildHeader(pedido),
    buildCommunityTable(pedido),
    buildExtrasSection(datosAdicionales),
    buildTotalRecuperacion(pedido, datosAdicionales),
    { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, dash: { length: 5 } }], margin: [0, 0, 0, 2] },
    
    // Resumen
    ...buildSummarySection(pedido, fechaContabilidad),
    
    // NUEVA PÁGINA PARA EFECTIVO Y DEPÓSITO
    { text: "", pageBreak: "before" },
    buildEfectivoSection(datosEfectivo),
    buildDepositoSection()
  ];

  const docDefinition = {
    pageMargins: [40, 40, 40, 40],
    content: content,
    styles: {
      header: { fontSize: 9, bold: true, alignment: "center" },
      title: { fontSize: 10, bold: true, alignment: "center", margin: [0, 0, 0, 10] },
      tableHeader: { bold: true, fontSize: 7, alignment: "center" },
      cellCenter: { alignment: "center", fontSize: 7 },
      total: { fontSize: 9, bold: true, margin: [0, 10, 0, 10] },
      depositInfo: { fontSize: 8, bold: true, alignment: "center", margin: [0, 10, 0, 5] },
      efectivoTitle: { fontSize: 10, bold: true, alignment: "center", margin: [0, 0, 0, 20] },
      denominationHeader: { fontSize: 8, bold: true, alignment: "center" },
      denominationCell: { fontSize: 7, alignment: "center" },
      totalRow: { fontSize: 10, bold: true, alignment: "center" }
    },
    defaultStyle: { font: "Roboto" }
  };

  return pdfMake.createPdf(docDefinition, null, fonts);
};

// HEADER
function buildHeader(pedido) {
  return [
    { text: "BANCO DE ALIMENTOS DE ZAMORA A.C.", style: "header" },
    { text: "RECIBO CUOTA DE RECUPERACIÓN", style: "title" },
    {
      table: {
        widths: ["*", "*", "*"],
        body: [[
          { text: `TS: ${pedido.usuario.username || "N/A"}`, style: "cellCenter" },
          { text: `RUTA: ${pedido.ruta.nombre || "N/A"}`, style: "cellCenter" },
          { text: `FECHA DE ENTREGA: ${new Date(pedido.fechaEntrega).toLocaleDateString("es-MX")}`, style: "cellCenter" }
        ]]
      },
      layout: "noBorders",
      margin: [0, 5, 0, 10]
    }
  ];
}

// TABLA COMUNIDADES
function buildCommunityTable(pedido) {
  const body = pedido.pedidoComunidad.map(item => {
    const costo = item.comunidad.costoPaquete;
    const total = item.despensasCosto + item.despensasMedioCosto + item.despensasSinCosto + item.despensasApadrinadas;
    const subtotal = (costo * item.despensasCosto) + ((costo / 2) * item.despensasMedioCosto);

    return [
      { text: item.comunidad.nombre, style: "cellCenter" },
      { text: `$${parseInt(costo).toLocaleString("es-Mx", { minimumFractionDigits: 2, maximumFractionDigits: 2 } )}`, style: "cellCenter" },
      { text: item.despensasCosto.toString(), style: "cellCenter" },
      { text: item.despensasMedioCosto.toString(), style: "cellCenter" },
      { text: item.despensasSinCosto.toString(), style: "cellCenter" },
      { text: item.despensasApadrinadas.toString(), style: "cellCenter" },
      { text: total.toString(), style: "cellCenter" },
      { text: `$${subtotal.toLocaleString("es-Mx", { minimumFractionDigits: 2, maximumFractionDigits: 2 } )}`, style: "cellCenter" }
    ];
  });

  // Totales
  const sum = pedido.pedidoComunidad.reduce((acc, item) => {
    acc.cuota += item.despensasCosto;
    acc.medio += item.despensasMedioCosto;
    acc.sin += item.despensasSinCosto;
    acc.apadrinadas += item.despensasApadrinadas;
    acc.total += item.despensasCosto + item.despensasMedioCosto + item.despensasSinCosto + item.despensasApadrinadas;
    acc.subtotal += (item.comunidad.costoPaquete * item.despensasCosto) + 
                    ((item.comunidad.costoPaquete / 2) * item.despensasMedioCosto);
    return acc;
  }, { cuota: 0, medio: 0, sin: 0, apadrinadas: 0, total: 0, subtotal: 0 });

  return {
    table: {
      widths: ["*", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
      headerRows: 1,
      body: [
        [
          { text: "COMUNIDAD", style: "tableHeader" },
          { text: "CUOTA", style: "tableHeader" },
          { text: "CON CUOTA", style: "tableHeader" },
          { text: "MEDIO COSTO", style: "tableHeader" },
          { text: "SIN COSTO", style: "tableHeader" },
          { text: "APADRINADAS", style: "tableHeader" },
          { text: "TOTAL", style: "tableHeader" },
          { text: "TOTAL $", style: "tableHeader" }
        ],
        ...body,
        [
          { text: "TOTAL:", colSpan: 2, style: "cellCenter" }, {}, 
          { text: sum.cuota.toString(), style: "cellCenter" },
          { text: sum.medio.toString(), style: "cellCenter" },
          { text: sum.sin.toString(), style: "cellCenter" },
          { text: sum.apadrinadas.toString(), style: "cellCenter" },
          { text: sum.total.toLocaleString("es-Mx"), style: "cellCenter" },
          { text: `$${sum.subtotal.toLocaleString("es-Mx", { minimumFractionDigits: 2, maximumFractionDigits: 2 } )}`, style: "cellCenter" }
        ]
      ]
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      paddingTop: () => 2,
      paddingBottom: () => 2
    }
  };
}

// TABLA EXTRAS
function buildExtrasSection(datosAdicionales) {
  const totalArpillas = datosAdicionales.arpillasImporte;
  const totalExcedentes = datosAdicionales.excedentesImporte;

  return {
    table: {
      widths: ["*", "auto", "auto"],
      body: [
        [{ text: "EXTRAS", colSpan: 3, style: "tableHeader" }, {}, {}],
        [ { text: "CONCEPTO", style: "tableHeader" }, { text: "DETALLE", style: "tableHeader" }, { text: "IMPORTE", style: "tableHeader" } ],
        [ { text: "ARPILLAS", style: "cellCenter" }, { text: datosAdicionales.arpillasCantidad.toString(), style: "cellCenter" }, { text: `$${totalArpillas.toLocaleString("es-Mx", { minimumFractionDigits: 2, maximumFractionDigits: 2 } )}`, style: "cellCenter" } ],
        [ { text: "EXCEDENTES", style: "cellCenter" }, { text: datosAdicionales.excedentes, style: "cellCenter" }, { text: `$${totalExcedentes.toLocaleString("es-Mx", { minimumFractionDigits: 2, maximumFractionDigits: 2 } )}`, style: "cellCenter" } ]
      ]
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      paddingTop: () => 2,
      paddingBottom: () => 2
    },
    margin: [0, 10, 0, 0]
  };
}

// SECCIÓN DE EFECTIVO RECAUDADO
function buildEfectivoSection(datosEfectivo) {
  if (!datosEfectivo || datosEfectivo.totalEfectivo === "0.00") {
    return { 
      text: "NO SE REGISTRÓ EFECTIVO PARA ESTA RUTA", 
      style: "denominationHeader",
      alignment: "center",
      margin: [0, 50, 0, 0]
    };
  }

  const denominations = [
    { label: "$1,000", value: datosEfectivo.billetes1000 || 0, amount: 1000, type: "Billetes" },
    { label: "$500", value: datosEfectivo.billetes500 || 0, amount: 500, type: "Billetes" },
    { label: "$200", value: datosEfectivo.billetes200 || 0, amount: 200, type: "Billetes" },
    { label: "$100", value: datosEfectivo.billetes100 || 0, amount: 100, type: "Billetes" },
    { label: "$50", value: datosEfectivo.billetes50 || 0, amount: 50, type: "Billetes" },
    { label: "$20", value: datosEfectivo.billetes20 || 0, amount: 20, type: "Billetes" },
    { label: "$20", value: datosEfectivo.monedas20 || 0, amount: 20, type: "Monedas" },
    { label: "$10", value: datosEfectivo.monedas10 || 0, amount: 10, type: "Monedas" },
    { label: "$5", value: datosEfectivo.monedas5 || 0, amount: 5, type: "Monedas" },
    { label: "$2", value: datosEfectivo.monedas2 || 0, amount: 2, type: "Monedas" },
    { label: "$1", value: datosEfectivo.monedas1 || 0, amount: 1, type: "Monedas" },
    { label: "$0.50", value: datosEfectivo.monedas50C || 0, amount: 0.5, type: "Monedas" }
  ];

  // Separar billetes y monedas
  const billetes = denominations.filter(item => item.type === "Billetes" && item.value > 0);
  const monedas = denominations.filter(item => item.type === "Monedas" && item.value > 0);

  const content = [];

  // Sección de billetes
  if (billetes.length > 0) {
    const billetesRows = billetes.map(item => [
      { text: item.label, style: "denominationCell" },
      { text: item.value.toString(), style: "denominationCell" },
      { text: `$${(item.value * item.amount).toLocaleString("es-Mx", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: "denominationCell" }
    ]);

    const totalBilletes = billetes.reduce((sum, item) => sum + (item.value * item.amount), 0);

    content.push({
      table: {
        widths: [120, 80, 100],
        body: [
          [{ text: "BILLETES", colSpan: 3, style: "denominationHeader" }, {}, {}],
          [
            { text: "DENOMINACIÓN", style: "denominationHeader" }, 
            { text: "CANTIDAD", style: "denominationHeader" }, 
            { text: "SUBTOTAL", style: "denominationHeader" }
          ],
          ...billetesRows,
          [
            { text: "SUBTOTAL BILLETES:", colSpan: 2, style: "totalRow" }, {},
            { text: `$${totalBilletes.toLocaleString("es-Mx", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: "totalRow" }
          ]
        ]
      },
      alignment: "center",
      margin: [0, 0, 0, 5]
    });
  }

  // Sección de monedas
  if (monedas.length > 0) {
    const monedasRows = monedas.map(item => [
      { text: item.label, style: "denominationCell" },
      { text: item.value.toString(), style: "denominationCell" },
      { text: `$${(item.value * item.amount).toLocaleString("es-Mx", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: "denominationCell" }
    ]);

    const totalMonedas = monedas.reduce((sum, item) => sum + (item.value * item.amount), 0);

    content.push({
      table: {
        widths: [120, 80, 100],
        body: [
          [{ text: "MONEDAS", colSpan: 3, style: "denominationHeader" }, {}, {}],
          [
            { text: "DENOMINACIÓN", style: "denominationHeader" }, 
            { text: "CANTIDAD", style: "denominationHeader" }, 
            { text: "SUBTOTAL", style: "denominationHeader" }
          ],
          ...monedasRows,
          [
            { text: "SUBTOTAL MONEDAS:", colSpan: 2, style: "totalRow" }, {},
            { text: `$${totalMonedas.toLocaleString("es-Mx", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: "totalRow" }
          ]
        ]
      },
      alignment: "center",
      margin: [0, 0, 0, 5]
    });
  }

  // Total general
  content.push({
    table: {
      widths: [200, 100],
      body: [
        [
          { text: "TOTAL EFECTIVO RECAUDADO:", style: "totalRow", fontSize: 10 },
          { text: `$${parseFloat(datosEfectivo.totalEfectivo).toLocaleString("es-Mx", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: "totalRow", fontSize: 10 }
        ]
      ]
    },
    layout: {
      paddingTop: () => 4,
      paddingBottom: () => 4,
      paddingLeft: () => 8,
      paddingRight: () => 8
    },
    alignment: "center",
    margin: [0, 0, 0, 5]
  });

  // Observaciones si existen
  if (datosEfectivo.observaciones) {
    content.push({
      table: {
        widths: ["*"],
        body: [
          [{ text: "OBSERVACIONES", style: "denominationHeader" }],
          [{ text: datosEfectivo.observaciones, style: "denominationCell", margin: [10, 5, 10, 5] }]
        ]
      },
      layout: {
        paddingTop: () => 4,
        paddingBottom: () => 4
      },
      margin: [0, 0, 0, 5]
    });
  }

  return content;
}

// INFORMACIÓN DE DEPÓSITO BANCARIO
function buildDepositoSection() {
  const cuentaDeposito = import.meta.env.VITE_CUENTA_DEPOSITO || "CUENTA NO CONFIGURADA";
  
  return {
    table: {
      widths: ["*"],
      body: [
        [{ text: "INFORMACIÓN DE DEPÓSITO BANCARIO", style: "denominationHeader", fontSize: 10 }],
        [{ text: `Número de Cuenta BANBAJIO: ${cuentaDeposito}`, style: "denominationCell", fontSize: 10, margin: [15, 5, 15, 5] }],
        [{ text: "INSTRUCCIONES:", style: "denominationHeader", fontSize: 9 }],
        [{ text: "• Depositar el efectivo recaudado en la cuenta bancaria indicada", style: "denominationCell", fontSize: 8, }],
        [{ text: "• Conservar el comprobante de depósito como respaldo", style: "denominationCell", fontSize: 8, }],
        [{ text: "• Entregar copia del comprobante junto con este reporte", style: "denominationCell", fontSize: 8,  }]
      ]
    }
  };
}

// RESUMEN FINAL
function buildSummarySection(pedido, fechaContabilidad) {
  const totalDespensas = pedido.pedidoComunidad.reduce((sum, item) => 
    sum + item.despensasCosto + item.despensasMedioCosto + 
    item.despensasSinCosto + item.despensasApadrinadas, 0);

  const comunidadBody = pedido.pedidoComunidad.map(item => {
    const total = item.despensasCosto + item.despensasMedioCosto +
                  item.despensasSinCosto + item.despensasApadrinadas;
    return [
      { text: item.comunidad.nombre, style: "cellCenter" },
      { text: total.toString(), style: "cellCenter" }
    ];
  });

  comunidadBody.push([
    { text: "TOTAL DE DESPENSAS", bold: true, style: "cellCenter" },
    { text: totalDespensas.toString(), bold: true, style: "cellCenter" }
  ]);

  return [{
    columns: [
      {
        width: "50%",
        table: {
          headerRows: 1,
          widths: ["*", "auto"],
          body: [
            [
              { text: "COMUNIDAD", style: "tableHeader" },
              { text: "TOTAL DESPENSAS", style: "tableHeader" }
            ],
            ...comunidadBody
          ]
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          paddingTop: () => 2,
          paddingBottom: () => 2
        }
      },
      {
        width: "50%",
        table: {
          widths: ["auto", "*"],
          body: [
            [ { text: "Fecha Entrega Ruta:", bold: true, style: "header" }, { text: new Date(pedido.fechaEntrega).toLocaleDateString("es-MX"), style: "tableHeader" } ],
            [ { text: "Fecha Contabilidad:", bold: true, style: "header" }, { text: fechaContabilidad, style: "tableHeader" } ],
            [ { text: "Ruta:", bold: true, style: "header" }, { text: pedido.ruta.nombre || "N/A", style: "tableHeader" } ],
            [ { text: "Trabajador Social:", bold: true, style: "header" }, { text: pedido.usuario.username || "N/A", style: "tableHeader" } ],
          ]
        },
        layout: "noBorders",
        margin: [10, 0, 0, 0]
      }
    ],
    columnGap: 10,
    margin: [0, 10, 0, 0]
  }];
}

// TOTAL DESPENSAS $
function calcularTotal(comunidades) {
  return comunidades.reduce((sum, item) => {
    const costoPaquete = item.comunidad.costoPaquete;
    return sum +
      (costoPaquete * item.despensasCosto) +
      ((costoPaquete / 2) * item.despensasMedioCosto);
  }, 0);
}

// TOTAL RECUPERACIÓN POR RUTA
function buildTotalRecuperacion(pedido, datosAdicionales) {
  const totalDespensas = calcularTotal(pedido.pedidoComunidad);
  const totalGeneral = totalDespensas + datosAdicionales.arpillasImporte + datosAdicionales.excedentesImporte;
  return {
    columns: [
      { width: "*", text: "" },
      {
        width: "auto",
        table: {
          body: [
            [
              { text: "TOTAL RECUPERACIÓN POR RUTA:", bold: true, alignment: "right" },
              { text: `$${totalGeneral.toLocaleString("es-Mx", { minimumFractionDigits: 2, maximumFractionDigits: 2 } )}`, bold: true, alignment: "center" }
            ]
          ]
        },
        layout: "noBorders"
      },
      { width: "*", text: "" }
    ],
    margin: [0, 5, 0, 5]
  };
}