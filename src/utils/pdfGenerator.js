import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { logoBase64 } from "utils/logoBase64";

pdfMake.vfs = pdfFonts;

// ============ CONFIGURACIÓN ============
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
  denominationHeader: { fontSize: 7, bold: true, alignment: "center" },
  denominationCell: { fontSize: 7, alignment: "center" },
  totalRow: { fontSize: 10, bold: true, alignment: "center" }
};

const LAYOUT = {
  default: { hLineWidth: () => 0.5, vLineWidth: () => 0.5, paddingTop: () => 1, paddingBottom: () => 1 },
  minimal: { paddingTop: () => 1, paddingBottom: () => 1 }
};

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

// ============ UTILIDADES ============
const fmt = {
  currency: (val) => `$${parseFloat(val).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  date: (date) => new Date(date).toLocaleDateString("es-MX"),
  number: (num) => num.toLocaleString("es-MX")
};

const getDivider = () => ({
  canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, dash: { length: 5 } }],
  margin: [0, 5, 0, 5]
});

// Helper genérico para crear tablas
const createTable = (widths, body, layout = LAYOUT.default) => ({ table: { widths, body }, layout });

// Helper para centrar contenido horizontalmente
const center = (...items) => ({
  columns: [{ width: "*", text: "" }, ...items, { width: "*", text: "" }]
});

// ============ GENERADOR PRINCIPAL ============
export const generateCobranzaPDF = (pedidoData, cobranza, efectivo, transferencias, complementos) => {
  return pdfMake.createPdf({
    pageMargins: [20, 20, 20, 20],
    content: [
      ...buildSection(pedidoData, cobranza, efectivo, transferencias, complementos),
      getDivider(),
      ...buildSection(pedidoData, cobranza, efectivo, transferencias, complementos)
    ],
    styles: STYLES,
    defaultStyle: { font: "Roboto" }
  }, null, FONTS);
};

// ============ CONSTRUCCIÓN DE SECCIONES ============
function buildSection(pedidoData, cobranza, efectivo, transferencias, complementos) {
  return [
    buildHeader(pedidoData, cobranza),
    buildCommunityTable(pedidoData),
    buildTotalRow(pedidoData),
    buildPaymentSection(efectivo, transferencias, complementos)
  ];
}

function buildHeader(pedidoData, cobranza) {
  const { usuario, ruta, fechaEntrega } = pedidoData;
  
  return [
    {
      columns: [
        { image: logoBase64.image.data, width: 45, height: 30 },
        {
          stack: [
            { text: "BANCO DE ALIMENTOS DE ZAMORA A.C.", style: "header" },
            { text: `CUENTA BANBAJÍO: ${import.meta.env.VITE_CUENTA_DEPOSITO}`, style: "header" },
            { text: "RECIBO CUOTA DE RECUPERACIÓN", style: "title" }
          ],
          width: "*"
        },
        { text: `FOLIO: ${cobranza.folio}`, style: "header" }
      ],
      margin: [0, 0, 0, 5]
    },
    createTable(
      ["*", "*", "*"],
      [[
        { text: `TS: ${usuario.username || "N/A"}`, style: "cellCenter" },
        { text: `RUTA: ${ruta.nombre || "N/A"}`, style: "cellCenter" },
        { text: `FECHA DE ENTREGA: ${fmt.date(fechaEntrega)}`, style: "cellCenter" }
      ]],
      "noBorders"
    )
  ];
}

function buildCommunityTable(pedidoData) {
  const totals = { cuota: 0, medio: 0, sin: 0, apadrinadas: 0, total: 0, subtotal: 0 };
  
  const rows = pedidoData.pedidoComunidad.map(item => {
    const { comunidad, despensasCosto: cuota, despensasMedioCosto: medio, despensasSinCosto: sin, despensasApadrinadas: apad } = item;
    const costo = parseFloat(comunidad.costoPaquete);
    const totalDesp = cuota + medio + sin + apad;
    const subtotal = (costo * cuota) + ((costo / 2) * medio);

    totals.cuota += cuota;
    totals.medio += medio;
    totals.sin += sin;
    totals.apadrinadas += apad;
    totals.total += totalDesp;
    totals.subtotal += subtotal;

    return [
      comunidad.nombre,
      fmt.currency(costo),
      cuota,
      medio,
      sin,
      apad,
      totalDesp,
      fmt.currency(subtotal)
    ].map(text => ({ text, style: "cellCenter" }));
  });

  return createTable(
    ["*", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
    [
      ["COMUNIDAD", "CUOTA", "CON CUOTA", "MEDIO COSTO", "SIN COSTO", "APADRINADAS", "TOTAL", "TOTAL $"]
        .map(text => ({ text, style: "tableHeader" })),
      ...rows,
      [
        { text: "TOTAL:", colSpan: 2, style: "cellCenter" }, {},
        ...Object.values(totals).slice(0, -1).map(v => ({ text: v.toString(), style: "cellCenter" })),
        { text: fmt.currency(totals.subtotal), style: "cellCenter" }
      ]
    ]
  );
}

function buildTotalRow(pedidoData) {
  const total = pedidoData.pedidoComunidad.reduce((sum, { comunidad, despensasCosto, despensasMedioCosto }) => {
    const costo = parseFloat(comunidad.costoPaquete);
    return sum + (costo * despensasCosto) + ((costo / 2) * despensasMedioCosto);
  }, 0);

  return center({
    width: "auto",
    ...createTable(
      ["auto", "auto"],
      [[
        { text: "TOTAL RECUPERACIÓN POR RUTA:", bold: true, alignment: "right" },
        { text: fmt.currency(total), bold: true, alignment: "center" }
      ]],
      "noBorders"
    ),
    margin: [0, 2, 0, 2]
  });
}

// ============ SECCIÓN DE PAGOS ============
function buildPaymentSection(efectivo, transferencias, complementos) {
  const hasEfectivo = efectivo && parseFloat(efectivo.totalEfectivo) > 0;
  const hasTransf = transferencias?.length > 0;
  const hascomplementos = complementos?.length > 0;

  if (!hasEfectivo && !hasTransf && !hascomplementos) {
    return { text: "NO SE REGISTRÓ EFECTIVO, TRANSFERENCIAS NI complementos PARA ESTA RUTA", style: "denominationHeader", margin: [0, 20, 0, 20] };
  }

  const tables = [];
  const totals = [];

  // Efectivo
  if (hasEfectivo) {
    const denoms = DENOMINACIONES
      .map(d => ({ ...d, value: efectivo[d.field] || 0 }))
      .filter(d => d.value > 0);

    const billetes = denoms.filter(d => d.type === "Billetes");
    const monedas = denoms.filter(d => d.type === "Monedas");

    if (billetes.length) tables.push(buildDenomTable("BILLETES", billetes));
    if (monedas.length) tables.push(buildDenomTable("MONEDAS", monedas));
    
    totals.push(["TOTAL EFECTIVO:", efectivo.totalEfectivo]);
  }

  // Transferencias
  if (hasTransf) {
    tables.push(buildTransferTable(transferencias));
    const totalTransf = transferencias.reduce((sum, t) => sum + parseFloat(t.monto), 0);
    totals.push(["TOTAL TRANSFERENCIAS:", totalTransf]);
  }

  // complementos
  if (hascomplementos) {
    tables.push(buildcomplementosTable(complementos));
    const totalExc = complementos.reduce((sum, e) => sum + parseFloat(e.monto), 0);
    totals.push(["TOTAL complementos:", totalExc]);
  }

  // Total general
  if ((hasEfectivo ? 1 : 0) + (hasTransf ? 1 : 0) + (hascomplementos ? 1 : 0) > 1) {
    const totalGen = (hasEfectivo ? parseFloat(efectivo.totalEfectivo) : 0) + 
                     (hasTransf ? transferencias.reduce((s, t) => s + parseFloat(t.monto), 0) : 0) +
                     (hascomplementos ? complementos.reduce((s, e) => s + parseFloat(e.monto), 0) : 0);
    totals.push(["TOTAL GENERAL:", totalGen, true]);
  }

  const content = [
    center(...tables),
    {
      ...center({
        width: "auto",
        ...createTable(
          [200, 100],
          totals.map(([label, amount, bold]) => [
            { text: label, style: "totalRow", fontSize: bold ? 9 : 8, bold },
            { text: fmt.currency(amount), style: "totalRow", fontSize: bold ? 9 : 8, bold }
          ]),
          { paddingTop: () => 2, paddingBottom: () => 2, paddingLeft: () => 4, paddingRight: () => 4 }
        )
      }),
      margin: [0, 0, 0, 5]
    }
  ];

  // Observaciones
  if (hasEfectivo && efectivo.observaciones) {
    content.push(
      createTable(
        ["*"],
        [
          [{ text: "OBSERVACIONES", style: "denominationHeader" }],
          [{ text: efectivo.observaciones, style: "denominationCell", margin: [5, 5, 5, 5] }]
        ],
        { paddingTop: () => 4, paddingBottom: () => 4 }
      )
    );
  }

  return content;
}

function buildDenomTable(title, items) {
  const rows = items.map(({ label, value, amount }) => [
    label, value, fmt.currency(value * amount)
  ].map(text => ({ text, style: "denominationCell", fontSize: 6 })));

  const subtotal = items.reduce((sum, { value, amount }) => sum + (value * amount), 0);

  return {
    width: "auto",
    ...createTable(
      [45, 30, 45],
      [
        [{ text: title, colSpan: 3, style: "denominationHeader", fontSize: 7 }, {}, {}],
        [{ text: "DENOM.", style: "header", fontSize: 6 }, { text: "CANT.", style: "header", fontSize: 6 }, { text: "SUBTOTAL", style: "header", fontSize: 6 }],
        ...rows,
        [{ text: "SUBTOTAL:", colSpan: 2, style: "totalRow", fontSize: 7 }, {}, { text: fmt.currency(subtotal), style: "totalRow", fontSize: 7 }]
      ],
      LAYOUT.minimal
    )
  };
}

function buildTransferTable(transferencias) {
  const rows = transferencias.map(t => [
    t.nombreRemitente || "Sin especificar",
    fmt.currency(t.monto)
  ].map(text => ({ text, style: "denominationCell", fontSize: 6 })));

  const total = transferencias.reduce((sum, t) => sum + parseFloat(t.monto), 0);

  return {
    width: "auto",
    ...createTable(
      [90, 45],
      [
        [{ text: "TRANSFERENCIAS", colSpan: 2, style: "denominationHeader", fontSize: 7 }, {}],
        [{ text: "REMITENTE", style: "header", fontSize: 6 }, { text: "MONTO", style: "header", fontSize: 6 }],
        ...rows,
        [{ text: "TOTAL:", style: "totalRow", fontSize: 7 }, { text: fmt.currency(total), style: "totalRow", fontSize: 7 }]
      ],
      LAYOUT.minimal
    )
  };
}

function buildcomplementosTable(complementos) {
  const rows = complementos.map(e => [
    e.producto || "Sin especificar",
    fmt.currency(e.monto)
  ].map(text => ({ text, style: "denominationCell", fontSize: 6 })));

  const total = complementos.reduce((sum, e) => sum + parseFloat(e.monto), 0);

  return {
    width: "auto",
    ...createTable(
      [90, 45],
      [
        [{ text: "complementos", colSpan: 2, style: "denominationHeader", fontSize: 7 }, {}],
        [{ text: "PRODUCTO", style: "header", fontSize: 6 }, { text: "MONTO", style: "header", fontSize: 6 }],
        ...rows,
        [{ text: "TOTAL:", style: "totalRow", fontSize: 7 }, { text: fmt.currency(total), style: "totalRow", fontSize: 7 }]
      ],
      LAYOUT.minimal
    )
  };
}