import Link from "next/link";

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

export const NavigationRoute = {
  Location,
  Menu,
  Takeaway,
  BookATable,
};
