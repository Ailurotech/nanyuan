import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { NavigationRoute } from "../route";
import Link from "next/link";
import clsx from "clsx";
import { NextFont } from "next/dist/compiled/@next/font";

export function NavigationDrawer({ font }: { font: NextFont }) {
  const { onOpen, isOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme="whiteAlpha"
        variant="buttonLink"
        size="lg"
      >
        Location
      </Button>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        size="xs"
        colorScheme="green"
        placement="bottom"
      >
        <DrawerOverlay />
        <DrawerContent className={clsx("py-4", font.className)}>
          <DrawerCloseButton size="sm" />
          <DrawerHeader>Navigation</DrawerHeader>
          <DrawerBody>
            <ul className="space-y-4">
              {Object.values(NavigationRoute).map((route) => (
                <li key={route.Name}>
                  <Link href={route.Path}>{route.Name}</Link>
                </li>
              ))}
            </ul>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
