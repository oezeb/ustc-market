import { resetPassword } from "@/api/auth";
import { removeToken } from "@/utils/auth";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNotifications } from "@toolpad/core";
import * as React from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

export default function ResetPassword() {
    const [searchParams, _] = useSearchParams();
    const navigate = useNavigate();
    const notifications = useNotifications();
    const [loading, setLoading] = React.useState(false);

    const token = searchParams.get("token");

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        if (!token) {
            let msg = "Invalid Request";
            notifications.show(msg, {
                severity: "error",
                autoHideDuration: 5000,
            });
            setLoading(false);
            return;
        }

        let formData = new FormData(event.currentTarget);
        let newPassword = formData.get("password");
        let repeatPassword = formData.get("repeat-password");

        if (newPassword !== repeatPassword) {
            notifications.show("Passwords do not match", {
                severity: "error",
                autoHideDuration: 5000,
            });
            setLoading(false);
            return;
        }

        removeToken();
        resetPassword({ token, newPassword })
            .then((response) => {
                if (response.status == 200) {
                    notifications.show("Password Changed", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    navigate("/login");
                } else throw new Error(response.message);
            })
            .catch((error) => {
                let msg = error.message || "Password Reset Failed";
                notifications.show(msg, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
            })
            .finally(() => setLoading(false));
    };

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
                maxWidth={500}
            >
                <Typography variant="h5" component="h1" gutterBottom>
                    Reset Password
                </Typography>
                <Stack
                    spacing={1}
                    component="form"
                    onSubmit={handleSubmit}
                    width="100%"
                    alignItems="center"
                >
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        variant="standard"
                        size="small"
                        fullWidth
                        required
                    />
                    <TextField
                        name="repeat-password"
                        label="Repeat Password"
                        type="password"
                        variant="standard"
                        size="small"
                        fullWidth
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ my: 2 }}
                        fullWidth
                    >
                        Submit
                    </Button>

                    <Typography variant="body2" textAlign="center">
                        <Link to="/forgot-password">
                            Resend Reset Password Email
                        </Link>
                    </Typography>
                </Stack>
            </Box>
            <Backdrop open={loading}>
                <CircularProgress />
            </Backdrop>
        </Box>
    );
}
