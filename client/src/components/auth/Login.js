import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiRoutes } from "api";
import { useSnackbar } from "components/SnackbarProvider";

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const { showSnackbar, closeSnackbar } = useSnackbar();

    const VerifyEmailAction = () => (
        <>
            <Button
                onClick={closeSnackbar}
                component={Link}
                to="/verification-email"
            >
                Resend
            </Button>
            <IconButton size="small" color="inherit" onClick={closeSnackbar}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </>
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username");
        const password = formData.get("password");

        fetch(apiRoutes.login, {
            method: "POST",
            headers: {
                Authorization: `Basic ${btoa(`${username}:${password}`)}`,
            },
        })
            .then((res) => {
                if (res.ok) navigate("/", { replace: true });
                else if (res.status === 403)
                    showSnackbar(
                        "Email not verified, please check your inbox",
                        "error",
                        undefined,
                        <VerifyEmailAction />
                    );
                else
                    showSnackbar("Invalid username or password", "error", 5000);
            })
            .catch((error) => {
                console.error(error);
                showSnackbar("Something went wrong", "error", 5000);
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
            <Typography variant="h4" component="h1" gutterBottom>
                Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} width="100%">
                <TextField
                    name="username"
                    variant="standard"
                    fullWidth
                    required
                    label="Username or Email"
                    autoFocus
                />
                <TextField
                    name="password"
                    type="password"
                    variant="standard"
                    fullWidth
                    required
                    label="Password"
                />
                <Box display="flex" justifyContent="end" my={1}>
                    <Typography
                        variant="body2"
                        component={Link}
                        to="/reset-password"
                    >
                        Forgot password
                    </Typography>
                </Box>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ my: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : "Login"}
                </Button>
            </Box>
            <Box>
                <Typography variant="body2" margin="auto">
                    Don't have an account? <Link to="/register">Register</Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Login;
