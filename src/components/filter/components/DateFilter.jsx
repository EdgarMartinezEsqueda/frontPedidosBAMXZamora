import useClickOutside from "hooks/useClickOutside";
import { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";

const DateFilter = ({ onDateChange, dateRange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(dateRange?.startDate || "");
  const [endDate, setEndDate] = useState(dateRange?.endDate || "");
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useClickOutside([dialogRef, triggerRef], () => {
    if (isOpen) setIsOpen(false);
  });

  useEffect(() => {
    onDateChange({ startDate, endDate });
  }, [startDate, endDate]);

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setIsOpen(false);
  };

  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={toggleDialog}
        className="flex items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 dark:text-white transition hover:border-gray-600 dark:hover:border-gray-300 cursor-pointer"
      >
        <span className="text-sm font-medium">Fecha</span>
        <span className={`transition ${isOpen ? "rotate-180" : ""}`}>
          <FaAngleDown />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        open={isOpen}
        className={`z-50 fixed sm:absolute start-0 sm:start-auto mt-2 shadow-lg ${ isOpen ? "block" : "hidden" } w-[95vw] max-w-[384px] sm:w-96 top-1/2 sm:top-auto -translate-y-1/2 sm:translate-y-0 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0`}
        onCancel={() => setIsOpen(false)}
      >
        <div className="w-96 rounded-sm border border-gray-200 bg-white">
          <header className="flex items-center justify-between p-4">
            <span className="text-sm text-gray-700">
              {(startDate || endDate) ? "Rango seleccionado" : "Sin fechas"}
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-900 underline underline-offset-4 cursor-pointer"
            >
              Reset
            </button>
          </header>

          <div className="space-y-4 p-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Desde:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border-gray-200 shadow-xs text-sm p-2 cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">Hasta:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border-gray-200 shadow-xs text-sm p-2 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default DateFilter;