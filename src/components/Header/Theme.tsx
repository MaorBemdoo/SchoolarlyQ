import { useTheme } from "next-themes";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { SetStateAction, useRef, useState } from "react";
import useEventOutside from "@/hooks/useEventOutside";
import { FaChevronDown } from "react-icons/fa6";
import { usePathname } from "next/navigation";

const Theme = ({
  screen,
  setMobileIsVisible,
}: {
  screen: "mobile" | "desktop";
  setMobileIsVisible?: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const pathname = usePathname()

  const { theme, resolvedTheme, setTheme } = useTheme();
  const { scrollYProgress } = useScroll();

  const borderColor = useTransform(
    scrollYProgress,
    [0, 0.00001],
    ["#fff", resolvedTheme == "dark" ? "#fff" : "#27284E"],
  );

  const themes = [
    {
      key: 1,
      name: "system",
      Icon: HiOutlineComputerDesktop,
    },
    {
      key: 2,
      name: "light",
      Icon: MdOutlineLightMode,
    },
    {
      key: 3,
      name: "dark",
      Icon: MdOutlineDarkMode,
    },
  ];

  const { Icon } = themes.find(({ name }) => name === theme) || themes[0];

  useEventOutside([buttonRef, menuRef], () => setIsVisible(false));

  const handleTheme = (name: string) => {
    if (name !== theme) {
      setTheme(name);
    }
    if (typeof setMobileIsVisible !== "undefined") {
      setMobileIsVisible(false); // set mobile aside visibility to false
    }
    setIsVisible(false);
  };

  return (
    <>
      {screen == "mobile" ? (
        <div className="flex items-center justify-center !p-0 hover:!bg-transparent divide-x-[1px] rounded-3xl first:*:rounded-s-3xl last:*:rounded-e-3xl divide-primary-light-300 border border-primary-light-300 dark:border-primary-dark-300 dark:divide-primary-dark-300">
          {themes.map(({ key, name, Icon }) => {
            return (
              <span
                className={`basis-1/3 ${name === theme ? "bg-primary-light-100 text-primary-light-300 dark:bg-primary-dark-100 dark:text-primary-dark-300" : "hover:bg-primary-light-100 dark:hover:bg-primary-dark-100"} text-center p-2 cursor-pointer`}
                onClick={() => handleTheme(name)}
                key={key}
              >
                <Icon />
              </span>
            );
          })}
        </div>
      ) : (
        <div className="relative">
          <motion.div
            className="flex items-center gap-2 p-2 rounded-full border border-secondary-light-400 cursor-pointer last:*:hover:animate-bounce dark:border-white"
            ref={buttonRef}
            onClick={() => setIsVisible(!isVisible)}
            style={ pathname === "/" ? { borderColor } : {} }
          >
            <Icon className="text-2xl" />
            <FaChevronDown className="text-xs" />
          </motion.div>
          <AnimatePresence>
            {isVisible && (
              <motion.div
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{ y: 20, opacity: 1 }}
                exit={{ y: 0, opacity: 0 }}
                ref={menuRef}
                className="absolute flex flex-col justify-between gap-2 p-2 rounded shadow-md border border-secondary-light-400 bg-white text-secondary-light-400 dark:border-secondary-dark-400 dark:bg-secondary-dark-100 dark:text-secondary-dark-400"
              >
                {themes.map(({ key, name, Icon }) => {
                  return (
                    <div
                      className={`${name === theme ? "bg-primary-light-100 text-primary-light-300 dark:bg-primary-dark-100 dark:text-primary-dark-300" : "hover:bg-primary-light-100 dark:hover:bg-primary-dark-100"} flex items-center gap-2 px-3 py-1 cursor-pointer`}
                      onClick={() => handleTheme(name)}
                      key={key}
                    >
                      <Icon />
                      <p className="capitalize">{name}</p>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};
export default Theme;
