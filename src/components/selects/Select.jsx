const Select = ({ name, value, options = [], onChange, placeholder }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block rounded-md border border-gray-300 px-3 py-2 focus:border-verdeLogo focus:outline-none focus:ring-2 focus:ring-verdeLogoe mx-auto"
    >
      <option value="" className="text-gray-700 dark:text-white dark:bg-gray-800">{placeholder}</option>
      {options.map((item) => (
        <option key={item.id} value={item.id} className="text-gray-700 dark:text-white dark:bg-gray-800">
          {item.nombre}
        </option>
      ))}
    </select>
  );
};

export default Select;