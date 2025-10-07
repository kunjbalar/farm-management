import HarvestCountdownCard from '../HarvestCountdownCard';

export default function HarvestCountdownCardExample() {
  return (
    <HarvestCountdownCard
      harvests={[
        { crop: 'Wheat', date: '15 Jul 2025', progress: 75, stage: 'Growth' },
        { crop: 'Potatoes', date: '10 Aug 2025', progress: 60, stage: 'Flowering' },
        { crop: 'Carrots', date: '25 Sep 2025', progress: 45, stage: 'Seedling' },
        { crop: 'Onions', date: '10 Oct 2025', progress: 30, stage: 'Growth' }
      ]}
    />
  );
}
