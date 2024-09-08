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
import { Icon } from "@/components/common/Icon";

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
        <Icon name="menu" />
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} size="xs" colorScheme="green">
        <DrawerOverlay />
        <DrawerContent
          className={clsx("py-4", font.className)}
          backgroundColor="rgba(22, 24,33, 0.8)"
          color="white"
        >
          <DrawerCloseButton fontSize="0.8rem" top="1.5rem" right="1.5rem" />
          <DrawerHeader
            borderBottomWidth="1px"
            borderBottomColor="white"
            fontSize="1.5rem"
          >
            Menu
          </DrawerHeader>
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
