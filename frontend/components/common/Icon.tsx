import { FaInstagram } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import { FiPhone } from "react-icons/fi";
import { FiFacebook } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";

const socialMedia = {
  facebook: FiFacebook,
  instagram: FaInstagram,
};

const commonIcon = {
  mobile: FiPhone,
  menu: IoMenu,
  arrow: FaArrowRightLong,
};

const icons = {
  ...socialMedia,
  ...commonIcon,
};

export type Icon = keyof typeof icons;
type IconProps = {
  name: Icon;
} & IconBaseProps;
export function Icon({ name, ...props }: IconProps) {
  const Icon = icons[name];
  return <Icon {...props} />;
}
