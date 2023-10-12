import BlockIcon from "@mui/icons-material/Block";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ItemListContent, {
    ItemListContentSkeleton,
} from "components/items/itemlist/ItemListContent";
import React from "react";
import { Button, CircularProgress } from "@mui/material";

import { apiRoutes } from "api";
import { useAuth } from "components/auth/AuthProvider";
import { useSnackbar } from "components/SnackbarProvider";

function UserDetails(props) {
    const auth = useAuth();
    const { id } = props;
    const [user, setUser] = React.useState(undefined);

    React.useEffect(() => {
        fetch(apiRoutes.users + `/${id}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((user) => setUser(user))
            .catch((err) => console.error(err));
    }, [id]);

    if (!user) return user === undefined ? <UserDetailsSkeleton /> : null;

    const UserAvatar = ({ user }) => (
        <Avatar
            src={user.avatar ? `/api/${user.avatar}` : undefined}
            style={{ width: 50, height: 50 }}
        />
    );

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
                <Box
                    sx={{
                        color: "inherit",
                        textDecoration: "inherit",
                        display: "flex",
                    }}
                >
                    <Box mr={1}>
                        <UserAvatar user={user} />
                    </Box>
                    <Typography sx={{ fontWeight: "bold" }}>
                        {user.name || "Anonymous"}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    {auth.user._id !== user._id && (
                        <BlockUserButton user={user} />
                    )}
                </Box>
            </Box>
            <ItemListContent owner={id} />
            <Toolbar />
        </Box>
    );
}

const BlockUserButton = ({ user }) => {
    const auth = useAuth();
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = React.useState(false);
    const blocked = auth.user.blockedUsers.includes(user._id);

    const handleClick = () => {
        setLoading(true);

        const blockedUsers = auth.user.blockedUsers;
        if (blocked) {
            blockedUsers.splice(blockedUsers.indexOf(user._id), 1);
        } else {
            blockedUsers.push(user._id);
        }

        fetch(apiRoutes.profile, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ blockedUsers }),
        })
            .then((res) => res.ok || Promise.reject(res))
            .then(async () => {
                auth.user = await auth.updateUser();
                showSnackbar(
                    `${blocked ? "Unblocked" : "Blocked"} ${user.name}`,
                    "success",
                    5000
                );
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                showSnackbar(
                    `Error ${blocked ? "unblocking" : "blocking"} ${user.name}`,
                    "error",
                    5000
                );
                setLoading(false);
            });
    };

    if (loading) return <CircularProgress size={20} sx={{ mr: 1 }} />;

    return (
        <Button
            variant="text"
            color={blocked ? "inherit" : "error"}
            onClick={handleClick}
            endIcon={<BlockIcon />}
            size="small"
        >
            {blocked ? "Unblock user" : "Block user"}
        </Button>
    );
};

const UserDetailsSkeleton = () => (
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
            <Box
                sx={{
                    color: "inherit",
                    textDecoration: "inherit",
                    display: "flex",
                }}
            >
                <Skeleton variant="circular" width={50} height={50} mr={2} />
                <Typography sx={{ fontWeight: "bold" }}>
                    <Skeleton width={100} />
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box display="flex" alignItems="center" color="error.main">
                    Block user
                    <BlockIcon sx={{ ml: 1 }} />
                </Box>
            </Box>
        </Box>
        <ItemListContentSkeleton />
        <Toolbar />
    </Box>
);

export default UserDetails;
