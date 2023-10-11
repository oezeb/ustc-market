import ForumIcon from "@mui/icons-material/Forum";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "components/auth/AuthProvider";
import { Skeleton } from "@mui/material";
import { apiRoutes } from "api";

const OwnerProfile = ({ ownerId, itemId }) => {
    const { user } = useAuth();
    const [owner, setOwner] = React.useState(undefined);

    React.useEffect(() => {
        if (!ownerId) return setOwner(null);

        fetch(apiRoutes.users + "/" + ownerId)
            .then((res) => res.ok && res.json())
            .then((user) => setOwner(user))
            .catch((err) => {
                console.error(err);
                setOwner(null);
            });
    }, [ownerId]);

    if (!owner) return owner === undefined ? <OwnerProfileSkeleton /> : null;
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 1,
            }}
        >
            <Box
                component={Link}
                to={`/users/${owner._id}`}
                sx={{
                    color: "inherit",
                    textDecoration: "inherit",
                    display: "flex",
                }}
            >
                <Avatar
                    src={owner?.avatar}
                    sx={{ width: 50, height: 50, mr: 2 }}
                />
                <Typography sx={{ fontWeight: "bold" }}>
                    {owner.name || "Anonymous"}
                </Typography>
            </Box>
            <Chip
                component={Link}
                to={`/messages/${owner._id}/${itemId}`}
                disabled={user._id === owner._id}
                onClick={() => {}}
                icon={<ForumIcon fontSize="small" />}
                label="Chat"
                sx={{ alignSelf: "center" }}
            />
        </Box>
    );
};

export const OwnerProfileSkeleton = () => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 1,
        }}
    >
        <Box sx={{ display: "flex" }}>
            <Skeleton variant="circular" width={50} height={50} mr={2} />
            <Typography sx={{ fontWeight: "bold" }}>
                <Skeleton width={100} />
            </Typography>
        </Box>
        <Box sx={{ borderRadius: 5, overflow: "hidden", alignSelf: "center" }}>
            <Skeleton variant="rectangular" width={70} height={30} />
        </Box>
    </Box>
);

export default OwnerProfile;
