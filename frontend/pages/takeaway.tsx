import { TakeawayPage } from "@/components/take-away-page/TakeawayPage";
import { Restaurant } from "@/types";
import { GetStaticProps } from "next";
import { sanityClient } from "@/lib/sanityClient";

interface TakeawayProps {
  restaurant: Restaurant;
}

export default function Page({ restaurant }: TakeawayProps) {
  return <TakeawayPage restaurant={restaurant} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const restaurantQuery = `
    *[_type == "restaurant"]{
      title,
      Weekdaytime {
        start,
        end
      },
      Weekandtime {
        start,
        end
      },
      blacklist
    }
  `;

  try {
    const restaurantData = await sanityClient.fetch(restaurantQuery);

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
