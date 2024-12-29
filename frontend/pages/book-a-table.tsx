import { BooktablePage } from "@/components/book-table-page/BooktablePage";
import { Restaurant, Table } from "@/types";
import { GetStaticProps } from "next";
import { fetchRestaurant, fetchTables } from "@/lib/queries";

interface BookTableProps {
  restaurant: Restaurant;
  tables: Table[];
}

export default function bookATablePage({ restaurant, tables }: BookTableProps) {
  return <BooktablePage restaurant={restaurant} tables={tables} />;
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [restaurantData, tableData] = await Promise.all([
      fetchRestaurant(),
      fetchTables(),
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
