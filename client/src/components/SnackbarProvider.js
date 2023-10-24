import React from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarContext = React.createContext();

function SnackbarProvider({ children }) {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [severity, setSeverity] = React.useState("success");
    const [duration, setDuration] = React.useState(undefined);
    const [action, setAction] = React.useState(undefined);

    const showSnackbar = (message, severity, duration, action) => {
        setMessage(message);
        setSeverity(severity);
        setDuration(duration);
        setAction(action);

        setOpen(true);
    };

    const closeSnackbar = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);

        setDuration(undefined);
        setAction(undefined);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar, closeSnackbar }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={duration}
                onClose={closeSnackbar}
            >
                <Alert
                    onClose={closeSnackbar}
                    severity={severity}
                    action={action}
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}

export const useSnackbar = () => React.useContext(SnackbarContext);

export default SnackbarProvider;
