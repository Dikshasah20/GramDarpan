import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, CreditCard, IndianRupee, Calendar, Clock, TrendingUp, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import { getMockSnapshot } from "@/data/mockData";
import { AudioButton } from "@/components/AudioButton";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();
  
  const snapshot = getMockSnapshot(Number(districtId) || 1);
  const { district, current, last_12_months, state_average } = snapshot;

  const formatNumber = (num: number) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return `₹${formatNumber(num)}`;
  };

  const chartData = last_12_months.map((d) => ({
    month: `${d.month}/${d.year.toString().slice(2)}`,
    workers: d.workers,
    jobcards: d.jobcards,
  }));

  const getComparisonText = (districtVal: number, stateVal: number) => {
    const diff = ((districtVal - stateVal) / stateVal * 100).toFixed(1);
    if (parseFloat(diff) > 0) return `राज्य से ${diff}% अधिक`;
    return `राज्य से ${Math.abs(parseFloat(diff))}% कम`;
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/select")}
            className="text-primary-foreground hover:bg-primary-foreground/20 mb-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{district.district_name}</h1>
              <p className="text-primary-foreground/80 text-lg">{district.state}</p>
            </div>
            <AudioButton 
              text={`${district.district_name} जिले की मनरेगा की जानकारी`}
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Quick Actions */}
        <div className="flex gap-4 flex-wrap">
          <Button variant="outline" size="lg" className="rounded-xl">
            <Download className="mr-2 h-5 w-5" />
            PDF डाउनलोड करें
          </Button>
          <Button variant="outline" size="lg" className="rounded-xl">
            <Share2 className="mr-2 h-5 w-5" />
            WhatsApp पर शेयर करें
          </Button>
        </div>

        {/* Current Month Metrics */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
            इस महीने का प्रदर्शन
            <span className="text-lg font-normal text-muted-foreground">Current Month</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              icon={Users}
              title="कुल मजदूर"
              subtitle="Total Workers"
              value={formatNumber(current.workers)}
              audioText={`कुल मजदूर: ${current.workers}`}
              trend="up"
            />
            
            <MetricCard
              icon={CreditCard}
              title="सक्रिय जॉब कार्ड"
              subtitle="Active Job Cards"
              value={formatNumber(current.jobcards)}
              audioText={`सक्रिय जॉब कार्ड: ${current.jobcards}`}
              trend="up"
            />
            
            <MetricCard
              icon={IndianRupee}
              title="वेतन भुगतान"
              subtitle="Wages Paid"
              value={formatCurrency(current.wages_paid)}
              audioText={`वेतन भुगतान: ${current.wages_paid} रुपये`}
              trend="stable"
            />
            
            <MetricCard
              icon={Calendar}
              title="औसत दिन प्रति घर"
              subtitle="Avg Days per Household"
              value={current.avg_days_per_household}
              audioText={`औसत दिन प्रति घर: ${current.avg_days_per_household}`}
              trend={current.avg_days_per_household > 50 ? "up" : "stable"}
            />
            
            <MetricCard
              icon={Clock}
              title="भुगतान में देरी"
              subtitle="Payment Delay"
              value={`${current.payment_delay_days} दिन`}
              audioText={`भुगतान में देरी: ${current.payment_delay_days} दिन`}
              trend={current.payment_delay_days < 10 ? "up" : "down"}
            />

            <MetricCard
              icon={TrendingUp}
              title="राज्य से तुलना"
              subtitle="Comparison with State"
              value={getComparisonText(current.workers, state_average.workers)}
              audioText={`आपका जिला राज्य के औसत से ${getComparisonText(current.workers, state_average.workers)}`}
              trend="stable"
            />
          </div>
        </div>

        {/* Trends Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                पिछले 12 महीने
                <span className="text-lg font-normal text-muted-foreground">Last 12 Months</span>
              </h2>
            </div>
            <AudioButton 
              text="पिछले 12 महीनों का रुझान। मजदूरों और जॉब कार्ड की संख्या देखें।"
            />
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '14px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '14px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="workers" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                name="मजदूर / Workers"
              />
              <Line 
                type="monotone" 
                dataKey="jobcards" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={3}
                name="जॉब कार्ड / Job Cards"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Help Section */}
        <Card className="p-6 bg-muted/50">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            मदद और अधिकार
          </h2>
          <p className="text-lg text-muted-foreground mb-4">Help & Rights</p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📞</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">हेल्पलाइन / Helpline</h3>
                <p className="text-muted-foreground">1800-XXX-XXXX (टोल-फ्री)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">शिकायत दर्ज करें / File Complaint</h3>
                <p className="text-muted-foreground">अपनी समस्या दर्ज करें</p>
                <Button variant="link" className="p-0 h-auto text-primary">
                  शिकायत फॉर्म खोलें
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📄</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">अपना प्रमाणपत्र / Your Certificate</h3>
                <p className="text-muted-foreground">काम का प्रमाण डाउनलोड करें</p>
                <Button variant="link" className="p-0 h-auto text-primary">
                  डाउनलोड करें
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Last Updated */}
        <div className="text-center text-sm text-muted-foreground">
          <p>आखिरी अपडेट / Last Updated: {new Date(snapshot.last_updated).toLocaleDateString('hi-IN')}</p>
          <p className="mt-2">Offline mode • डेटा सुरक्षित है</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
