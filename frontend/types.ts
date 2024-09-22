// types.ts
export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}
export interface HeroContent {
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

export interface GalleryContent {
  galleryPhotos: SinglePhoto[];
  menuName: string;
  menuDescription: {
    children: {
      text: string;
    }[];
  }[];
  menuLink: string;
}

export interface SinglePhoto {
  asset: {
    url: string;
  };
}

export interface OpeningHoursContent {
  OpeninghourPhotos: SinglePhoto[];
  testimonials: Testimonial[];
}

export interface Testimonial {
  name: string;
  review: string;
  region: string;
  image: {
    asset: {
      url: string;
    };
  };
}

export interface ShoppingCartItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartCardProps {
  shoppingCartItem: ShoppingCartItem;
  removeItem: () => void;
  updateQuantity: (newQuantity: number, id: string) => void;
}
