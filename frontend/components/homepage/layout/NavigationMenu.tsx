import Link from "next/link";
import { NavigationRoute } from "../route";

export function NavigationMenu() {
  return Object.values(NavigationRoute).map((route) => (
    <li key={route.Name}>
      <Link href={route.Path}>{route.Name}</Link>
    </li>
  ));
}
