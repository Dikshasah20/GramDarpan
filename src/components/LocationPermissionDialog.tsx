import { MapPin, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { AudioButton } from "./AudioButton";

interface LocationPermissionDialogProps {
  onAllow: () => void;
  onManual: () => void;
}

export const LocationPermissionDialog = ({ onAllow, onManual }: LocationPermissionDialogProps) => {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Navigation className="h-10 w-10 text-primary" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Location की अनुमति चाहिए
          </h2>
          <p className="text-lg text-muted-foreground">
            Permission Required
          </p>
        </div>

        {/* Explanation - Hindi */}
        <div className="space-y-4 bg-muted/50 p-6 rounded-xl">
          <div className="flex items-start gap-3">
            <AudioButton 
              text="अपना जिला ऑटो-डिटेक्ट करने के लिए लोकेशन की जरूरत है। कृपया अलाउ करें। सिर्फ आपके डिवाइस का करंट लोकेशन ही इस्तेमाल होगा। अगर आप मना करते हैं, तो आप मैन्युअली भी डिस्ट्रिक्ट चुन सकते हैं।"
              className="mt-1"
            />
            <div>
              <p className="text-lg text-foreground leading-relaxed">
                अपना जिला auto-detect करने के लिए location की ज़रूरत है। कृपया <strong>"Allow"</strong> करें — सिर्फ़ आपके device का current location ही इस्तेमाल होगा।
              </p>
              <p className="text-base text-muted-foreground mt-3">
                अगर आप मना करते हैं, तो आप manually भी district चुन सकते हैं।
              </p>
            </div>
          </div>
        </div>

        {/* Explanation - English */}
        <div className="text-center text-muted-foreground">
          <p className="text-base">
            We need your device location to detect your District accurately. Please tap "Allow". You can always choose your District manually if you prefer.
          </p>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>आपकी जानकारी सुरक्षित है • Your data is safe</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={onAllow}
            size="lg"
            className="w-full h-14 text-xl font-semibold rounded-xl"
          >
            <Navigation className="mr-3 h-6 w-6" />
            Location Allow करें
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Allow Location Permission
          </p>

          <Button
            onClick={onManual}
            variant="outline"
            size="lg"
            className="w-full h-14 text-xl font-semibold rounded-xl"
          >
            खुद चुनें / Choose Manually
          </Button>
        </div>
      </Card>
    </div>
  );
};
