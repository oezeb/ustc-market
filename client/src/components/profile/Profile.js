import BorderColor from "@mui/icons-material/BorderColor";
import LogoutIcon from "@mui/icons-material/Logout";
import { Chip, IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link } from "react-router-dom";

import { apiRoutes } from "api";
import { useAuth } from "components/auth/AuthProvider";
import ItemListContent from "components/items/itemlist/ItemListContent";
import ImageBackdrop from "components/ImageBackdrop";

function Profile() {
    const { user } = useAuth();
    const [open, setOpen] = React.useState(false); // full screen avatar

    const onLogout = () => {
        fetch(apiRoutes.logout, { method: "POST" })
            .then((res) => res.ok && window.location.reload())
            .catch((err) => console.error(err));
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1,
                    p: 1,
                    bgcolor: "background.paper",
                }}
            >
                <Toolbar />
                <Box color="inherit" textDecoration="inherit" display="flex">
                    <Avatar
                        src={`/api/${user?.avatar}`}
                        sx={{ width: 64, height: 64, mr: 2 }}
                        onClick={() => setOpen(true)}
                    />
                    <Box display="flex" flexDirection="column" maxWidth={300}>
                        <ListItemText secondary={user.username} sx={{ m: 0 }}>
                            <Typography
                                component="span"
                                sx={{ fontWeight: "bold" }}
                            >
                                {user.name || "Anonymous"}
                            </Typography>
                            <IconButton size="small" component={Link} to="edit">
                                <BorderColor fontSize="inherit" />
                            </IconButton>
                        </ListItemText>
                        <Box sx={{ flexGrow: 1 }} />
                        <Typography color="text.secondary" variant="body2">
                            {user.email}
                        </Typography>
                    </Box>
                    <Box flexGrow={1} />
                    <Chip
                        onClick={onLogout}
                        icon={<LogoutIcon fontSize="small" />}
                        label="Logout"
                        sx={{ alignSelf: "center" }}
                    />
                </Box>
            </Box>
            <ItemListContent owner={user._id} />
            <Toolbar />
            {user?.avatar && (
                <ImageBackdrop
                    open={open}
                    setOpen={setOpen}
                    imageURL={`/api/${user.avatar}`}
                />
            )}
        </Box>
    );
}

export default Profile;
