import { UrlUpload } from "./upload/UrlUpload";
import { FileUpload } from "./upload/FileUpload";
import { VoiceUpload } from "./upload/VoiceUpload";

interface AIPropertyUploadProps {
  onDataExtracted: (data: {
    title?: string;
    description?: string;
    price?: number;
    bedrooms?: number;
    bathrooms?: number;
    floor_size_sqm?: number;
    images?: string[];
  }) => void;
}

export const AIPropertyUpload = ({ onDataExtracted }: AIPropertyUploadProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <UrlUpload onDataExtracted={onDataExtracted} />
        
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <FileUpload onDataExtracted={onDataExtracted} />
          <VoiceUpload onDataExtracted={onDataExtracted} />
        </div>
      </div>
    </div>
  );
};

