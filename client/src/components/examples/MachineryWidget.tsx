import MachineryWidget from '../MachineryWidget';

export default function MachineryWidgetExample() {
  return (
    <MachineryWidget
      equipment={[
        { name: 'Massey Ferguson 7726', status: 'Active', fuelLevel: 92, lastMaintenance: 'Maint: 1 Month ago' },
        { name: 'Kubota M7-172', status: 'Maintenance', fuelLevel: 45, lastMaintenance: 'Maint: 2 days ago' },
        { name: 'Drip Irrigation System', status: 'Active', fuelLevel: 100, lastMaintenance: 'Maint: 15 days ago' },
        { name: 'Automated Seeder', status: 'Inactive', fuelLevel: 0, lastMaintenance: 'Maint: 3 Months ago' }
      ]}
    />
  );
}
