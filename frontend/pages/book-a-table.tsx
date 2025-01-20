import { BooktablePage } from "@/components/book-table-page/BooktablePage";
import { Restaurant } from "@/types";
import { GetStaticProps } from "next";
import { sanityClient } from "@/lib/sanityClient"; 
import { Table } from "@/types";

interface BookTableProps {
  restaurant: Restaurant; 
  table: Table[];
}

export default function bookATablePage({ restaurant, table }: BookTableProps) {
  return <BooktablePage restaurant={restaurant} table={table} />; 
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
  
  const tableQuery = `
  *[_type == "table"]{
    type,
    quantity,
    _id
  }
`;

  try {
    const restaurantData = await sanityClient.fetch(restaurantQuery);
    const tableData = await sanityClient.fetch(tableQuery);

    return {
      props: {
        restaurant: restaurantData[0], 
        table: tableData,
      },
    };
  } catch (e) {
    console.error("Error fetching restaurant data:", e);
    return {
      props: {
        restaurant: null,
        table: [],
      },
    };
  }
};
