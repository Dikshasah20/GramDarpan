import { MapPin, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AudioButton } from "@/components/AudioButton";

const Welcome = () => {
  const navigate = useNavigate();
  const [detecting, setDetecting] = useState(false);

  const handleAutoDetect = () => {
    setDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In production, this would call reverse geocoding API
          console.log("Location:", position.coords);
          // For demo, navigate to first district
          setTimeout(() => {
            setDetecting(false);
            navigate("/dashboard/1");
          }, 1500);
        },
        (error) => {
          console.error("Location error:", error);
          setDetecting(false);
          navigate("/select");
        }
      );
    } else {
      setDetecting(false);
      navigate("/select");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Logo/Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
            <MapPin className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground">
            मनरेगा की जानकारी
          </h1>
          <p className="text-2xl text-muted-foreground">
            MGNREGA Information
          </p>
          <div className="flex justify-center">
            <AudioButton 
              text="मनरेगा की जानकारी। अपने जिले का प्रदर्शन देखें। काम, पैसे, और रोजगार की पूरी जानकारी।"
              className="mt-2"
            />
          </div>
        </div>

        {/* Description */}
        <div className="bg-card rounded-2xl p-8 shadow-lg space-y-4">
          <p className="text-xl text-card-foreground leading-relaxed">
            अपने जिले का प्रदर्शन देखें<br />
            <span className="text-lg text-muted-foreground">
              View your district's performance
            </span>
          </p>
          <p className="text-lg text-muted-foreground">
            काम • पैसे • रोजगार<br />
            Work • Payments • Employment
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleAutoDetect}
            disabled={detecting}
            size="lg"
            className="w-full h-16 text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <MapPin className="mr-3 h-6 w-6" />
            {detecting ? "खोज रहे हैं..." : "अपना जिला खोजें"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Auto-detect district
          </p>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">या / or</span>
            </div>
          </div>

          <Button
            onClick={() => navigate("/select")}
            variant="outline"
            size="lg"
            className="w-full h-16 text-xl font-semibold rounded-2xl"
          >
            <List className="mr-3 h-6 w-6" />
            जिला चुनें
          </Button>
          <p className="text-sm text-muted-foreground">
            Select from list
          </p>
        </div>

        {/* Footer */}
        <div className="pt-8 text-sm text-muted-foreground">
          <p>सरकारी जानकारी • आसान भाषा में</p>
          <p className="text-xs mt-1">Government information in simple language</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
