import { MotionValue } from "framer-motion";
import { MouseEventHandler } from "react";

export type RefType =
  | React.RefObject<HTMLElement>
  | React.RefObject<HTMLElement>[];
export type EventType = keyof DocumentEventMap | Array<keyof DocumentEventMap>;

export interface AppLinkProps {
  children: React.ReactNode;
  className?: string;
  href: string | URL;
}

export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: "standard" | "outlined" | "filled" | "custom";
  color?: "orange" | "blue";
  loading?: boolean;
}

export interface MenuIconProps {
  textColor: MotionValue<string>;
  onClick: () => void;
  isVisible: boolean;
  iconRef: React.RefObject<HTMLDivElement>;
}
