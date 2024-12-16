import { useState } from "react";
import { toast } from "sonner";
import { VoiceRecordButton } from "./VoiceRecordButton";
import { supabase } from "../../../integrations/supabase/client";
import { processPropertyAudio } from "@/utils/propertyProcessing";

interface VoiceUploadProps {
  onDataExtracted: (data: any) => void;
}

export const VoiceUpload: React.FC<VoiceUploadProps> = ({ onDataExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        setIsProcessing(true);
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) throw new Error('No active session');

          const data = await processPropertyAudio(formData, session);
          onDataExtracted(data);
          toast.success("Successfully transcribed and extracted property information");
        } catch (error) {
          console.error('Error processing audio:', error);
          toast.error(error instanceof Error ? error.message : "Failed to process audio");
        } finally {
          setIsProcessing(false);
        }
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <VoiceRecordButton 
      isProcessing={isProcessing}
      isRecording={isRecording}
      onToggleRecording={isRecording ? stopRecording : startRecording}
    />
  );
};

