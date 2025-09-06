import { useAuth } from "context/AuthContext";
import { useConfirmDelete } from "hooks/useConfirmDelete";
import { FaRegEdit, FaRegEye } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router";
import { hasPermission } from "utils/permisos";

const ActionButtons = ({
  item,
  resource,
  basePath,
  onDelete,
  onEdit,
  getEditCondition = () => false,
  getDeleteCondition = () => false,
  showView = true,
  // Props para personalizar el modal de confirmación
  deleteConfirmOptions = {}
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { confirmDelete } = useConfirmDelete();

  const handleDelete = async (itemId) => {
    await confirmDelete(onDelete, itemId, deleteConfirmOptions);
  };

  return (
    <div className="flex justify-end md:justify-center gap-x-6 text-lg">
      {showView && (
        <button
          className="text-gray-500 transition-colors duration-200 dark:hover:text-green-500 dark:text-gray-300 hover:text-green-500 focus:outline-none cursor-pointer"
          onClick={() => navigate(`/${basePath}/${item.id}`)}
        >
          <FaRegEye />
        </button>
      )}

      {hasPermission(user.data, resource, "update") && (
        <button
          className={`text-gray-500 transition-colors duration-200 dark:text-gray-300 focus:outline-none ${
            getEditCondition(item) 
              ? "!cursor-not-allowed" 
              : "cursor-pointer hover:text-yellow-500 dark:hover:text-yellow-500"
          }`}
          onClick={() => {
            if (!getEditCondition(item)) {
              if (onEdit) {
                onEdit(item);
              } else {
                navigate(`/${basePath}/editar/${item.id}`);
              }
            }
          }}
          disabled={getEditCondition(item)}
        >
          <FaRegEdit />
        </button>
      )}
      
      {hasPermission(user.data, resource, "delete") && (
        <button
          className={`text-gray-500 transition-colors duration-200 dark:text-gray-300 focus:outline-none ${
            getDeleteCondition(item) 
              ? "!cursor-not-allowed" 
              : "cursor-pointer hover:text-red-500 dark:hover:text-red-500"
          }`}
          onClick={() => !getDeleteCondition(item) && handleDelete(item.id)}
          disabled={getDeleteCondition(item)}
        >
          <MdDeleteOutline />
        </button>
      )}
    </div>
  );
};

export default ActionButtons;