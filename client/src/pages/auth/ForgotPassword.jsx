import { forgotPassword } from "@/api/auth";
import { removeToken } from "@/utils/auth";
import { Stack } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNotifications } from "@toolpad/core";
import * as React from "react";
import { Link } from "react-router";

export default function ForgotPassword() {
    const [loading, setLoading] = React.useState(false);
    const [seconds, setSeconds] = React.useState(30);
    const notifications = useNotifications();

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        let formData = new FormData(event.currentTarget);
        let email = formData.get("email");

        removeToken();
        forgotPassword({ email })
            .then((response) => {
                if (response.status == 204) {
                    notifications.show(
                        "Reset Password Email Sent – Please Check Your Inbox",
                        {
                            severity: "success",
                            autoHideDuration: 3000,
                        }
                    );
                    setSeconds(59);
                } else throw new Error(response.message);
            })
            .catch((error) => {
                let msg = error.message || "Send Reset Password Email Failed";
                notifications.show(msg, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
            })
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        if (seconds <= 0) return;

        const interval = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    return (
        <Box
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Box
                component={Paper}
                padding={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
                maxWidth={400}
            >
                <Typography variant="h5" component="h1" gutterBottom>
                    Forgot Your Password?
                </Typography>
                <Typography textAlign="center">
                    Enter your email address below. We will send you
                    instructions to reset your password.
                </Typography>
                <Stack
                    spacing={1}
                    component="form"
                    onSubmit={handleSubmit}
                    width="100%"
                    alignItems="center"
                >
                    <TextField
                        name="email"
                        label="Email"
                        type="email"
                        variant="standard"
                        slotProps={{
                            htmlInput: {
                                // pattern: "^.+@(mail\\.)?ustc\\.edu\\.cn$",
                            },
                        }}
                        placeholder="@mail.ustc.edu.cn or @ustc.edu.cn"
                        fullWidth
                        size="small"
                        required
                        autoFocus
                    />
                    {seconds > 0 && (
                        <Typography
                            variant="subtitle2"
                            margin="auto"
                            color="textDisabled"
                        >
                            Resend in {seconds}s
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || seconds}
                        sx={{ my: 2 }}
                        fullWidth
                    >
                        Send Reset Password Email
                    </Button>
                    <Typography variant="body2" margin="auto">
                        Remember password? <Link to="/login">Sign in</Link>
                    </Typography>
                    <Typography variant="body2" margin="auto">
                        Don't have an account yet?{" "}
                        <Link to="/register">Create Account</Link>
                    </Typography>
                </Stack>
            </Box>
            <Backdrop open={loading}>
                <CircularProgress />
            </Backdrop>
        </Box>
    );
}
