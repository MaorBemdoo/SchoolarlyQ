import { MenuIconProps } from "@/types";
import { motion, useAnimationControls } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const MenuIcon = ({
  textColor,
  onClick,
  isVisible,
  iconRef,
}: MenuIconProps) => {
  const controls = useAnimationControls();
  const pathname = usePathname()

  useEffect(() => {
    if (isVisible) {
      controls.start("animate1");
      controls.start("animate2");
      controls.start("animate3");
      return;
    }
    controls.start("initial1");
    controls.start("initial2");
    controls.start("initial3");
  }, [controls, isVisible]);

  return (
    <div
      id="menu-icon"
      className="w-6 *:h-[1.8px] grid gap-[0.4rem] cursor-pointer justify-items-end"
      ref={iconRef}
      onClick={onClick}
    >
      <motion.div
        initial="initial1"
        variants={{
          initial1: { width: "100%", transform: "translateY(0) rotate(0deg)" },
          animate1: {
            transform: "translateY(calc(0.4rem + 1.8px)) rotate(45deg)",
            transformOrigin: "center",
          },
        }}
        style={ pathname === "/" ? { backgroundColor: textColor } : { }}
        animate={controls}
        className="bg-secondary-light-400 dark:bg-white"
      ></motion.div>
      <motion.div
        initial="initial2"
        variants={{
          initial2: { width: `${(2 / 3) * 100}%`, opacity: 1 },
          animate2: { opacity: 0 },
        }}
        style={ pathname === "/" ? { backgroundColor: textColor } : { }}
        animate={controls}
        className="bg-secondary-light-400 dark:bg-white"
      ></motion.div>
      <motion.div
        initial="initial3"
        variants={{
          initial3: {
            width: `${(1 / 3) * 100}%`,
            transform: "translateY(0) rotate(0deg)",
          },
          animate3: {
            width: "100%",
            transform: "translateY(calc(-0.4rem - 1.8px)) rotate(-45deg)",
            transformOrigin: "center",
          },
        }}
        style={ pathname === "/" ? { backgroundColor: textColor } : { }}
        animate={controls}
        className="bg-secondary-light-400 dark:bg-white"
      ></motion.div>
    </div>
  );
};
export default MenuIcon;
