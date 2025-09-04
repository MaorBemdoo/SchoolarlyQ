import { Toast } from "@/config/swal";

const toast = {
    success(message: string) {
        Toast.fire({
            icon: "success",
            title: message,
            position: typeof window !== "undefined" && window.innerWidth <= 765 ? 'top' : 'top-end',
            width: typeof window !== "undefined" && window.innerWidth <= 765 ? '90%' : undefined,
            customClass: {
                popup: "dark:!bg-secondary-dark-100 dark:*:!text-white",
                timerProgressBar: "!bg-green-500"
            }
        });
    },
    error(message: string) {
        Toast.fire({
            icon: "error",
            title: message,
            position: typeof window !== "undefined" && window.innerWidth <= 765 ? 'top' : 'top-end',
            width: typeof window !== "undefined" && window.innerWidth <= 765 ? '90%' : undefined,
            customClass: {
                popup: "dark:!bg-secondary-dark-100 dark:*:!text-white",
                timerProgressBar: "!bg-red-500"
            }
        });
    },
    warn(message: string) {
        Toast.fire({
            icon: "warning",
            title: message,
            position: typeof window !== "undefined" && window.innerWidth <= 765 ? 'top' : 'top-end',
            width: typeof window !== "undefined" && window.innerWidth <= 765 ? '90%' : undefined,
            customClass: {
                popup: "dark:!bg-secondary-dark-100 dark:*:!text-white",
                timerProgressBar: "!bg-orange-300",
            }
        });
    },
}
export default toast