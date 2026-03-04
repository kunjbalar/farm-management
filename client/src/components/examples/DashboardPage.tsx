import DashboardPage from '../../pages/DashboardPage';

export default function DashboardPageExample() {
  const user = {
    name: 'Farmer 1',
    farmName: 'Green Valley Farm',
    farmLocation: 'XXX XXX XXX',
    totalArea: '4 Hectare (10 acres)',
    contact: '+91 1234567890',
    profilePhoto: ''
  };

  return (
    <DashboardPage
      user={user}
      onLogout={() => console.log('Logout clicked')}
      onUserUpdate={() => console.log('User updated')}
    />
  );
}
