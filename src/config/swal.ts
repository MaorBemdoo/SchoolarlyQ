import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const AppSwal = withReactContent(Swal).mixin({
  // theme: typeof window !== "undefined" ? window.document.getElementsByTagName('html')[0].className.split(" ")[0] as 'dark' | 'light' : "light",
  customClass: {
    popup:
      "!w-[300px] md:!w-[600px] dark:!bg-secondary-dark-100 dark:*:!text-white",
    icon: "!text-sm md:!text-base",
    confirmButton:
      "!bg-primary-light-300 hover:!bg-primary-light-400 dark:!bg-primary-dark-300 dark:hover:!bg-primary-dark-400",
  },
});

export const Toast = AppSwal.mixin({
  toast: true,
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", AppSwal.stopTimer);
    toast.addEventListener("mouseleave", AppSwal.resumeTimer);
  },
});
