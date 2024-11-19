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
  openingHours: string[];
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

export interface Restaurant {
  title: string;
  Weekdaytime: Duration;
  Weekandtime: Duration;
  blacklist: string[];
}

export interface Duration {
  start: string; 
  end: string;   
}

export interface FooterContent {
  mapEmbedUrl: string;
  address: string;
  phone: string;
  email: string;
  copyright: string;
  insEmbedId: string;
  topImage: {
    asset: {
      url: string; 
    };
  } 
}
