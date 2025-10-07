import AnalyticsChartCard from '../AnalyticsChartCard';

const sampleData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 }
];

export default function AnalyticsChartCardExample() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <AnalyticsChartCard
        title="Sales Performance"
        description="Monthly sales data and trends"
        chartType="line"
        data={sampleData}
      />
      <AnalyticsChartCard
        title="Profit Analysis"
        description="Revenue, expenses and profit breakdown"
        chartType="bar"
        data={sampleData}
      />
    </div>
  );
}
