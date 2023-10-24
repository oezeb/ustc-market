import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiRoutes } from "api";
import { useSnackbar } from "components/SnackbarProvider";

function Register() {
    const [loading, setLoading] = React.useState(false);
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [emailError, setEmailError] = React.useState(null);
    const [passwordError, setPasswordError] = React.useState(null);

    const domains = ["@mail.ustc.edu.cn", "@ustc.edu.cn"];

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setEmailError(null);
        setPasswordError(null);

        const data = new FormData(event.currentTarget);
        const username = data.get("username").trim();
        const domain = data.get("domain");
        const password = data.get("password");
        const password2 = data.get("password2");
        const name = data.get("name").trim();

        if (password !== password2) setPasswordError("Passwords do not match");
        else {
            try {
                const res = await fetch(apiRoutes.register, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: username,
                        email: username + domain,
                        password,
                        name,
                    }),
                });

                if (res.status === 201) {
                    showSnackbar("Registered successfully", "success", 5000);
                    navigate("/login");
                } else if (res.status === 409)
                    setEmailError("Email already exists");
                else showSnackbar("Failed to register", "error", 5000);
            } catch (error) {
                console.error(error);
                showSnackbar("Something went wrong", "error", 5000);
            }
        }

        setLoading(false);
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
                Register
            </Typography>
            <Box component="form" onSubmit={handleSubmit} width="100%">
                <FormControl fullWidth margin="normal">
                    <Box display="flex">
                        <TextField
                            name="username"
                            variant="standard"
                            required
                            label="Email"
                            autoFocus
                            fullWidth
                            error={emailError}
                        />
                        <Select
                            name="domain"
                            variant="standard"
                            required
                            defaultValue={domains[0]}
                            error={emailError}
                        >
                            {domains.map((domain) => (
                                <MenuItem value={domain}>{domain}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                    {emailError && (
                        <FormHelperText error>{emailError}</FormHelperText>
                    )}
                </FormControl>
                <TextField
                    name="password"
                    type="password"
                    variant="standard"
                    fullWidth
                    required
                    label="Password"
                    error={passwordError}
                />
                <TextField
                    name="password2"
                    type="password"
                    variant="standard"
                    fullWidth
                    required
                    label="Confirm Password"
                    error={passwordError}
                    helperText={passwordError}
                />
                <TextField
                    name="name"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    label="Nickname"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ my: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : "Register"}
                </Button>
            </Box>
            <Typography variant="body2">
                Already have an account? <Link to="/login">Login</Link>
            </Typography>
        </Box>
    );
}

export default Register;
