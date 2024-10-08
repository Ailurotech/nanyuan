import { BooktablePage } from "@/components/book-table-page/BooktablePage";
import { Restaurant } from "@/types";
import { GetStaticProps } from "next";
import { sanityClient } from "@/lib/sanityClient"; 

interface BookTableProps {
  restaurant: Restaurant; 
}

export default function bookATablePage({ restaurant }: BookTableProps) {
  return <BooktablePage restaurant={restaurant} />; 
}


export const getStaticProps: GetStaticProps = async () => {
  const query = `
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
    
    const data = await sanityClient.fetch(query);

    return {
      props: {
        restaurant: data[0], 
      },
    };
  } catch (e) {
    console.error("Error fetching restaurant data:", e);
    return {
      props: {
        restaurant: null,
      },
    };
  }
};
