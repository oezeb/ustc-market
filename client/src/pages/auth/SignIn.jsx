import { login } from "@/api/auth";
import { removeToken, setToken } from "@/utils/auth";
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

export default function SignIn() {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const notifications = useNotifications();
    const [searchParams, _] = useSearchParams();

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        let formData = new FormData(event.currentTarget);
        let email = formData.get("email");
        let password = formData.get("password");

        removeToken();
        login({ email, password })
            .then((response) => {
                if (response.status == 200) {
                    setToken(response.data.token);
                    navigate(searchParams.get("redirect") || "/", {
                        replace: true,
                    });
                } else throw new Error(response.message);
            })
            .catch((error) => {
                let msg = error.message || "Login Failed";
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
                maxWidth={400}
            >
                <Typography variant="h5" component="h1" gutterBottom>
                    Login
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
                                pattern: "^.+@(mail\\.)?ustc\\.edu\\.cn$",
                            },
                        }}
                        placeholder="@mail.ustc.edu.cn or @ustc.edu.cn"
                        fullWidth
                        size="small"
                        required
                        autoFocus
                    />
                    <TextField
                        name="password"
                        label="Password"
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
                        Login
                    </Button>
                    <Typography variant="body2" textAlign="center">
                        <Link to="/forgot-password">Forgot your password?</Link>
                    </Typography>
                    <Typography variant="body2" textAlign="center">
                        Don't have an account yet?{" "}
                        <Link to="/register">Create Account</Link>
                    </Typography>
                    <Typography variant="body2" textAlign="center">
                        Email address not verified?{" "}
                        <Link to="/resend-verification">
                            Resend Verification
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
