// types.ts
export interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: {
      url: string;
    };
  }
  