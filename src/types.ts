import { MotionValue } from "framer-motion";
import { MouseEventHandler } from "react";

export type RefType =
  | React.RefObject<HTMLElement | null>
  | React.RefObject<HTMLElement | null>[];
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
  disabled?: boolean;
}

export interface MenuIconProps {
  textColor: MotionValue<string>;
  onClick: () => void;
  isVisible: boolean;
  iconRef: React.RefObject<HTMLDivElement | null>;
}

export interface FilterProps {
  data: string[];
  checked?: string[] | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setParams: React.Dispatch<any>;
  showSearch?: boolean;
  label: string;
}

export interface ActionResponse {
  status: "success" | "failed";
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}