import Swal from "sweetalert2";

export const useConfirmDelete = () => {
  const confirmDelete = async (
    onDeleteFn,
    itemId,
    options = {}
  ) => {
    const {
      title = "¿Estás seguro?",
      text = "No podrás revertir esta acción",
      confirmButtonText = "Sí, eliminar",
      cancelButtonText = "Cancelar",
      successTitle = "¡Eliminado!",
      successText = "El elemento ha sido eliminado correctamente.",
      errorTitle = "Error",
      errorText = "No se pudo eliminar el elemento. Inténtalo de nuevo.",
      showSuccessMessage = true,
      showErrorMessage = true
    } = options;

    const result = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await onDeleteFn(itemId);
        
        if (showSuccessMessage) {
          Swal.fire({
            title: successTitle,
            text: successText,
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
        }
        
        return { success: true };
      } catch (error) {
        if (showErrorMessage) {
          Swal.fire({
            title: errorTitle,
            text: errorText,
            icon: "error",
            confirmButtonText: "Entendido"
          });
        }
        
        return { success: false, error };
      }
    }
    
    return { cancelled: true };
  };

  return { confirmDelete };
};