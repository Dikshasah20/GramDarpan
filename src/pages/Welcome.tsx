import { MapPin, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AudioButton } from "@/components/AudioButton";
import { LocationPermissionDialog } from "@/components/LocationPermissionDialog";
import { DistrictConfirmDialog } from "@/components/DistrictConfirmDialog";
import { detectLocation, reverseGeocode, fallbackToIP, shouldAutoAccept } from "@/utils/geolocation";
import { toast } from "sonner";

const Welcome = () => {
  const navigate = useNavigate();
  const [detecting, setDetecting] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [nearbyDistricts, setNearbyDistricts] = useState<any[]>([]);
  const [detectionAccuracy, setDetectionAccuracy] = useState<number>();

  const handleAutoDetect = () => {
    setShowPermissionDialog(true);
  };

  const handlePermissionAllow = async () => {
    setShowPermissionDialog(false);
    setDetecting(true);

    try {
      // Step 1: Get high-accuracy location
      const location = await detectLocation();
      setDetectionAccuracy(location.accuracy);

      toast.success(`Location detected with ${Math.round(location.accuracy)}m accuracy`, {
        description: `Method: ${location.method}`,
      });

      // Step 2: Reverse geocode to find district
      const result = await reverseGeocode(location.latitude, location.longitude);

      // Log detection for debugging
      console.log('Detection result:', {
        timestamp: new Date().toISOString(),
        coords: { lat: location.latitude, lon: location.longitude, accuracy: location.accuracy },
        method: location.method,
        result: {
          district_id: result.district_id,
          district_name: result.district_name,
          containment: result.containment,
          distance_m: result.distance_m,
        },
      });

      // Step 3: Decide whether to auto-accept or show confirmation
      if (shouldAutoAccept(result, location.accuracy)) {
        // High confidence - navigate directly
        toast.success(`जिला मिल गया: ${result.district_name}`, {
          description: 'District detected successfully',
        });
        setTimeout(() => {
          setDetecting(false);
          navigate(`/dashboard/${result.district_id}`);
        }, 1000);
      } else {
        // Low confidence - show nearby districts for confirmation
        setNearbyDistricts(result.candidates);
        setDetecting(false);
        setShowConfirmDialog(true);
      }
    } catch (error: any) {
      console.error('Geolocation failed:', error);
      setDetecting(false);

      // Fallback to IP-based detection
      if (error.code === 1) {
        // Permission denied
        toast.error('Location permission denied', {
          description: 'Please choose your district manually',
        });
        navigate("/select");
      } else {
        // Timeout or other error - try IP fallback
        toast.info('Trying alternative method...', {
          description: 'GPS unavailable, using IP location',
        });
        
        try {
          const ipResult = await fallbackToIP();
          setNearbyDistricts(ipResult.candidates);
          setShowConfirmDialog(true);
        } catch {
          toast.error('Could not detect location', {
            description: 'Please choose manually',
          });
          navigate("/select");
        }
      }
    }
  };

  const handleConfirmDistrict = (districtId: number) => {
    setShowConfirmDialog(false);
    navigate(`/dashboard/${districtId}`);
  };

  const handleManualSelection = () => {
    setShowPermissionDialog(false);
    setShowConfirmDialog(false);
    navigate("/select");
  };

  return (
    <>
      {/* Permission Dialog */}
      {showPermissionDialog && (
        <LocationPermissionDialog
          onAllow={handlePermissionAllow}
          onManual={handleManualSelection}
        />
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <DistrictConfirmDialog
          nearbyDistricts={nearbyDistricts}
          accuracy={detectionAccuracy}
          onConfirm={handleConfirmDistrict}
          onManual={handleManualSelection}
        />
      )}

      <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Logo/Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary mb-6 shadow-card">
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
        <div className="bg-card rounded-2xl p-8 shadow-card-hover border border-border/50 space-y-4">
          <p className="text-xl text-card-foreground leading-relaxed font-semibold">
            अपने जिले का प्रदर्शन देखें<br />
            <span className="text-lg font-normal text-muted-foreground">
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
            className="w-full h-16 text-xl font-semibold rounded-2xl shadow-card hover:shadow-card-hover transition-all gradient-primary"
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
          <div className="tricolor-accent py-4">
            <p className="font-medium">सरकारी जानकारी • आसान भाषा में</p>
            <p className="text-xs mt-1">Government information in simple language</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Welcome;
