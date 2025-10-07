import CropManagementCard from '../CropManagementCard';

export default function CropManagementCardExample() {
  return (
    <CropManagementCard
      crops={[
        { name: 'Wheat', health: 'Excellent' },
        { name: 'Potatoes', health: 'Good' },
        { name: 'Carrots', health: 'Good' },
        { name: 'Onions', health: 'Fair' }
      ]}
    />
  );
}
