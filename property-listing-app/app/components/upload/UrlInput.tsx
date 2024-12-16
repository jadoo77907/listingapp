import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';

interface UrlInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

export const UrlInput = ({ url, onUrlChange, onProcess, isProcessing }: UrlInputProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-grow">
        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="url"
          placeholder="Enter property URL"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="pl-10"
          disabled={isProcessing}
        />
      </div>
      <Button onClick={onProcess} disabled={isProcessing || !url.trim()}>
        Process URL
      </Button>
    </div>
  );
};

