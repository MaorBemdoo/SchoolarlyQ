import { ButtonProps } from "@/types";

const Button = ({
  children,
  className = "",
  onClick,
  variant = "standard",
  color = "orange",
  loading,
  disabled = false,
}: ButtonProps) => {
  const baseClass =
    "transition px-4 py-2 rounded text-secondary-light-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:scale-100 focus:scale-[0.98] dark:text-secondary-dark-200";

  let variantClass = "";
  let hoverClass = "";

  if (variant === "standard") {
    variantClass =
      color === "orange"
        ? "bg-primary-light-300 dark:bg-primary-dark-300"
        : "bg-secondary-light-400/80 dark:bg-secondary-dark-400/80";
    hoverClass =
      color === "orange"
        ? "hover:bg-primary-light-400 hover:dark:bg-primary-dark-400"
        : "hover:bg-secondary-light-400 dark:hover:bg-secondary-dark-400";
  } else if (variant === "outlined") {
    variantClass = `border ${color === "orange" ? "border-primary-light-300 !text-primary-light-300 dark:border-primary-dark-300 dark:!text-primary-dark-300" : "border-secondary-light-400 !text-secondary-light-400 dark:border-secondary-dark-400 dark:!text-secondary-dark-400"}`;
    hoverClass =
      color == "orange"
        ? "hover:!text-secondary-light-200 hover:bg-primary-light-300 dark:hover:!text-secondary-dark-200 dark:hover:bg-primary-dark-300"
        : "hover:bg-secondary-light-400 hover:!text-secondary-light-200 dark:hover:bg-secondary-dark-400 dark:hover:!text-secondary-dark-200";
  } else if (variant === "filled") {
    variantClass =
      color === "orange"
        ? "bg-primary-light-300 dark:bg-primary-dark-300"
        : "bg-secondary-light-400 dark:bg-secondary-dark-400";
    hoverClass =
      color === "orange"
        ? "hover:bg-secondary-light-400 dark:hover:bg-secondary-dark-400"
        : "hover:bg-primary-light-300 dark:hover:bg-primary-dark-300";
  }

  return (
    <button
      className={`${baseClass} ${variantClass} ${hoverClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="inline-block size-5 border-2 border-t-2 border-t-white border-white/40 rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
