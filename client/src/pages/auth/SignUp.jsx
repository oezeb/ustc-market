import { register } from "@/api/auth";
import { removeToken } from "@/utils/auth";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNotifications } from "@toolpad/core";
import React from "react";
import { Link, useNavigate } from "react-router";

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const notifications = useNotifications();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        let formData = new FormData(event.currentTarget);
        let name = formData.get("name");
        let email = formData.get("email");
        let password = formData.get("password");
        let repeatPassword = formData.get("repeat-password");

        if (password !== repeatPassword) {
            notifications.show("Passwords do not match", {
                severity: "error",
                autoHideDuration: 5000,
            });
            setLoading(false);
            return;
        }

        removeToken();
        register({ name, email, password })
            .then((response) => {
                if (response.status == 201) {
                    notifications.show("Successful registration", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    navigate("/resend-verification");
                } else throw new Error(response.message);
            })
            .catch((error) => {
                let msg = error.message || "Registration failed";
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
                    Let's Get Started
                </Typography>
                <Stack
                    spacing={1}
                    component="form"
                    onSubmit={handleSubmit}
                    width="100%"
                    alignItems="center"
                >
                    <Stack spacing={1} direction="row" width="100%">
                        <TextField
                            name="name"
                            label="Name"
                            variant="standard"
                            size="small"
                            fullWidth
                            required
                            autoFocus
                        />
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
                        />
                    </Stack>
                    <Stack spacing={1} direction="row" width="100%">
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
                    </Stack>

                    <Stack
                        direction="row"
                        width="100%"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Checkbox defaultChecked={false} required />
                        <Typography variant="body2">
                            <span>I agree to USTC Market </span>
                            <Link to="/terms-of-service.html" target="_blank">
                                Terms and Conditions
                            </Link>
                        </Typography>
                    </Stack>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ my: 2 }}
                        fullWidth
                    >
                        Create Account
                    </Button>
                    <Typography variant="body2">
                        <span>Already have an account? </span>
                        <Link to="/login">Sign in</Link>
                    </Typography>
                </Stack>
            </Box>
            <Backdrop open={loading}>
                <CircularProgress />
            </Backdrop>
        </Box>
    );
}

export default Register;
