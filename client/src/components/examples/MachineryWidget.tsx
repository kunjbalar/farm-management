import MachineryWidget from '../MachineryWidget';

export default function MachineryWidgetExample() {
  return (
    <MachineryWidget onManageEquipment={() => console.log('Manage equipment clicked')} />
  );
}
