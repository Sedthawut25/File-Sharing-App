import { use, useContext, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { apiEnpoints } from "../util/apiEnpoints";
import toast from "react-hot-toast";
import UploadBox from "../components/UploadBox";

const Upload = () => {
    const [file, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("") //success or error
    const {getToken} = useAuth();
    const {credits, setCredits} = useContext(UserCreditsContext);
    const MAX_FILES = 5;

    const handleFileChange = (e) => {
        const selectedFile = Array.from(e.target.files);
        if(file.length + selectedFile.length > MAX_FILES){
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once`);
            setMessageType("error");
            return;
        }

        //add the new files into the existing files
        setFiles((prevFiles) => [...prevFiles, ...selectedFile]);
        setMessage("");
        setMessageType("");
    }

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) =>  prevFiles.filter((_, i) => i !== index));
        setMessageType("");
        setMessage("");
    }

    const handleUpload = async () => {
        if(file.length === 0){
            setMessageType("error");
            setMessage("Place select atleast one file to upload.");
            return;
        }

        if(file.length > MAX_FILES){
            setMessage(`You can only upload a maximun of ${MAX_FILES} files at once`);
            return;
        }

        setUploading(true);
        setMessage("Uploading files...");
        setMessageType("info");

        const formData = new FormData();
        file.forEach((file) => formData.append("files", file));

        try{
            const token = await getToken();
            const response = await axios.post(apiEnpoints.UPLOAD_FILE, formData, {headers : {"Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`}});
            
            if(response.data && response.data.remainingCredits !== undefined){
                setCredits(response.data.remainingCredits);
            }

            setMessage("Files uploaded successfully");
            setMessageType("success");
            setFiles([]);
        }
        catch (error){
            console.error('Error uploading files:', error);
            toast.error('Error uploading files:' , error.message);
            setMessage(error.response?.data?.message || "Error uploading files. Please try agian.");
            setMessageType("error");
        }
        finally{
            setUploading(false);
        }
    }

    const isUploadDisabled = file.length === 0 || file.length > MAX_FILES || credits <= 0 || file.length > credits;


    return (
        <DashboardLayout activeMenu="Upload">
            <div className="p-6">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${messageType === 'error' ? 'bg-red-50 text-red-700': messageType === 'success' ? 'bg-green-50 text-green-700': 'bg-blue-50 text-blue-700'}`}>
                        {messageType === 'error' && <AlertCircle size={20} />}
                        {message}
                    </div>
                )}

                <UploadBox
                    files={file}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    uploading={uploading}
                    onRemoveFile={handleRemoveFile}
                    remainingCredits={credits}
                    isUploadDisabled={isUploadDisabled}
                />
            </div>
        </DashboardLayout>
    )
}

export default Upload;