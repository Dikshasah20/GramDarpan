export interface District {
  id: number;
  state: string;
  district_name: string;
  district_code: string;
}

export interface MonthlyData {
  year: number;
  month: number;
  workers: number;
  jobcards: number;
  wages_paid: number;
  avg_days_per_household: number;
  payment_delay_days: number;
}

export interface DistrictSnapshot {
  district: District;
  current: MonthlyData;
  last_12_months: MonthlyData[];
  state_average: MonthlyData;
  last_updated: string;
}

export interface Comparison {
  metric: string;
  district_value: number;
  state_average: number;
  percentile: number;
}
