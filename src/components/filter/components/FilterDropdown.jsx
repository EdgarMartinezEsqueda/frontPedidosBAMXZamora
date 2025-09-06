import React, { useState, useEffect, useRef } from "react";
import useClickOutside from "hooks/useClickOutside";
import { FaAngleDown } from "react-icons/fa6";

const FilterDropdown = ({
  title,
  allItems,
  selectedItems,
  onSelectionChange,
  showSearch = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(allItems);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  allItems = allItems.sort();

  // Cerrar al hacer clic fuera
  useClickOutside([dialogRef, triggerRef], () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  useEffect(() => {
    const filtered = allItems.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, allItems]);

  const handleToggleItem = (item) => {
    const newSelection = selectedItems.includes(item)
      ? selectedItems.filter(i => i !== item)
      : [...selectedItems, item];
    onSelectionChange(newSelection);
  };

  const handleReset = () => {
    onSelectionChange([]);
    setSearchTerm("");
  };

  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={toggleDialog}
        className="flex items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 dark:text-white transition hover:border-gray-600 dark:hover:border-gray-300 w-full sm:w-auto cursor-pointer"
      >
        <span className="text-sm font-medium ">{title}</span>
        <span className={`transition ${isOpen ? "rotate-180" : ""}`}>
          <FaAngleDown />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        open={isOpen}
        className={`z-50 fixed sm:absolute start-0 sm:start-auto mt-2 shadow-lg ${ isOpen ? "block" : "hidden" } w-[95vw] max-w-[384px] sm:w-96 top-1/3 sm:top-auto -translate-y-1/2 sm:translate-y-0 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0`}
        onCancel={() => setIsOpen(false)}
      >
        <div className="w-96 rounded-sm border border-gray-200 bg-white">
          <header className="flex items-center justify-between p-4">
            <span className="text-sm text-gray-700 cursor-default">
              {selectedItems.length} seleccionados
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-900 underline underline-offset-4 cursor-pointer"
            >
              Reset
            </button>
          </header>

          <div className="p-4">
            {showSearch && (
              <input
                type="text"
                placeholder={`Buscar ${title.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border-gray-200 mb-4 shadow-xs sm:text-sm p-2"
              />
            )}

            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {filteredItems.map((item) => (
                <li key={item}>
                  <label className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleToggleItem(item)}
                      className="size-5 rounded-sm border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{item}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default FilterDropdown;