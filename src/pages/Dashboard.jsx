import { useAuth } from "@clerk/clerk-react";
import DashboardLayout from "../layout/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import axios from "axios";
import { apiEnpoints } from "../util/apiEnpoints";
import { Loader2 } from "lucide-react";
import DashboardUpload from "../components/DashboardUpload";
import RecentFiles from "../components/RecentFiles";

const Dashboard = () => {
    const [files, setFiles] = useState([]);
    const [uploadFile, setUploadFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [remainingUploads, setRemainingUploads] = useState(5);
    const {getToken} = useAuth();
    const {fetchUserCredits} = useContext(UserCreditsContext);
    const MAX_FILES = 5;

    useEffect(() => {
        const fetchRecentFiles =async () => {
            setLoading(true);
            try{
                const token = await getToken();
                const res = await axios.get(apiEnpoints.FETCH_FILES, {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });

                const sortedFiles = res.data.sort((a, b) =>
                    new Date(b.uploadedAt) - new Date(a.uploadedAt)
                ).slice(0, 5);
                setFiles(sortedFiles);
            }
            catch(error){
                console.error("Error fetching recent files:", error);
            }
            finally{
                setLoading(false);
            }
        };

        fetchRecentFiles();
    }, [getToken]);

    const handleFilechange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if(uploadFile.length + selectedFiles.length > MAX_FILES){
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once`);
            setMessageType('error');
            return;
        }

        // Add hte new files to the existing files
        setUploadFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        setMessage('');
        setMessageType('');
    };

    // Remove a file from the upload list
    const handleRemovefile = (index) => {
        setUploadFiles(prevfiles => prevfiles.filter((_, i) => i !== index));
        setMessage('');
        setMessageType('');
    };

    // Calculate remaining uploads
    useEffect(() => {
        setRemainingUploads(MAX_FILES - uploadFile.length);
}, [uploadFile]);

     const handleUpload = async () => {
        if(uploadFile.length === 0){
            setMessage('Please select at least one file to upload.');
            setMessageType('error');
            return;
        }

        if(uploadFile.length > MAX_FILES){
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once`);
            setMessageType('error');
            return;
        }

        setUploading(true);
        setMessage('Uploading files...');
        setMessageType('info');

        const formDate = new FormData();
        uploadFile.forEach(files => formDate.append('files', files));

        try{
            const token = await getToken();
            const response  = await axios.post(apiEnpoints.UPLOAD_FILE, formDate, {
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type' : 'multipart/form-data'
                }
            });

            setMessage('Files uploaded successfully!!');
            setMessageType('success');
            setUploadFiles([]);

            // Refresh the recent files list
            const res = await axios.get(apiEnpoints.FETCH_FILES, {
                headers: {
                    'Authorization' : `Bearer ${token}`,
                }
            });

            //Sort by uploadedAt and take only the 5 mot recent files
            const sortedFiles = res.data.sort((a, b) => 
                new Date(b.uploadedAt) - new Date(a.uploadedAt)
            ).slice(0, 5);

            setFiles(sortedFiles);

            await fetchUserCredits();
        }
        catch(error){
            console.error('Error uploading files:', error);
            setMessage(error.response?.data?.message || 'Error uplaodibng files.');
            setMessageType('error');
        }
        finally{
            setUploading(false);
        }
     };


    return(
        <DashboardLayout activeMenu="Dashboard">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">My Drive</h1>
                <p className="text-gray-600 mb-6">Upload, manage, and share your files securely</p>
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-4 ${
                        messageType === 'error' ? 'bg-red-50 text-red-700' :
                            messageType === 'success' ? 'bg-green-50 text-green-700' :
                                'bg-red-50 text-red-700'
                    }`}>
                        {message}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left column */}
                    <div className="w-full md:w-[40%]">
                        <DashboardUpload 
                            files={uploadFile}
                            onFileChange={handleFilechange}
                            onUpload={handleUpload}
                            uploading={uploading}
                            onRemoveFile={handleRemovefile}
                            remainingUploads={remainingUploads}
                        />
                    </div>


                    {/* right column */}
                    <div className="w-full md:w-[60%]">
                        {loading ? (
                            <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center">
                                <Loader2 size={40} className="text-red-500 animate-spin mb-4"/>
                                <p className="text-gray-500">Loading your files...</p>
                            </div>
                        ): (
                            <RecentFiles files={files}/>
                        )}
                    </div>
                </div>

            </div>
        </DashboardLayout>
    )
}

export default Dashboard;