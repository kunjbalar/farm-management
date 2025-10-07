import SoilHealthWidget from '../SoilHealthWidget';

export default function SoilHealthWidgetExample() {
  return (
    <SoilHealthWidget
      metrics={[
        { name: 'Moisture', value: 62, label: '62%' },
        { name: 'pH Level', value: 65, label: '6.5' },
        { name: 'Nitrogen', value: 38, label: '38%' },
        { name: 'Phosphorus', value: 30, label: '30%' },
        { name: 'Potassium', value: 60, label: '60%' }
      ]}
      lastUpdate="LIVE DATA: Soil sensors updating every 5 minutes"
    />
  );
}
