// src/components/Modal.jsx
const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    confirmText = "OK",
    cancelText = "Cancel",
    confirmationButtonClass = "bg-red-600 hover:bg-red-700",
    onConfirm,
    size = "md",
}) => {

    if (!isOpen) return null;

    const widthClass =
        size === "sm" ? "max-w-md" :
        size === "lg" ? "max-w-3xl" :
        "max-w-xl";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className={`bg-white rounded-xl shadow-lg w-full ${widthClass} mx-4`}>
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">{children}</div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">

                    {/* ปุ่ม Cancel แสดงเฉพาะถ้ามีข้อความ */}
                    {cancelText && (
                        <button 
                            onClick={onClose} 
                            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            {cancelText}
                        </button>
                    )}

                    {/* ปุ่ม Confirm */}
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-md ${confirmationButtonClass}`}
                    >
                        {confirmText}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Modal;