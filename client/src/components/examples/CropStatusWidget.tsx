import CropStatusWidget from '../CropStatusWidget';

export default function CropStatusWidgetExample() {
  return (
    <CropStatusWidget
      onManageAllCrops={() => console.log('Manage all crops clicked')}
    />
  );
}
