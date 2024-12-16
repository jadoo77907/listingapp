import { useState } from "react";
import { toast } from "sonner";
import { UrlInput } from "./UrlInput";
import { getSupabase } from "../../../lib/supabaseClient";

interface UrlUploadProps {
  onDataExtracted: (data: any) => void;
}

export const UrlUpload: React.FC<UrlUploadProps> = ({ onDataExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [url, setUrl] = useState("");

  const handleUrlProcess = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setIsProcessing(true);
    try {
      console.log('Processing URL:', url.trim());
    
      const supabase = getSupabase();
      const { data, error } = await supabase.functions.invoke('process-property-url', {
        body: { url: url.trim() }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to process URL');
      }

      if (!data) {
        console.error('No data received from Edge Function');
        throw new Error('No data received from server');
      }

      if (typeof data !== 'object' || Object.keys(data).length === 0) {
        console.error('Invalid data received from Edge Function:', data);
        throw new Error('Invalid response from server');
      }

      console.log('Extracted property data:', data);
      onDataExtracted(data);
      toast.success("Successfully extracted property information from URL");
      setUrl(""); // Clear URL after successful processing
    } catch (error) {
      console.error('Error processing URL:', error);
      toast.error(error instanceof Error ? error.message : "Failed to process URL");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <UrlInput
      url={url}
      onUrlChange={setUrl}
      onProcess={handleUrlProcess}
      isProcessing={isProcessing}
    />
  );
};

