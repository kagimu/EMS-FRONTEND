import { useNotification } from "@kyvg/vue3-notification";
const { notify }  = useNotification()
export default function useNotificationStore() {

    function  successToast(
        title = "Success",
        text = "Request was processed successfully"
    ) {
        notify({
            title: title,
            text: text,
            type: "success",
        });
    }

    function  errorToast(
        title = "Error",
        text = "Something went wrong try again later"
    ) {
        if(notify) {
            notify({
                title: title,
                text: text,
                type: "error",
            });
        }
    }

    function  warningToast(
        title = "Warning",
        text = "It seems something is not right"
    ) {
        notify({
            title: title,
            text: text,
            type: "warn",
        });
    }




    return {
        successToast,
        errorToast,
        warningToast,
    }
}
