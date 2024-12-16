import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

interface FileUploadButtonProps {
  isProcessing: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadButton = ({ isProcessing, onFileChange }: FileUploadButtonProps) => {
  return (
    <Button
      variant="outline"
      className="w-full sm:w-auto"
      disabled={isProcessing}
    >
      <label className="flex items-center cursor-pointer">
        <Upload className="w-4 h-4 mr-2" />
        Upload Document
        <input
          type="file"
          className="hidden"
          onChange={onFileChange}
          accept=".pdf,.doc,.docx,.txt"
          disabled={isProcessing}
        />
      </label>
    </Button>
  );
};

