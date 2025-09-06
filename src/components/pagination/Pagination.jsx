const Pagination = ({ 
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Calcular números de página
  const getPageNumbers = () => {
    if (totalPages <= 1) return [];
    
    const threshold = 7;
    const pages = [];
    
    if (totalPages <= threshold) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      // Mostrar puntos solo si hay más de 1 página de diferencia
      const startWindow = Math.max(2, currentPage - 2);
      const endWindow = Math.min(totalPages - 1, currentPage + 2);
      
      if (startWindow > 2) pages.push("...");
      for (let i = startWindow; i <= endWindow; i++) pages.push(i);
      if (endWindow < totalPages - 1) pages.push("...");
      
      pages.push(totalPages);
    }
    return pages;
  };

  // Manejar teclado para accesibilidad
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-1 flex-nowrap">
        {/* Botón Anterior */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          onKeyDown={(e) => handleKeyDown(e, () => onPageChange(Math.max(1, currentPage - 1)))}
          className={`flex-shrink-0 inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in text-xs sm:text-sm rounded-md py-1 px-2 sm:py-2 sm:px-4 ${
            currentPage === 1 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-stone-800/5 hover:border-stone-800/5 cursor-pointer focus:ring-2 focus:ring-blue-500"
          }`}
          aria-label="Página anterior"
          aria-disabled={currentPage === 1}
        >
          <span className="hidden sm:inline">Atrás</span>
          <span className="sm:hidden" aria-hidden="true">←</span>
        </button>
        
        {/* Números de página */}
        {getPageNumbers().map((page, index) => (
          page === "..." 
            ? <span
                key={`ellipsis-${index}`}
                className="flex-shrink-0 px-2 py-1 text-stone-800 dark:text-white cursor-default"
                aria-hidden="true"
              >
                ...
              </span>
            : <button
                key={page}
                onClick={() => onPageChange(page)}
                onKeyDown={(e) => handleKeyDown(e, () => onPageChange(page))}
                className={`flex-shrink-0 inline-grid place-items-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in text-xs sm:text-sm min-w-[28px] min-h-[28px] sm:min-w-[38px] sm:min-h-[38px] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  currentPage === page
                    ? "bg-stone-800 border-stone-800 text-stone-50 shadow-sm hover:shadow-md hover:bg-stone-700"
                    : "bg-transparent border-transparent text-stone-800 dark:text-white hover:bg-stone-800/5 dark:hover:bg-white/5 cursor-pointer"
                }`}
                aria-label={`Ir a página ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
        ))}

        {/* Botón Siguiente */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          onKeyDown={(e) => handleKeyDown(e, () => onPageChange(Math.min(totalPages, currentPage + 1)))}
          className={`flex-shrink-0 inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center transition-all duration-300 ease-in text-xs sm:text-sm rounded-md py-1 px-2 sm:py-2 sm:px-4 ${
            currentPage === totalPages 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-stone-800/5 hover:border-stone-800/5 cursor-pointer focus:ring-2 focus:ring-blue-500"
          }`}
          aria-label="Página siguiente"
          aria-disabled={currentPage === totalPages}
        >
          <span className="hidden sm:inline">Siguiente</span>
          <span className="sm:hidden" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;