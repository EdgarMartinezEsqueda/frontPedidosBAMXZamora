import { FaRegCheckCircle } from "react-icons/fa";

const ModalConfirmation = ({ isOpen, onClose, siguiente }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-10 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal={true}
    >
      {/* Fondo con overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div 
          className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right dark:bg-gray-900 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
          onClick={(e) => e.stopPropagation()} // Prevenir cierre al hacer clic en el contenido
        >
          <div>
            <div className="flex items-center justify-center">
              <FaRegCheckCircle className="text-5xl text-verdeLogo" />
            </div>

            <div className="mt-2 text-center">
              <h3
                className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white"
                id="modal-title"
              >
                Confirmar
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                ¿Estas segur@ de enviar este contenido?
              </p>
            </div>
          </div>

          <div className="mt-5 sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:items-center ">
              <button 
                onClick={onClose}
                className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:mt-0 sm:w-auto sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
              >
                Cancelar
              </button>

              <button 
                className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:w-auto sm:mt-0 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                onClick={siguiente}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmation;