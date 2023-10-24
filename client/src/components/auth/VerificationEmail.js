import { FormControl, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { apiRoutes } from "api";
import { useSnackbar } from "components/SnackbarProvider";

function VerificationEmail() {
    const { token } = useParams();

    return token ? <VerifyEmail token={token} /> : <SendVerificationEmail />;
}

function VerifyEmail({ token }) {
    const [loading, setLoading] = React.useState(true);
    const [verified, setVerified] = React.useState(false);
    const { showSnackbar } = useSnackbar();

    const verifyEmail = React.useCallback(async () => {
        setLoading(true);

        document.cookie = `token=${token}; path=/; max-age=86400`;
        try {
            const res = await fetch(apiRoutes.verifyEmail, {
                method: "PATCH",
            });

            console.log(await res.text());
            setVerified(res.ok);
        } catch (error) {
            console.error(error);
            setVerified(false);
            showSnackbar("Something went wrong", "error", 5000);
        }

        setLoading(false);
    }, [showSnackbar, token]);

    React.useEffect(() => {
        verifyEmail();
    }, [verifyEmail]);

    const Layout = ({ title, subtitle, children }) => (
        <Box
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Typography variant="h4" component="h1" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2">{subtitle}</Typography>
            {children}
        </Box>
    );

    if (loading)
        return (
            <Layout
                title="Verifying Email"
                subtitle="Please wait while we verify your email"
            >
                <CircularProgress size={24} sx={{ my: 2 }} />
            </Layout>
        );
    else if (verified)
        return (
            <Layout
                title="Email Verified"
                subtitle="You can now login with your email"
            >
                <Typography variant="body2" component={Link} to="/login">
                    Back to login
                </Typography>
            </Layout>
        );
    else
        return (
            <Layout
                title="Email Verification Failed"
                subtitle="Please try again"
            >
                <Button variant="contained" onClick={verifyEmail}>
                    Retry
                </Button>
            </Layout>
        );
}

function SendVerificationEmail() {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const onSend = async (email) => {
        const url = `${apiRoutes.sendVerificationEmail}/${email}`;
        try {
            const res = await fetch(url, { method: "POST" });
            if (res.ok) {
                showSnackbar("Verification email sent", "success", 5000);
                navigate("/login");
            } else {
                showSnackbar(
                    "Failed to send verification email",
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

export function SendEmail({ title, onSend }) {
    const [loading, setLoading] = React.useState(false);

    const domains = ["@mail.ustc.edu.cn", "@ustc.edu.cn"];

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const data = new FormData(event.currentTarget);
        const username = data.get("username").trim();
        const domain = data.get("domain");

        if (onSend) await onSend(username + domain);
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
                {title}
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
                        />
                        <Select
                            name="domain"
                            variant="standard"
                            required
                            defaultValue={domains[0]}
                        >
                            {domains.map((domain) => (
                                <MenuItem value={domain}>{domain}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ my: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : "Send"}
                </Button>
            </Box>
            <Typography variant="body2" component={Link} to="/login">
                Back to login
            </Typography>
        </Box>
    );
}

export default VerificationEmail;
