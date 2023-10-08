import AdbIcon from "@mui/icons-material/Adb";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function Layout() {
    const path = useLocation().pathname;
    const [value, setValue] = React.useState(
        path === "/" ? path : path.replace(/\/$/, "")
    );
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar color="default">
                <Toolbar>
                    <Button color="inherit" component={Link} to="/">
                        <AdbIcon sx={{ mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
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
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton
                        color="inherit"
                        size="small"
                        component={Link}
                        to="/messages"
                    >
                        <Badge badgeContent={100} color="error">
                            <MessageIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Outlet />
            <Paper
                sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
                elevation={3}
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

export default Layout;
