import { FaInstagram } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import { FiPhone } from "react-icons/fi";
import { FiFacebook } from "react-icons/fi";

const socialMedia = {
  facebook: FiFacebook,
  instagram: FaInstagram,
};

const commonIcon = {
  mobile: FiPhone,
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
