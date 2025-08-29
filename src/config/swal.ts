import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const AppSwal = withReactContent(Swal).mixin({
    customClass: {
        popup: '!w-[300px] md:!w-[600px]',
        icon: '!text-sm md:!text-base',
        confirmButton: '!bg-primary-light-300 hover:!bg-primary-light-400 dark:!bg-primary-dark-300 dark:hover:!bg-primary-dark-400',
    },
})

export const Toast = AppSwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', AppSwal.stopTimer);
        toast.addEventListener('mouseleave', AppSwal.resumeTimer);
    }
})
