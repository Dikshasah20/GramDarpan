import { District, DistrictSnapshot, MonthlyData } from "@/types/district";

export const mockDistricts: District[] = [
  { id: 1, state: "Uttar Pradesh", district_name: "लखनऊ (Lucknow)", district_code: "UP_LKO" },
  { id: 2, state: "Uttar Pradesh", district_name: "वाराणसी (Varanasi)", district_code: "UP_VNS" },
  { id: 3, state: "Uttar Pradesh", district_name: "कानपुर (Kanpur)", district_code: "UP_KNP" },
  { id: 4, state: "Bihar", district_name: "पटना (Patna)", district_code: "BR_PTN" },
  { id: 5, state: "Bihar", district_name: "गया (Gaya)", district_code: "BR_GYA" },
  { id: 6, state: "Madhya Pradesh", district_name: "भोपाल (Bhopal)", district_code: "MP_BPL" },
  { id: 7, state: "Rajasthan", district_name: "जयपुर (Jaipur)", district_code: "RJ_JPR" },
  { id: 8, state: "Rajasthan", district_name: "उदयपुर (Udaipur)", district_code: "RJ_UDP" },
];

const generateMonthlyData = (baseWorkers: number, variance: number): MonthlyData[] => {
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const randomFactor = 1 + (Math.random() - 0.5) * variance;
    months.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      workers: Math.floor(baseWorkers * randomFactor),
      jobcards: Math.floor(baseWorkers * 0.8 * randomFactor),
      wages_paid: Math.floor(baseWorkers * 15000 * randomFactor),
      avg_days_per_household: Math.floor(45 + Math.random() * 30),
      payment_delay_days: Math.floor(5 + Math.random() * 15),
    });
  }
  return months;
};

export const getMockSnapshot = (districtId: number): DistrictSnapshot => {
  const district = mockDistricts.find(d => d.id === districtId) || mockDistricts[0];
  const baseWorkers = 50000 + Math.random() * 100000;
  const monthlyData = generateMonthlyData(baseWorkers, 0.3);
  const current = monthlyData[monthlyData.length - 1];
  
  return {
    district,
    current,
    last_12_months: monthlyData,
    state_average: {
      year: current.year,
      month: current.month,
      workers: Math.floor(baseWorkers * 0.9),
      jobcards: Math.floor(baseWorkers * 0.72),
      wages_paid: Math.floor(baseWorkers * 13500),
      avg_days_per_household: 52,
      payment_delay_days: 12,
    },
    last_updated: new Date().toISOString(),
  };
};
