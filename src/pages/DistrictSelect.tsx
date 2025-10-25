import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockDistricts } from "@/data/mockData";

const DistrictSelect = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredDistricts = mockDistricts.filter(
    (d) =>
      d.district_name.toLowerCase().includes(search.toLowerCase()) ||
      d.state.toLowerCase().includes(search.toLowerCase())
  );

  // Group by state
  const groupedDistricts = filteredDistricts.reduce((acc, district) => {
    if (!acc[district.state]) {
      acc[district.state] = [];
    }
    acc[district.state].push(district);
    return acc;
  }, {} as Record<string, typeof mockDistricts>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-primary-foreground hover:bg-primary-foreground/20 mb-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold mb-2">जिला चुनें</h1>
          <p className="text-primary-foreground/80">Select District</p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="जिला या राज्य खोजें / Search district or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 text-lg rounded-2xl"
          />
        </div>

        {/* Districts List */}
        <div className="space-y-6">
          {Object.entries(groupedDistricts).map(([state, districts]) => (
            <div key={state}>
              <h2 className="text-xl font-semibold text-foreground mb-3 px-2">
                {state}
              </h2>
              <div className="space-y-2">
                {districts.map((district) => (
                  <Card
                    key={district.id}
                    className="p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(`/dashboard/${district.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {district.district_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {district.state}
                        </p>
                      </div>
                      <ChevronRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {filteredDistricts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                कोई जिला नहीं मिला
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                No districts found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistrictSelect;
