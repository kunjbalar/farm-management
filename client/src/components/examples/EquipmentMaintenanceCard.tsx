import EquipmentMaintenanceCard from '../EquipmentMaintenanceCard';

export default function EquipmentMaintenanceCardExample() {
  return (
    <EquipmentMaintenanceCard
      equipment={[
        { name: 'Massey Ferguson 7726', status: 'Active', maintenance: 'Maint: 7 days ✓' },
        { name: 'Kubota M7-172', status: 'Maintenance', maintenance: 'Maint: 2 days ✓' },
        { name: 'Drip Irrigation System', status: 'Active', maintenance: 'Maint: 15 days ✓' },
        { name: 'Automated Seeder', status: 'Inactive', maintenance: 'Maint: Overdue ✓' }
      ]}
    />
  );
}
