import { verifyEmail } from "@/api/auth";
import { removeToken } from "@/utils/auth";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useNotifications } from "@toolpad/core";
import * as React from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

export default function VerifyEmail() {
    const [searchParams, _] = useSearchParams();
    const navigate = useNavigate();
    const notifications = useNotifications();
    const [loading, setLoading] = React.useState(true);
    const [message, setMessage] = React.useState(null);

    const token = searchParams.get("token");

    const verify = React.useCallback(
        (token, signal) => {
            if (!token) {
                let msg = "Invalid Request";
                notifications.show(msg, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
                setLoading(false);
                setMessage(msg);
                return;
            }

            removeToken();
            verifyEmail(token, { signal })
                .then((response) => {
                    if (response.status == 200) {
                        notifications.show("Email Verified", {
                            severity: "success",
                            autoHideDuration: 3000,
                        });
                        navigate("/login");
                    } else throw new Error(response.message);
                })
                .catch((error) => {
                    if (signal && signal.aborted) return;
                    let msg = error.message || "Email Verification Failed";
                    notifications.show(msg, {
                        severity: "error",
                        autoHideDuration: 5000,
                    });
                    setMessage(msg);
                })
                .finally(() => setLoading(false));
        },
        [navigate, notifications]
    );

    React.useEffect(() => {
        let controller = new AbortController();
        verify(token, controller.signal);
        return () => controller.abort();
    }, [token, verify, notifications]);

    return (
        <Box
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Box
                padding={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
                maxWidth={400}
            >
                <Typography
                    variant="h4"
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                >
                    USTC Market
                </Typography>
                {loading && <Typography>Verifying Email...</Typography>}
                {message && (
                    <>
                        <Typography
                            variant="body2"
                            color="error"
                            textAlign="center"
                        >
                            Email Verification Failed - {message}
                        </Typography>
                        <Typography variant="body2" textAlign="center">
                            <Link to="/resend-verification">
                                Resend Verification Mail
                            </Link>
                        </Typography>
                    </>
                )}
            </Box>
            <Backdrop open={loading}>
                <CircularProgress />
            </Backdrop>
        </Box>
    );
}
