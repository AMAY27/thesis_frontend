import { toast } from 'react-toastify';

export default function notification(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
){
    return toast[type](message,{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    })
}