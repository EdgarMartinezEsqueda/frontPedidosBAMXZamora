import ModalComplemento from "components/modals/ModalComplemento";
import { useState } from "react";
import { HiPlus } from "react-icons/hi";

const AgregarComplementoButton = ({ idPedido, disabled = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={disabled}
        className="bg-verdeLogo text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium inline-flex items-center gap-2"
      >
        <HiPlus className="w-5 h-5" />
        Agregar Complemento
      </button>

      <ModalComplemento
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        idPedido={idPedido}
      />
    </>
  );
};

export default AgregarComplementoButton;
