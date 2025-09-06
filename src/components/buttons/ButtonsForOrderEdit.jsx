// components/buttons/ButtonsForOrderEdit.jsx
import { IoIosDoneAll } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";

const ButtonGroup = ({ disabled, onSave, onFinalize, onDelete }) => {
  const buttons = [
    {
      label: "Guardar",
      icon: <FaRegSave className="text-2xl" />,
      bg: "hover:bg-verdeLogo hover:text-white",
      action: onSave,
    },
    {
      label: "Finalizar",
      icon: <IoIosDoneAll className="text-2xl" />,
      bg: "hover:bg-amarilloLogo hover:text-white",
      action: onFinalize,
      hide: !onFinalize,
    },
    {
      label: "Borrar",
      icon: <MdDeleteOutline className="text-2xl" />,
      bg: "hover:bg-rojoLogo hover:text-white",
      action: onDelete,
    },
  ];

  return (
    <div className="flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900">
      {buttons.map((button, index) => (
        !button.hide && (
          <button
            key={index}
            disabled={disabled}
            onClick={button.action}
            className={`flex items-center px-4 py-2 transition-colors duration-200 gap-x-3 cursor-pointer
              ${
                disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : `text-gray-600 dark:text-white ${button.bg}`
              }`}
          >
            {button.icon}
            <span>{button.label}</span>
          </button>
        )
      ))}
    </div>
  );
};

export default ButtonGroup;