import { BooktablePage } from "@/components/book-table-page/BooktablePage";
import { Restaurant } from "@/types";
import { GetStaticProps } from "next";
import { sanityClient } from "@/lib/sanityClient"; // 你的 Sanity 客户端实例

interface BookTableProps {
  restaurant: Restaurant; // 定义传递给组件的 props 类型
}

export default function bookATablePage({ restaurant }: BookTableProps) {
  return <BooktablePage restaurant={restaurant} />; // 传递 restaurant 数据给组件
}

// 使用 getStaticProps 获取 restaurant 数据
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
