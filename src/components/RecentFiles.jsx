const RecentFiles = ({ files }) => {
  if (!files || files.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-gray-500">
        No recent files
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Files</h3>
      <ul className="space-y-3">
        {files.map(file => (
          <li key={file.id} className="flex justify-between text-sm">
            <span className="truncate">{file.name}</span>
            <span className="text-gray-400">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentFiles;