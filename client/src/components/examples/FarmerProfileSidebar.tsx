import FarmerProfileSidebar from '../FarmerProfileSidebar';

export default function FarmerProfileSidebarExample() {
  const user = {
    name: 'Farmer 1',
    farmName: 'Green Valley Farm',
    farmLocation: 'XXX XXX XXX',
    totalArea: '4 Hectare (10 acres)',
    contact: '+91 1234567890',
    profilePhoto: ''
  };
  return (
    <FarmerProfileSidebar
      farmerName="Farmer 1"
      farmName="Green Valley Farm"
      farmLocation="XXX XXX XXX"
      totalArea="4 Hectare (10 acres)"
      contact="+91 1234567890"
      onEditProfile={() => console.log('Edit profile clicked')}
      user={user}
      onUserUpdate={() => console.log('User updated')}
    />
  );
}
