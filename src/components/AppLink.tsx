import Link from "next/link";

const AppLink = ({ children, className, href }: AppLinkProps) => {
  const cn = !className ? "" : className;
  if (typeof children == "string") {
    return (
      <Link
        href={href}
        className={`${cn} transition hover:text-primary-light-300 dark:hover:text-primary-dark-300`}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link href={href} className={cn}>
      {children}
    </Link>
  );
};
export default AppLink;
