import { Link } from "react-router";
import { IoIosAdd } from "react-icons/io";

const NewTicketButton = () => {
  return (
    <div className="text-center mb-6">
      <Link 
        to="/tickets/nuevo"
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-verdeLogo hover:bg-green-700 transition-colors duration-200"
      >
        <IoIosAdd className="text-2xl"/>
        Crear Nuevo Ticket
      </Link>
    </div>
  );
};

export default NewTicketButton;