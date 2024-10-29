import React, { useCallback } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = ".csv",
}) => {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div className="mb-4">
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="file-input file-input-bordered file-input-success w-full max-w-xs"
      />
    </div>
  );
};
