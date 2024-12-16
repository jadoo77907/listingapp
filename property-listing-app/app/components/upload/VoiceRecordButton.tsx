import { Button } from "@/components/ui/button";
import { Mic, Square } from 'lucide-react';

interface VoiceRecordButtonProps {
  isProcessing: boolean;
  isRecording: boolean;
  onToggleRecording: () => void;
}

export const VoiceRecordButton = ({ isProcessing, isRecording, onToggleRecording }: VoiceRecordButtonProps) => {
  return (
    <Button
      variant={isRecording ? "destructive" : "outline"}
      className="w-full sm:w-auto"
      onClick={onToggleRecording}
      disabled={isProcessing}
    >
      {isRecording ? (
        <>
          <Square className="w-4 h-4 mr-2" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 mr-2" />
          Record Voice
        </>
      )}
    </Button>
  );
};

