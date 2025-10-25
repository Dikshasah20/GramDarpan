import { mockDistricts } from "@/data/mockData";

export interface GeolocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  method: 'GPS' | 'WiFi' | 'IP';
}

export interface ReverseGeocodeResult {
  district_id: number | null;
  district_name?: string;
  state?: string;
  containment: boolean;
  distance_m: number;
  candidates: Array<{
    id: number;
    district_name: string;
    state: string;
    district_code: string;
    distance_m: number;
  }>;
}

// High-accuracy geolocation with proper options
export const detectLocation = (): Promise<GeolocationResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true, // Use GPS/GNSS for better accuracy
      timeout: 15000, // 15 seconds timeout
      maximumAge: 0, // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const method = position.coords.accuracy <= 50 ? 'GPS' : 'WiFi';
        
        // Log for debugging
        console.log('Geolocation detected:', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          method,
          timestamp: new Date(position.timestamp).toISOString(),
        });

        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          method,
        });
      },
      (error) => {
        console.error('Geolocation error:', {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString(),
        });
        reject(error);
      },
      options
    );
  });
};

// Simulate reverse geocoding (in production, this would call backend API)
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> => {
  // In production, this would be:
  // const response = await fetch(`/api/v1/geo?lat=${latitude}&lon=${longitude}`);
  // return response.json();

  // Mock implementation: calculate distances to all districts
  // In real implementation, backend uses PostGIS ST_Contains for precise polygon matching
  
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  // Mock district centroids (in production, these come from PostGIS)
  const districtCentroids: Record<number, [number, number]> = {
    1: [26.8467, 80.9462], // Lucknow
    2: [25.3176, 82.9739], // Varanasi
    3: [26.4499, 80.3319], // Kanpur
    4: [25.5941, 85.1376], // Patna
    5: [24.7955, 84.9994], // Gaya
    6: [23.2599, 77.4126], // Bhopal
    7: [26.9124, 75.7873], // Jaipur
    8: [24.5854, 73.7125], // Udaipur
  };

  const candidates = mockDistricts
    .map(district => {
      const [distLat, distLon] = districtCentroids[district.id] || [26, 80];
      const distance = calculateDistance(latitude, longitude, distLat, distLon);
      return {
        ...district,
        distance_m: distance,
      };
    })
    .sort((a, b) => a.distance_m - b.distance_m);

  const nearest = candidates[0];
  
  // Heuristic: if within 2km, consider it a match
  const containment = nearest.distance_m <= 2000;

  return {
    district_id: containment ? nearest.id : null,
    district_name: nearest.district_name,
    state: nearest.state,
    containment,
    distance_m: nearest.distance_m,
    candidates: candidates.slice(0, 5),
  };
};

// Fallback to IP-based geolocation
export const fallbackToIP = async (): Promise<ReverseGeocodeResult> => {
  // In production, use self-hosted MaxMind GeoLite2
  // For demo, return a default district
  console.log('Falling back to IP-based geolocation');
  
  // Mock: return Lucknow as default
  return {
    district_id: 1,
    district_name: mockDistricts[0].district_name,
    state: mockDistricts[0].state,
    containment: false,
    distance_m: 0,
    candidates: mockDistricts.slice(0, 3).map(d => ({
      ...d,
      distance_m: Math.random() * 10000,
    })),
  };
};

// Determine if we should auto-accept or show confirmation
export const shouldAutoAccept = (
  result: ReverseGeocodeResult,
  accuracy?: number
): boolean => {
  // Auto-accept criteria:
  // 1. Polygon containment is true
  // 2. Distance <= 2000m AND accuracy <= 50m
  
  if (result.containment) return true;
  
  if (accuracy && accuracy <= 50 && result.distance_m <= 2000) {
    return true;
  }
  
  return false;
};
