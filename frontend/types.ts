// types.ts
export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categories: string[]; 
  isAvailable: boolean; 
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

export interface Category {
  name: string; 
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

export interface Table {
  type: string;
  quantity: number;
  _id: string;
}

export interface ReservationData {
  name: string;
  phone: string;
  email: string;
  guests: string;  
  date: string;
  time: string;
  preference?: string;  
  notes?: string;       
  tableId: string;
}

export interface OrderItem {
  _id: string;         
  name: string;        
  price: number;       
  quantity: number;    
  menuItem: {
    _type: 'reference'; 
    _ref: string;       
  };
}

export interface OrderData {
  name: string;             
  phone: string;            
  date: string;             
  time: string;             
  email: string;            
  notes?: string;           
  items: OrderItem[];    
  totalPrice: number;       
  status: 'Offline' | 'Pending'|'Paid'|'Cancelled'; 
  paymentMethod: 'offline' | 'online'; 
  orderId: string;           
  sessionId?: string | null; 
}

export interface LocationInfo {
  title: string;
  address: string;
  phone: string;
  email: string;
  images: Array<{
    _type: string;
    asset: {
      _id: string;
      url: string;  // 确保包含 url
    };
    alt: string;
  }>;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string
  width?: number; // Add width, make it optional
  height?: number;
  blurDataURL?: string;
}