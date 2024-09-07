import Link from "next/link";
import path from "path";

const Rout = {
  Path: "/",
  Name: "Home",
  Link: ({ children }: { children: React.ReactNode }) => (
    <Link href={Rout.Path}>{children}</Link>
  ),
};

const Location = {
  Path: "/location",
  Name: "Location",
  Link: ({ children }: { children: React.ReactNode }) => (
    <Link href={Location.Path}>{children}</Link>
  ),
};

const Menu = {
  Path: "/menu",
  Name: "Menu",
  Link: ({ children }: { children: React.ReactNode }) => (
    <Link href={Menu.Path}>{children}</Link>
  ),
};

const Takeaway = {
  Path: "/takeaway",
  Name: "Takeaway",
  Link: ({ children }: { children: React.ReactNode }) => (
    <Link href={Takeaway.Path}>{children}</Link>
  ),
};

const BookATable = {
  Path: "/book-a-table",
  Name: "Book a Table",
  Link: ({ children }: { children: React.ReactNode }) => (
    <Link href={BookATable.Path}>{children}</Link>
  ),
};

const FaceBook = {
  Path: "https://www.facebook.com/share/rMnJiotUYTE2acBq/?mibextid=LQQJ4d",
  Name: "facebook",
};

const Instagram = {
  Path: "https://www.instagram.com/nan_yuan_restaurant?igsh=MWE0djRocGd0OTNscg==",
  Name: "instagram",
};

export const RoutRoute = {
  Rout,
};

export const NavigationRoute = {
  Location,
  Menu,
  Takeaway,
  BookATable,
};

export const SocialRoute = {
  FaceBook,
  Instagram,
};

export const HomePageContent = {
  background: {
    name: "homepage-background",
    path: "https://s2.loli.net/2024/09/05/mjv9A8IeqlTwDyi.png",
  },
  dish: {
    name: "homepage-dish",
    path: "https://s2.loli.net/2024/09/05/2sTNeCwxcI4alPZ.png",
  },
  title: {
    name: "homepage-title",
    text: "Crafted with Tradition, Served with Care: Experience the Authentic Flavors of China at Nanyuan",
    buttonText: "SEE OUR MENU",
    path: NavigationRoute.Menu.Path,
  },
  chef: {
    name: "— Chef Leon",
    text: "At Nanyuan, each dish is a blend of tradition and passion, bringing the authentic taste of China to your plate.",
  }
};



