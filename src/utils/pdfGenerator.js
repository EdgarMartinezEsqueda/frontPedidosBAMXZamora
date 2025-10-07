import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logoBase64 } from "utils/logoBase64";

pdfMake.vfs = pdfFonts;

// Constantes y configuración centralizada
const FONTS = {
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-MediumItalic.ttf"
  }
};

const STYLES = {
  header: { fontSize: 9, bold: true, alignment: "center" },
  title: { fontSize: 10, bold: true, alignment: "center", margin: [0, 0, 0, 5] },
  tableHeader: { bold: true, fontSize: 7, alignment: "center" },
  cellCenter: { alignment: "center", fontSize: 7 },
  total: { fontSize: 9, bold: true, margin: [0, 10, 0, 10] },
  depositInfo: { fontSize: 8, bold: true, alignment: "center", margin: [0, 5, 0, 5] },
  efectivoTitle: { fontSize: 10, bold: true, alignment: "center", margin: [0, 0, 0, 10] },
  denominationHeader: { fontSize: 7, bold: true, alignment: "center" },
  denominationCell: { fontSize: 7, alignment: "center" },
  totalRow: { fontSize: 10, bold: true, alignment: "center" }
};

const TABLE_LAYOUT = {
  hLineWidth: () => 0.5,
  vLineWidth: () => 0.5,
  paddingTop: () => 1,
  paddingBottom: () => 1
};

const DIVIDER_LINE = {
  canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, dash: { length: 5 } }],
  margin: [0, 0, 0, 2]
};

// Configuración de denominaciones
const DENOMINACIONES = [
  { label: "$1,000", field: "billetes1000", amount: 1000, type: "Billetes" },
  { label: "$500", field: "billetes500", amount: 500, type: "Billetes" },
  { label: "$200", field: "billetes200", amount: 200, type: "Billetes" },
  { label: "$100", field: "billetes100", amount: 100, type: "Billetes" },
  { label: "$50", field: "billetes50", amount: 50, type: "Billetes" },
  { label: "$20", field: "billetes20", amount: 20, type: "Billetes" },
  { label: "$20", field: "monedas20", amount: 20, type: "Monedas" },
  { label: "$10", field: "monedas10", amount: 10, type: "Monedas" },
  { label: "$5", field: "monedas5", amount: 5, type: "Monedas" },
  { label: "$2", field: "monedas2", amount: 2, type: "Monedas" },
  { label: "$1", field: "monedas1", amount: 1, type: "Monedas" },
  { label: "$0.50", field: "monedas50C", amount: 0.5, type: "Monedas" }
];

// Utilidad para formatear moneda
const formatCurrency = (value) => 
  `$${parseFloat(value).toLocaleString("es-MX", { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;

// Utilidad para formatear fecha
const formatDate = (date) => new Date(date).toLocaleDateString("es-MX");

// Función principal optimizada
export const generateCobranzaPDF = (pedido, datosAdicionales, datosEfectivo) => {
  const content = [
    ...buildSeccionCompleta(pedido, datosAdicionales, datosEfectivo),
    DIVIDER_LINE,
    ...buildSeccionCompleta(pedido, datosAdicionales, datosEfectivo), // Segunda copia
    DIVIDER_LINE
  ];

  const docDefinition = {
    pageMargins: [20, 20, 20, 20],
    content,
    styles: STYLES,
    defaultStyle: { font: "Roboto" }
  };

  return pdfMake.createPdf(docDefinition, null, FONTS);
};

// Construir sección completa (reutilizable para ambas copias)
function buildSeccionCompleta(pedido, datosAdicionales, datosEfectivo) {
  return [
    ...buildHeader(pedido),
    buildCommunityTable(pedido),
    buildExtrasSection(datosAdicionales),
    buildTotalRecuperacion(pedido, datosAdicionales),
    buildEfectivoSection(datosEfectivo)
  ];
}

// HEADER optimizado
function buildHeader(pedido) {
  const { usuario, ruta, fechaEntrega } = pedido;

  return [
    // Sección con logo y títulos principales
    {
      columns: [
        {
          // Logo a la izquierda
          image: logoBase64.image.data, // Usa directamente la imagen importada
          width: 45,
          height: 30,
        },
        {
          // Textos al centro
          stack: [
            { text: "BANCO DE ALIMENTOS DE ZAMORA A.C.", style: "header" },
            { text: `CUENTA BANBAJÍO: ${import.meta.env.VITE_CUENTA_DEPOSITO}`, style: "header" },
            { text: "RECIBO CUOTA DE RECUPERACIÓN", style: "title" },
          ],
          width: "*"
        }
      ],
      margin: [0, 0, 0, 5]
    },
    {
      table: {
        widths: ["*", "*", "*"],
        body: [[
          { text: `TS: ${usuario.username || "N/A"}`, style: "cellCenter" },
          { text: `RUTA: ${ruta.nombre || "N/A"}`, style: "cellCenter" },
          { text: `FECHA DE ENTREGA: ${formatDate(fechaEntrega)}`, style: "cellCenter" }
        ]]
      },
      layout: "noBorders",
      margin: [0, 0, 0, 5]
    }
  ];
}

// TABLA COMUNIDADES optimizada
function buildCommunityTable(pedido) {
  const { pedidoComunidad } = pedido;
  
  // Calcular totales en una sola iteración
  const { rows, totales } = pedidoComunidad.reduce((acc, item) => {
    const { comunidad, despensasCosto, despensasMedioCosto, despensasSinCosto, despensasApadrinadas } = item;
    const costo = comunidad.costoPaquete;
    const totalDespensas = despensasCosto + despensasMedioCosto + despensasSinCosto + despensasApadrinadas;
    const subtotal = (costo * despensasCosto) + ((costo / 2) * despensasMedioCosto);

    acc.rows.push([
      { text: comunidad.nombre, style: "cellCenter" },
      { text: formatCurrency(costo), style: "cellCenter" },
      { text: despensasCosto.toString(), style: "cellCenter" },
      { text: despensasMedioCosto.toString(), style: "cellCenter" },
      { text: despensasSinCosto.toString(), style: "cellCenter" },
      { text: despensasApadrinadas.toString(), style: "cellCenter" },
      { text: totalDespensas.toString(), style: "cellCenter" },
      { text: formatCurrency(subtotal), style: "cellCenter" }
    ]);

    acc.totales.cuota += despensasCosto;
    acc.totales.medio += despensasMedioCosto;
    acc.totales.sin += despensasSinCosto;
    acc.totales.apadrinadas += despensasApadrinadas;
    acc.totales.total += totalDespensas;
    acc.totales.subtotal += subtotal;

    return acc;
  }, { 
    rows: [], 
    totales: { cuota: 0, medio: 0, sin: 0, apadrinadas: 0, total: 0, subtotal: 0 } 
  });

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
        ...rows,
        [
          { text: "TOTAL:", colSpan: 2, style: "cellCenter" }, {},
          { text: totales.cuota.toString(), style: "cellCenter" },
          { text: totales.medio.toString(), style: "cellCenter" },
          { text: totales.sin.toString(), style: "cellCenter" },
          { text: totales.apadrinadas.toString(), style: "cellCenter" },
          { text: totales.total.toLocaleString("es-MX"), style: "cellCenter" },
          { text: formatCurrency(totales.subtotal), style: "cellCenter" }
        ]
      ]
    },
    layout: TABLE_LAYOUT
  };
}

// TABLA EXTRAS simplificada
function buildExtrasSection(datosAdicionales) {
  const { arpillasCantidad, arpillasImporte, excedentes, excedentesImporte } = datosAdicionales;

  return {
    table: {
      widths: ["*", "auto", "auto"],
      body: [
        [{ text: "EXTRAS", colSpan: 3, style: "tableHeader" }, {}, {}],
        [
          { text: "CONCEPTO", style: "tableHeader" },
          { text: "DETALLE", style: "tableHeader" },
          { text: "IMPORTE", style: "tableHeader" }
        ],
        [
          { text: "ARPILLAS", style: "cellCenter" },
          { text: arpillasCantidad.toString(), style: "cellCenter" },
          { text: formatCurrency(arpillasImporte), style: "cellCenter" }
        ],
        [
          { text: "EXCEDENTES", style: "cellCenter" },
          { text: excedentes, style: "cellCenter" },
          { text: formatCurrency(excedentesImporte), style: "cellCenter" }
        ]
      ]
    },
    layout: TABLE_LAYOUT,
    margin: [0, 10, 0, 0]
  };
}

// TOTAL RECUPERACIÓN optimizado
function buildTotalRecuperacion(pedido, datosAdicionales) {
  const totalDespensas = pedido.pedidoComunidad.reduce((sum, item) => {
    const { comunidad, despensasCosto, despensasMedioCosto } = item;
    return sum + (comunidad.costoPaquete * despensasCosto) + 
           ((comunidad.costoPaquete / 2) * despensasMedioCosto);
  }, 0);

  const totalGeneral = totalDespensas + datosAdicionales.arpillasImporte + datosAdicionales.excedentesImporte;

  return {
    columns: [
      { width: "*", text: "" },
      {
        width: "auto",
        table: {
          body: [[
            { text: "TOTAL RECUPERACIÓN POR RUTA:", bold: true, alignment: "right" },
            { text: formatCurrency(totalGeneral), bold: true, alignment: "center" }
          ]]
        },
        layout: "noBorders"
      },
      { width: "*", text: "" }
    ],
    margin: [0, 2, 0, 2]
  };
}

// SECCIÓN EFECTIVO optimizada
function buildEfectivoSection(datosEfectivo) {
  if (!datosEfectivo || datosEfectivo.totalEfectivo === "0.00") {
    return {
      text: "NO SE REGISTRÓ EFECTIVO PARA ESTA RUTA",
      style: "denominationHeader",
      alignment: "center",
      margin: [0, 20, 0, 20]
    };
  }

  const denominacionesConValor = DENOMINACIONES
    .map(d => ({ ...d, value: datosEfectivo[d.field] || 0 }))
    .filter(d => d.value > 0);

  const billetes = denominacionesConValor.filter(d => d.type === "Billetes");
  const monedas = denominacionesConValor.filter(d => d.type === "Monedas");

  const content = [];

  // Crear tablas lado a lado
  const tablasColumns = [
    billetes.length > 0 && buildDenominacionTable("BILLETES", billetes),
    monedas.length > 0 && buildDenominacionTable("MONEDAS", monedas)
  ].filter(Boolean);

  if (tablasColumns.length > 0) {
    content.push({
      columns: [
        { width: "*", text: "" }, // Espaciador izquierdo
        ...tablasColumns,
        { width: "*", text: "" }  // Espaciador derecho
      ],
      columnGap: 10,
      margin: [0, 0, 0, 5]
    });
  }

  // Total general
  content.push({
    columns: [
      { width: "*", text: "" },
      {
        width: "auto",
        table: {
          widths: [200, 100],
          body: [[
            { text: "TOTAL EFECTIVO RECAUDADO:", style: "totalRow", fontSize: 8 },
            { text: formatCurrency(datosEfectivo.totalEfectivo), style: "totalRow", fontSize: 8 }
          ]]
        },
        layout: {
          paddingTop: () => 4,
          paddingBottom: () => 4,
          paddingLeft: () => 8,
          paddingRight: () => 8
        }
      },
      { width: "*", text: "" }
    ],
    margin: [0, 0, 0, 5]
  });

  // Observaciones
  if (datosEfectivo.observaciones) {
    content.push({
      table: {
        widths: ["*"],
        body: [
          [{ text: "OBSERVACIONES", style: "denominationHeader" }],
          [{ text: datosEfectivo.observaciones, style: "denominationCell", margin: [5, 5, 5, 5] }]
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

// Helper para construir tabla de denominaciones
function buildDenominacionTable(titulo, items) {
  const rows = items.map(item => [
    { text: item.label, style: "denominationCell", fontSize: 6 },
    { text: item.value.toString(), style: "denominationCell", fontSize: 6 },
    { text: formatCurrency(item.value * item.amount), style: "denominationCell", fontSize: 6 }
  ]);

  const subtotal = items.reduce((sum, item) => sum + (item.value * item.amount), 0);

  return {
    width: "auto", // Cambio de 48% a auto para mejor centrado
    table: {
      widths: [45, 30, 45], // Reducido: 60→45, 40→30, 50→45
      body: [
        [{ text: titulo, colSpan: 3, style: "denominationHeader", fontSize: 7 }, {}, {}],
        [
          { text: "DENOM.", style: "header", fontSize: 6 },
          { text: "CANT.", style: "header", fontSize: 6 },
          { text: "SUBTOTAL", style: "header", fontSize: 6 }
        ],
        ...rows,
        [
          { text: "SUBTOTAL:", colSpan: 2, style: "totalRow", fontSize: 7 }, {},
          { text: formatCurrency(subtotal), style: "totalRow", fontSize: 7 }
        ]
      ]
    },
    layout: {
      paddingTop: () => 1,
      paddingBottom: () => 1
    }
  };
}