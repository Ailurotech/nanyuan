import { BooktablePage } from "@/components/book-table-page/BooktablePage";
import { Restaurant, Table } from "@/types";
import { GetStaticProps } from "next";
import { sanityClient } from "@/lib/sanityClient";

interface BookTableProps {
  restaurant: Restaurant;
  tables: Table[]; 
}

export default function bookATablePage({ restaurant, tables }: BookTableProps) {
  return <BooktablePage restaurant={restaurant} tables={tables} />;
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
    const [restaurantData, tableData] = await Promise.all([
      sanityClient.fetch(restaurantQuery),
      sanityClient.fetch(tableQuery),
    ]);

    return {
      props: {
        restaurant: restaurantData[0], 
        tables: tableData, 
      },
    };
  } catch (e) {
    console.error("Error fetching data:", e);
    return {
      props: {
        restaurant: null,
        tables: [], 
      },
    };
  }
};
