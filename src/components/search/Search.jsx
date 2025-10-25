import { HiSearch } from "react-icons/hi";

const SearchInput = ({ value, onChange, placeholder = "Buscar...", className = "", ...props }) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        aria-label="Buscar"
        {...props}
      />

      <HiSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
      />
    </div>
  );
};

export default SearchInput;
