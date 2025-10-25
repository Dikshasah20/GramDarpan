import { Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface AudioButtonProps {
  text: string;
  className?: string;
}

export const AudioButton = ({ text, className }: AudioButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    // In production, this would call a TTS API or play pre-recorded audio
    // For now, we'll use the browser's speech synthesis
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handlePlay}
      className={`h-12 w-12 rounded-full ${isPlaying ? 'animate-pulse bg-primary/20' : ''} ${className}`}
      aria-label="सुनें (Play audio)"
    >
      <Volume2 className="h-6 w-6 text-primary" />
    </Button>
  );
};
