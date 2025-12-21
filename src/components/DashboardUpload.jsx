import { Upload, X, Loader2 } from "lucide-react";

const DashboardUpload = ({
  files = [],
  onFileChange,
  onUpload,
  uploading,
  onRemoveFile,
  remainingUploads = 0,
  maxFiles = 5,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Files</h3>
      <p className="text-sm text-gray-500 mb-4">
        You can upload up to <span className="font-semibold">{maxFiles}</span> files at once.
        {" "}Remaining: <span className="font-semibold">{remainingUploads}</span>
      </p>

      <label className="block">
        <input
          type="file"
          multiple
          onChange={onFileChange}
          className="hidden"
          disabled={uploading || remainingUploads <= 0}
        />
        <div
          className={`cursor-pointer rounded-lg border border-dashed p-6 text-center transition
            ${uploading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"}
            ${remainingUploads <= 0 ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <div className="flex justify-center mb-2">
            <Upload className="text-red-500" />
          </div>
          <p className="text-sm text-gray-700 font-medium">
            Click to select files
          </p>
          <p className="text-xs text-gray-500 mt-1">
            (or drag & drop — optional)
          </p>
        </div>
      </label>

      {/* Selected files */}
      {files.length > 0 && (
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Selected</h4>
          <div className="space-y-2">
            {files.map((f, idx) => (
              <div
                key={`${f.name}-${idx}`}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {f.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(f.size / 1024).toFixed(2)} KB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveFile(idx)}
                  disabled={uploading}
                  className="ml-3 inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <X size={16} />
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onUpload}
            disabled={uploading || files.length === 0}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardUpload;