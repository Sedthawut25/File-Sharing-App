import Modal from "./Modal";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

const LinkShareModal = ({ isOpen, onClose, link, title = "Share File" }) => {

    const copyToClipboard = () => {
        navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard!");
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            confirmText="Close"
            cancelText={null}  // ไม่ต้องมีปุ่ม Cancel
            onConfirm={onClose} // ปุ่ม Close
        >
            <div className="space-y-4">
                <p className="text-gray-700">Share this link with other to give them access to this file.</p>

                <div className="flex items-center gap-2 bg-red-100 rounded-md px-3 py-2">
                    <input 
                        value={link}
                        readOnly
                        className="flex-1 bg-transparent outline-none text-gray-700"
                    />
                    <button 
                        onClick={copyToClipboard}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Copy size={20} />
                    </button>
                </div>
                <p className="text-gray-400 text-sm ">Anayone with this link can access this file</p>
            </div>
        </Modal>
    );
};

export default LinkShareModal;