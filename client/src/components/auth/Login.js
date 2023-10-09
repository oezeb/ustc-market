import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "components/auth/AuthProvider";

const Login = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const username = event.target.username.value;
        const password = event.target.password.value;

        setLoading(true);
        let user = await auth.login(username, password);
        setLoading(false);
        if (user) navigate("/");
    };

    return (
        <Box
            sx={{
                width: "100%",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    id="username"
                    name="username"
                    inputProps={{ minLength: 1, pattern: "[a-zA-Z0-9_]+" }}
                    variant="standard"
                    fullWidth
                    required
                    label="Username"
                    autoFocus
                />
                <TextField
                    id="password"
                    name="password"
                    type="password"
                    inputProps={{ minLength: 1 }}
                    variant="standard"
                    fullWidth
                    required
                    label="Password"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ mt: 3, mb: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : "Login"}
                </Button>
            </Box>
        </Box>
    );
};

export default Login;
