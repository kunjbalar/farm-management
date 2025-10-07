import AlertsWidget from '../AlertsWidget';

export default function AlertsWidgetExample() {
  return (
    <AlertsWidget
      alerts={[
        { type: 'warning', message: 'Low water level in irrigation tank' },
        { type: 'warning', message: 'Pesticide stock running low' },
        { type: 'critical', message: 'Pest detection in Sector B' },
        { type: 'info', message: 'Scheduled maintenance for Tractor X5000' }
      ]}
      onViewAllAlerts={() => console.log('View all alerts clicked')}
    />
  );
}
