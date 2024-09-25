interface AppLinkProps {
  children: React.ReactNode;
  className?: string;
  href: string | URL;
}

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void | Promise<() => void>;
  variant?: "standard" | "outlined" | "filled" | "custom";
  color: "orange" | "blue";
}
