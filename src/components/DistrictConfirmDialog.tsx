import { MapPin, CheckCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { District } from "@/types/district";
import { AudioButton } from "./AudioButton";

interface NearbyDistrict extends District {
  distance_m: number;
}

interface DistrictConfirmDialogProps {
  nearbyDistricts: NearbyDistrict[];
  accuracy?: number;
  onConfirm: (districtId: number) => void;
  onManual: () => void;
}

export const DistrictConfirmDialog = ({
  nearbyDistricts,
  accuracy,
  onConfirm,
  onManual,
}: DistrictConfirmDialogProps) => {
  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const topDistrict = nearbyDistricts[0];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center">
            <MapPin className="h-10 w-10 text-warning" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            क्या यह आपका जिला है?
          </h2>
          <p className="text-lg text-muted-foreground">
            Is this your District?
          </p>
        </div>

        {/* Explanation */}
        <div className="space-y-4 bg-muted/50 p-6 rounded-xl">
          <div className="flex items-start gap-3">
            <AudioButton 
              text={`हमें आपका नतीजा मिल गया, लेकिन पूर्ण निश्चित नहीं है। कृपया अपना जिला चुनें। ${topDistrict.district_name}, दूरी ${formatDistance(topDistrict.distance_m)}`}
              className="mt-1"
            />
            <div>
              <p className="text-lg text-foreground">
                हमें आपका नतीजा मिल गया, लेकिन पूर्ण निश्चित नहीं है। कृपया अपना जिला चुनें:
              </p>
              <p className="text-base text-muted-foreground mt-2">
                We found your location but need confirmation. Please select your District:
              </p>
            </div>
          </div>
        </div>

        {/* Accuracy Info */}
        {accuracy && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Location accuracy: ±{Math.round(accuracy)}m</p>
          </div>
        )}

        {/* District Options */}
        <div className="space-y-3">
          {nearbyDistricts.slice(0, 3).map((district, index) => (
            <Card
              key={district.id}
              className={`p-4 cursor-pointer hover:shadow-md transition-all ${
                index === 0 ? 'border-2 border-primary' : ''
              }`}
              onClick={() => onConfirm(district.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {index === 0 && (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {district.district_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {district.state} • {formatDistance(district.distance_m)} away
                    </p>
                  </div>
                </div>
                {index === 0 && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    सबसे नज़दीक / Nearest
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Manual Selection */}
        <Button
          onClick={onManual}
          variant="outline"
          size="lg"
          className="w-full h-12 rounded-xl"
        >
          <X className="mr-2 h-5 w-5" />
          इनमें से कोई नहीं / None of these
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          अलग जिला चुनने के लिए ऊपर click करें
        </p>
      </Card>
    </div>
  );
};
