import Link from "next/link";
import { AppLinkProps } from "../types";

const AppLink = ({ children, className = "", href, onClick }: AppLinkProps) => {
  if (typeof children == "string") {
    return (
      <Link
        href={href}
        className={`${className} size-fit transition hover:text-primary-light-300 dark:hover:text-primary-dark-300`}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link href={href} className={`${className} size-fit`} onClick={onClick}>
      {children}
    </Link>
  );
};
export default AppLink;
