import InventoryWidget from '../InventoryWidget';

export default function InventoryWidgetExample() {
  return (
    <InventoryWidget
      items={[
        { name: 'Wheat Seeds', quantity: '1500 kg', status: 'In Stock' },
        { name: 'Urea Fertilizer', quantity: '500 kg', status: 'Low Stock' },
        { name: 'Bio Pesticides', quantity: '30 ltr', status: 'In Stock' },
        { name: 'Engine Oil', quantity: '250 ltr', status: 'Out of Stock' },
        { name: 'Spare Parts', quantity: 'Various', status: 'In Stock' }
      ]}
      onOrder={() => console.log('Order clicked')}
      onManageInventory={() => console.log('Inventory clicked')}
    />
  );
}
