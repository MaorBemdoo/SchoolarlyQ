import Link from "next/link";
import { AppLinkProps } from "../types";

const AppLink = ({ children, className, href }: AppLinkProps) => {
  const cn = !className ? "" : className;
  if (typeof children == "string") {
    return (
      <Link
        href={href}
        className={`${cn} size-fit transition hover:text-primary-light-300 dark:hover:text-primary-dark-300`}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link href={href} className={`${cn} size-fit`}>
      {children}
    </Link>
  );
};
export default AppLink;
