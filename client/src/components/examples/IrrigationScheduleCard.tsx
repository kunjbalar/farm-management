import IrrigationScheduleCard from '../IrrigationScheduleCard';

export default function IrrigationScheduleCardExample() {
  return (
    <IrrigationScheduleCard
      schedules={[
        { field: 'Corn Field (North)', time: 'Today, 2:00 PM', duration: '40 minutes', waterUsage: '1,200 gallons' },
        { field: 'Wheat Field (East)', time: 'Tomorrow, 8:00 AM', duration: '60 minutes', waterUsage: '4,500 gallons' },
        { field: 'Tomato Greenhouse', time: 'Daily, 9:00 AM', duration: '15 minutes', waterUsage: '300 gallons' }
      ]}
      onScheduleNew={() => console.log('Schedule new irrigation clicked')}
    />
  );
}
