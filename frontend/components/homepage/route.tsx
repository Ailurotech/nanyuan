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
  Link: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <Link href={Menu.Path} className={className}>
      {children}
    </Link>
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


export const ShoppingCart = {
  Path: "/shoppingcart",
  Name: "ShoppingCart",
  Link: ({ children }: { children: React.ReactNode }) => (
    <Link href={Location.Path}>{children}</Link>
  ),
};