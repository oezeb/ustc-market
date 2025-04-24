import { getUser } from "@/api/user";
import { getToken, removeToken } from "@/utils/auth";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNotifications } from "@toolpad/core";
import {
    Account,
    AccountPopoverFooter,
    AccountPopoverHeader,
    AccountPreview,
    SignOutButton,
} from "@toolpad/core/Account";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import * as React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";

export default function Layout() {
    const [session, setSession] = React.useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const notifications = useNotifications();

    const signIn = React.useCallback(
        (signal) => {
            getUser({ signal })
                .then((response) => {
                    if (response.status == 200) {
                        setSession({ user: response.data });
                    } else throw new Error(response.message);
                })
                .catch((error) => {
                    if (signal && signal.aborted) return;
                    let msg = error.message || "Failed to get profile";
                    notifications.show(msg, {
                        severity: "error",
                        autoHideDuration: 5000,
                    });
                    navigate(`/login?redirect=${location.pathname}`);
                });
        },
        [navigate, notifications, location.pathname]
    );

    const signOut = React.useCallback(() => {
        removeToken();
        setSession(null);
        navigate("/");
    }, [navigate]);

    React.useEffect(() => {
        let controller = new AbortController();
        if (getToken()) signIn(controller.signal);
        return () => controller.abort();
    }, [signIn]);

    return (
        <ReactRouterAppProvider
            authentication={{ signIn: () => signIn(null), signOut }}
            session={session}
        >
            <DashboardLayout
                hideNavigation
                slots={{
                    appTitle: AppTitle,
                    toolbarAccount: ToolbarAccount,
                }}
            >
                <PageContainer>
                    <Outlet />
                </PageContainer>
            </DashboardLayout>
        </ReactRouterAppProvider>
    );
}

const AppTitle = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            component={Link}
            to="/"
            sx={{
                textDecoration: "none",
            }}
        >
            {!location.pathname.match(/^\/(products\/?)?$/) && (
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIosIcon color="primary" />
                </IconButton>
            )}
            <Typography
                color="primary"
                whiteSpace="nowrap"
                fontSize={20}
                fontWeight={700}
                lineHeight={1}
            >
                USTC Market
            </Typography>
        </Stack>
    );
};

const ToolbarAccount = () => (
    <Account
        slots={{
            popoverContent: () => (
                <Stack>
                    <AccountPopoverHeader>
                        <AccountPreview variant="expanded" />
                    </AccountPopoverHeader>
                    <Divider />
                    <AccountPopoverFooter>
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                    textTransform: "none",
                                }}
                                LinkComponent={Link}
                                to="/profile/products"
                            >
                                My Products
                            </Button>
                            <SignOutButton />
                        </Stack>
                    </AccountPopoverFooter>
                </Stack>
            ),
        }}
    />
);
