import Modal from "./Modal.jsx";

const ConfirmationDialog = (
    {
        isOpen, 
        onClose, 
        title = "Confirm Acton", 
        message = "Are you sure you want to proceed",
        confirmText = "Confirm",
        cancelText = "Cancel",
        onConfirm,
        confirmationButtonClass = "bg-red-600 hover:bg-red-700"
    }) => {
    return(
        <Modal 
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            confirmText={confirmText}
            cancelText={cancelText}
            confirmationButtonClass={confirmationButtonClass}
            onConfirm={onConfirm}
            size="sm"
        >
            <p className="text-gray-600">{message}</p>
        </Modal>
    )
}

export default ConfirmationDialog;