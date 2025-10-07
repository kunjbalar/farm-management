import CropStatusWidget from '../CropStatusWidget';

export default function CropStatusWidgetExample() {
  return (
    <CropStatusWidget
      crops={[
        { name: 'Wheat', area: '200 acres', stage: 'Growth Stage', health: 'Healthy', harvestDate: '15 Jul 2025' },
        { name: 'Potatoes', area: '100 acres', stage: 'Planting Stage', health: 'Good', harvestDate: '10 Aug 2025' },
        { name: 'Carrots', area: '50 acres', stage: 'Seedling Stage', health: 'Good', harvestDate: '25 Sep 2025' },
        { name: 'Onions', area: '150 acres', stage: 'Growth Stage', health: 'Fair', harvestDate: '10 Oct 2025' }
      ]}
      onManageAllCrops={() => console.log('Manage all crops clicked')}
    />
  );
}
