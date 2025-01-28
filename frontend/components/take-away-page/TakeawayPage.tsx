import { TakeawayForm } from './component/TakeawayForm';
import { Restaurant } from '@/types';

interface TakeawayPageProps {
  restaurant: Restaurant;
}

export function TakeawayPage({ restaurant }: TakeawayPageProps) {
  return (
    <section className="bg-[#191919] min-h-screen pt-[200px] flex flex-col items-center">
      <div className="bg-[#e5e7ea] p-4 flex flex-col gap-8 rounded-lg max-w-[500px]">
        <div className="flex flex-col space-y-1">
          <h1 className="text-xl font-bold">Pickup Order Form</h1>
          <h3 className="text-xs">Please fill in your details for pickup</h3>
        </div>
        <TakeawayForm restaurant={restaurant} />
      </div>
    </section>
  );
}
