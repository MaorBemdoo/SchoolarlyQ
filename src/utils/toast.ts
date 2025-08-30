import { Toast } from "@/config/swal";

const toast = {
    success(message: string) {
        Toast.fire({
            icon: "success",
            title: message,
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
            customClass: {
                popup: "dark:!bg-secondary-dark-100 dark:*:!text-white",
                timerProgressBar: "!bg-red-500"
            }
        });
    }
}
export default toast