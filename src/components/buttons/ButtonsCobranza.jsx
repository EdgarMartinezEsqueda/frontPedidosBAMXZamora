import { HiEye, HiRefresh, HiDocumentAdd } from 'react-icons/hi';

const BotonCobranza = ({ generada, url, onGenerar }) => (
  <div className="flex justify-center mt-6">
    {generada ? (
      <div className="flex flex-col items-center gap-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-azulLogo text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          <HiEye className="w-5 h-5" />
          Ver Cobranza
        </a>
        <button
          onClick={onGenerar}
          className="inline-flex items-center gap-1 text-verdeLogo hover:text-green-700 underline transition-colors"
        >
          <HiRefresh className="w-4 h-4" />
          Generar Nuevamente
        </button>
      </div>
    ) : (
      <button
        onClick={onGenerar}
        className="inline-flex items-center gap-2 bg-verdeLogo text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors"
      >
        <HiDocumentAdd className="w-5 h-5" />
        Generar Cobranza
      </button>
    )}
  </div>
);

export default BotonCobranza;