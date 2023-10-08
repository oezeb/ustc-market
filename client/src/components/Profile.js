import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useAuth } from "../AuthProvider";

function Profile() {
    const { user } = useAuth();

    return (
        <Box>
            <Toolbar />
            <Paper>
                <Box sx={{ display: "flex", pt: 2, pb: 2 }}>
                    <Avatar
                        sx={{ width: 100, height: 100 }}
                        src={user.avatar ? `/api/${user.avatar}` : undefined}
                    />
                    <Box
                        sx={{ ml: 2, display: "flex", flexDirection: "column" }}
                    >
                        <ListItemText secondary={user.username} sx={{ m: 0 }}>
                            <Typography
                                component="span"
                                sx={{ fontWeight: "bold" }}
                                variant="h6"
                            >
                                {user.name}
                            </Typography>
                            <IconButton size="small">
                                <EditIcon fontSize="inherit" />
                            </IconButton>
                        </ListItemText>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box display="flex">
                            <IconButton size="small">
                                <LogoutIcon fontSize="inherit" />
                                <Typography ml={0.5} variant="caption">
                                    Logout
                                </Typography>
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Paper>
            <ListItem divider>
                <Typography variant="h6">My Items</Typography>
            </ListItem>
        </Box>
    );
}

export default Profile;
