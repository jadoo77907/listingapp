import { useState } from "react";
import { toast } from "sonner";
import { FileUploadButton } from "./FileUploadButton";
import { supabase } from "../../../integrations/supabase/client";
// import { processPropertyDocument } from "@/utils/propertyProcessing";

interface FileUploadProps {
  onDataExtracted: (data: any) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      console.log('Uploading file:', file.name);

      const response = await fetch('/api/process-property-document', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', response.status, errorText);
        throw new Error(`Failed to process file: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Processed file data:', data);

      if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        throw new Error('Invalid or empty response from server');
      }

      onDataExtracted(data);
      toast.success("Successfully extracted property information from file");
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error(error instanceof Error ? error.message : "Failed to process file");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <FileUploadButton 
      isProcessing={isProcessing} 
      onFileChange={handleFileUpload}
    />
  );
};

