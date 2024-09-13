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
  export interface HomePageContent {
    title: string;
    backgroundimg: {
      asset: {
        url: string;
      };
    };
    dishimg: {
      asset: {
        url: string;
      };
    };
    cheftext: string;
    chefname: string;
    Homepagetitle: string;
  }