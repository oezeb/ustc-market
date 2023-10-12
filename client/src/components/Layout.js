import AdbIcon from "@mui/icons-material/Adb";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import { apiRoutes } from "api";

function Layout() {
    const path = useLocation().pathname;
    const navigate = useNavigate();
    const [value, setValue] = React.useState(null);

    const hideMessageIcon = path.startsWith("/messages");
    React.useEffect(() => {
        switch (path) {
            case "/":
                setValue("/");
                break;
            case "/items/add":
            case "/items/add/":
                setValue("/items/add");
                break;
            case "/profile":
            case "/profile/":
                setValue("/profile");
                break;
            default:
                setValue(null);
        }
    }, [path]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar color="default">
                <Toolbar>
                    {value ? (
                        <Button color="inherit" component={Link} to="/">
                            <AdbIcon sx={{ mr: 1 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    mr: 2,
                                    fontFamily: "monospace",
                                    fontWeight: 700,
                                    letterSpacing: ".3rem",
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                LOGO
                            </Typography>
                        </Button>
                    ) : (
                        <IconButton
                            color="inherit"
                            onClick={() => navigate(-1)}
                            sx={{ mr: 2 }}
                        >
                            <ArrowBackIosIcon />
                        </IconButton>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    {!hideMessageIcon && <MessageIconBadge />}
                </Toolbar>
            </AppBar>
            <Outlet />
            <Paper
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1,
                    elevation: 3,
                }}
            >
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                >
                    <BottomNavigationAction
                        component={Link}
                        label="Home"
                        to="/"
                        value="/"
                        icon={<HomeIcon />}
                    />
                    <BottomNavigationAction
                        component={Link}
                        to="/items/add"
                        value="/items/add"
                        label="Add"
                        icon={<AddIcon />}
                    />
                    <BottomNavigationAction
                        component={Link}
                        label="Profile"
                        to="/profile"
                        value="/profile"
                        icon={<PersonIcon />}
                    />
                </BottomNavigation>
            </Paper>
        </Box>
    );
}

const MessageIconBadge = () => {
    const { user } = useAuth();
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        fetch(apiRoutes.messageCount + `?receiver=${user._id}&read=false`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data) => setCount(data))
            .catch((err) => console.log(err));
    }, [user]);

    return (
        <IconButton
            color="inherit"
            size="small"
            component={Link}
            to="/messages"
        >
            <Badge badgeContent={count} color="error">
                <MessageIcon />
            </Badge>
        </IconButton>
    );
};

export default Layout;
