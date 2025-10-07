import DashboardPage from '../../pages/DashboardPage';

export default function DashboardPageExample() {
  return <DashboardPage onLogout={() => console.log('Logout clicked')} />;
}
