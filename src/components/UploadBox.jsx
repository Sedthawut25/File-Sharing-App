import { UploadCloud, X, File as FileIcon } from "lucide-react";

const UploadBox = ({
    files = [],
    onFileChange,
    onUpload,
    uploading = false,
    onRemoveFile,
    remainingCredits = 0,
    isUploadDisabled = false,
}) => {
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Upload Files</h2>
                    <p className="text-sm text-gray-500">
                        Remaining credits:{" "}
                        <span className="font-medium text-gray-900">{remainingCredits}</span>
                    </p>
                </div>

                {/* Upload button */}
                <button
                    onClick={onUpload}
                    disabled={isUploadDisabled || uploading}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition

                        ${isUploadDisabled || uploading
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                >

                    <UploadCloud size={18} />
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </div>

            {/* File picker */}
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                <input
                    type="file"
                    multiple
                    onChange={onFileChange}
                    className="hidden"
                    id="fileInput"
                    disabled={uploading}
                />

                <label
                    htmlFor="fileInput"
                    className={`cursor-pointer inline-flex flex-col items-center gap-2 ${uploading ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                >
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                        <UploadCloud className="text-red-600" />
                    </div>
                    <div className="text-sm text-gray-700">
                        <span className="font-medium text-red-600">Click to choose files</span>{" "}
                        or drag & drop
                    </div>
                    <div className="text-xs text-gray-500">You can select multiple files</div>
                </label>
            </div>


            {/* Selected files list */}
            <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                        Selected files ({files.length})
                    </h3>
                </div>

                {files.length === 0 ? (
                    <div className="text-sm text-gray-500">No files selected yet.</div>
                ) : (
                    <div className="space-y-2">
                        {files.map((f, idx) => (
                            <div
                                key={`${f.name}-${f.size}-${idx}`} // ✅ key ไม่ซ้ำ
                                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center">
                                        <FileIcon size={18} className="text-gray-600" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {f.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(f.size)} • {f.type || "unknown type"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onRemoveFile?.(idx)} // ✅ ลบไฟล์ตาม index
                                    disabled={uploading}
                                    className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Remove"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadBox;