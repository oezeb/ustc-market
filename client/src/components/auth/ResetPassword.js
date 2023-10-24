import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { apiRoutes } from "api";
import { useSnackbar } from "components/SnackbarProvider";
import { SendEmail } from "./VerificationEmail";

function ResetPassword() {
    const { token } = useParams();

    return token ? <ResetPass token={token} /> : <SendResetPasswordEmail />;
}

function ResetPass({ token }) {
    const [loading, setLoading] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(null);
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    React.useEffect(() => {
        document.cookie = `token=${token}; path=/; max-age=86400`;
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setPasswordError(null);

        const data = new FormData(event.currentTarget);
        const password = data.get("password");
        const password2 = data.get("password2");

        if (password !== password2) setPasswordError("Passwords do not match");
        else {
            try {
                const res = await fetch(apiRoutes.resetPassword, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password }),
                });

                if (res.ok) {
                    showSnackbar(
                        "Password reset successfully",
                        "success",
                        5000
                    );
                    navigate("/login");
                } else showSnackbar("Failed to reset password", "error", 5000);
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
                Reset Password
            </Typography>
            <Box component="form" onSubmit={handleSubmit} width="100%">
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
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ my: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>
            <Typography variant="body2" component={Link} to="/login">
                Back to login
            </Typography>
        </Box>
    );
}

function SendResetPasswordEmail() {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const onSend = async (email) => {
        console.log(email);
        const url = `${apiRoutes.sendResetPasswordEmail}/${email}`;
        try {
            const res = await fetch(url, { method: "POST" });
            if (res.ok) {
                showSnackbar("Reset password email sent", "success", 5000);
                navigate("/login");
            } else {
                showSnackbar(
                    "Failed to send reset password email",
                    "error",
                    5000
                );
            }
        } catch (error) {
            console.error(error);
            showSnackbar("Something went wrong", "error", 5000);
        }
    };

    return <SendEmail title="Send Verification Email" onSend={onSend} />;
}

export default ResetPassword;
