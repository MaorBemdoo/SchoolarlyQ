import { MotionValue } from "framer-motion";

export interface AppLinkProps {
  children: React.ReactNode;
  className?: string;
  href: string | URL;
}

export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void | Promise<() => void>;
  variant?: "standard" | "outlined" | "filled" | "custom";
  color: "orange" | "blue";
}

export interface MenuIconProps {
  textColor: MotionValue<string>;
  onClick: () => void;
  isVisible: boolean;
  iconRef: React.RefObject<HTMLDivElement>;
}
