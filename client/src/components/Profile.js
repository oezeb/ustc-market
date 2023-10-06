import { Avatar, Box, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../AuthProvider";
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from "@mui/material";

function Profile() {
    const { user } = useAuth();

    return (
        <Box>
            <Toolbar />
            <Box display='flex'>
                <Avatar sx={{ width: 100, height: 100 }} src={user.avatar ? `/api/${user.avatar}`: undefined} />
                <Box ml={2}>
                    <Box display='flex'>
                        <Typography sx={{ fontWeight: 'bold' }} variant='h6'>{user.name}</Typography>
                        <IconButton size="small"><EditIcon fontSize="inherit" /></IconButton>
                    </Box>
                    <Typography variant='caption'>{user.username}</Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default Profile;