import { TakeawayPage } from "@/components/take-away-page/TakeawayPage";
import { Restaurant } from "@/types";
import { GetStaticProps } from "next";
import { fetchRestaurant } from "@/lib/queries"; 

interface TakeawayProps {
  restaurant: Restaurant;
}

export default function Page({ restaurant }: TakeawayProps) {
  return <TakeawayPage restaurant={restaurant} />;
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const restaurantData = await fetchRestaurant(); 
    return {
      props: {
        restaurant: restaurantData[0],
      },
    };
  } catch (e) {
    console.error("Error fetching data:", e);
    return {
      props: {
        restaurant: null,
      },
    };
  }
};
