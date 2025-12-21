import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Copy, Download, Eye, File, FilesIcon, FileText, Globe, Grid, Image, List, Lock, Music, Trash2, Video } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import FileCard from "../components/FileCard";
import { apiEnpoints } from "../util/apiEnpoints";
import ConfirmationDialog from "../components/ConfirmationDialog";
import LinkShareModal from "../components/LinkShareModal";

const MyFile = () => {
    const [files, setFiles] = useState([]);
    const [viewMode, setViewMode] = useState("list");
    const {getToken} = useAuth();
    const navigate = useNavigate();
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        fileId: null
    });

    const [shareModal, setShareModal] = useState({
        isOpen: false,
        fileId: null,
        link: ""
    }); 


    //fetching the files for a logged in user

    const fetchFile = async () => {
        try{
            const token = await getToken();
            const response = await axios.get(apiEnpoints.FETCH_FILES, {headers: {Authorization: `Bearer ${token}`}});
            if((response).status === 200){
                console.log("Token", token)
                console.log("reponse.data = ",response.data);
                setFiles(response.data);
            }
        }
        catch (error){
            console.log('Error fetching the files from server: ' , error);
            toast.error('Error fetching the files from server: ', error.message);
        }
    }

    //Toggle the public/private status of a file
    const TogglePublic = async (fileToUpdate) => {
        try{
            const token = await getToken();
            await axios.patch(apiEnpoints.TOGGLE_FILE(fileToUpdate.id), {}, {headers: {Authorization: `Bearer ${token}`}});
            console.log('data' , fileToUpdate)
            setFiles(files.map((file) => file.id === fileToUpdate.id ? {...file, isPublic: !file.isPublic}: file));
        }
        catch (error){
            console.error('Error toggling file status', error);
            toast,error('Error toggling file status: ' , error.message);
        }
    }

    //Handle file download
    const handleDownload = async (file) => {
        try{
            const token = await getToken();
            const response = await axios.get(apiEnpoints.DOWNLOAD_FILES(file.id), {headers: {Authorization: `Bearer ${token}`} , responseType:"blob"});
            
            //create a blob url and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download" , file.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); //clean up the object url
        }   
        catch(error){
            console.error('Error downloading file', error,message);
        }
    }

    //Close the delete confirmation modal
    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({
            isOpen: false,
            fileId: null
        })
    }

    //Opens the delete confirmation modal
    const openDeleteConfirmation = (fileId) => {
        setDeleteConfirmation({
            isOpen: true,
            fileId
        })
    }

    //opens the share link modal
    const openShareModal = (fileId) => {
        const link = `${window.location.origin}/file/${fileId}`
        setShareModal({
            isOpen: true,
            fileId,
            link
        });
    }

    //close the share link modal
    const closeShareModal = () => {
        setShareModal({
            isOpen: false,
            fileId: null,
            link: ""
        });
    }

    //Delete a file  after confirmation
    const handleDelete = async () => {
        const fileId = deleteConfirmation.fileId;
        if(!fileId) return;
        try{
            const token = await getToken();
            const response = await axios.delete(apiEnpoints.DELETE_FILE(fileId), {headers: {Authorization: `Bearer ${token}`}});
            if(response.status === 204){
                setFiles(files.filter((file) => file.id !== fileId));
                closeDeleteConfirmation();
            }
            else{
                toast.error('Error deleting file');
            }
        }
        catch(error){
            console.error('Error deleting file', error);
            toast.error('Error deleting file', error.message);
        }
    }

    useEffect(() => {
        fetchFile();
    }, [getToken]);

       const getFileIcon = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        
        if(['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)){
            return <Image size={24} className="text-red-500"/>
        }
        
        if(['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension)){
            return <Video size={24} className="text-blue-500"/>
        }

        if(['mp3', 'wav', 'ogg', 'flac', 'mp4a'].includes(extension)){
            return <Music size={24} className="text-green-500"/>
        }

        if(['pdf', 'doc', 'docx', 'txt', 'rtf', 'webp'].includes(extension)){
            return <FileText size={24} className="text-amber-500"/>
        }

        return <FilesIcon size={24} className="text-red-500"/>
    }

    return (
        <DashboardLayout activeMenu="My File">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">My Files {files.length}</h2>
                    <div className="flex items-center gap-3">
                        <List 
                            onClick={() => setViewMode("list")}
                            size={24}
                            className={`cursor-pointer transition-colors ${viewMode === 'list' ? 'text-red-600': 'text-gray-400 hover:text-gray-600'}`}/>
                    <Grid
                        size={24}
                        onClick={() => setViewMode("grid")}
                        className={`cursor-pointer transition-colors ${viewMode === 'grid' ? 'text-red-600': 'text-gray-400 hover:text-gray-600'}`}
                    />
                    </div>
                </div>
                {files.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
                        <File 
                            size={60}
                            className="text-red-300 mb-4"
                        />
                        <h3 className="text-xl font-medium text-gray-700 mb-2"> 
                            Nofiles uploaded yet
                        </h3>
                        <p className="text-gray-500 text-center max-w-md mb-6"> 
                            Start uploading files to see them listed here. you can upload 
                            document, images, and other files to share and manage them securly.
                        </p>
                        <button 
                            onClick={() => navigate('/upload')}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                            Go to Upload
                        </button>
                    </div>

                ): viewMode === 'grid' ? ( 
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {files.map((file) => (
                            <FileCard 
                                key={file.id}
                                file={file}
                                onDelete={openDeleteConfirmation}
                                onTogglePublic={TogglePublic}
                                onDownload={handleDownload}
                                onShareLink={openShareModal}
                            />
                        ))}
                    </div>
                ):  (
                    
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sharing</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200"> 
                                {files.map((files) => (
                                    <tr key={files.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                            <div className="flex items-center gap-2">
                                                {getFileIcon(files)}
                                                {files.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {(files.size / 1024).toFixed(1)} KB
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(files.uploadedAt).toLocaleDateString()} KB
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="flex items-center gap-4">
                                                <button 
                                                    onClick={() => TogglePublic(files)}
                                                    className="flex items-center gap-2 cursor-pointer group">
                                                    {files.isPublic ? (
                                                        <>
                                                            <Globe size={16} className="text-green-500 "/>
                                                            <span className="group-hover:underline">
                                                                Public
                                                            </span>
                                                        </>
                                                    ): (
                                                        <>
                                                            <Lock size={16} className="text-gray-500" />
                                                            <span className="group-hover:underline">
                                                                Private
                                                            </span>
                                                        </>
                                                    )}
                                                </button>
                                                {files.isPublic && (
                                                    <button 
                                                        onClick={() => openShareModal(files.id)}
                                                        className="flex items-center gap-2 cursor-pointer group text-blue-600">
                                                        <Copy size={16}/>
                                                        <span className="group-hover:underline">
                                                            Share Link
                                                        </span>
                                                    </button>
                                                )}
                                            </div>    
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => handleDownload(files)} 
                                                        title="Download"
                                                        className="text-gray-500 hover:text-blue-600">
                                                        <Download size={18} />
                                                    </button>
                                                </div>
                                                <div className="flex justify-center">
                                                    <button 
                                                        onClick={() => openDeleteConfirmation(files.id)}
                                                        title="Delete"
                                                        className="text-gray-500 hover:text-red-600">
                                                        <Trash2 size={18}/>
                                                    </button>
                                                </div>
                                                <div className="flex justify-center">
                                                    {files.isPublic ? (
                                                        <a href={`/file/${files.id}`} title="View File" target="_blank" rel="noreFerrer" className="text-gray-500 hover:text-blue-600">
                                                            <Eye size={18}/>
                                                        </a>
                                                    ): (
                                                        <span className="w-[18px]"></span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Delete confirmation dialog */}
                <ConfirmationDialog 
                    isOpen={deleteConfirmation.isOpen}
                    onClose={closeDeleteConfirmation}
                    title="Delete File"
                    message="Are you sure want to delete file? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleDelete}
                    confirmationButtonClass="bg-red-600 hover:bg-red-700"
                />

                {/* Share link modal */}
                <LinkShareModal 
                    isOpen={shareModal.isOpen}
                    onClose={closeShareModal}
                    link={shareModal.link}
                    title="Share File"
                />

            </div>
        </DashboardLayout>
    )
}

export default MyFile;