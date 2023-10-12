import { Skeleton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { Link } from "react-router-dom";

import { apiRoutes } from "api";

function Conversation({ itemId, otherUserId, latestMessage, unread }) {
    const [item, setItem] = React.useState(undefined);
    const [otherUser, setOtherUser] = React.useState(undefined);

    React.useEffect(() => {
        fetch(apiRoutes.items + `/${itemId}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data) => setItem(data))
            .catch((err) => console.log(err));
    }, [itemId]);

    React.useEffect(() => {
        fetch(apiRoutes.users + `/${otherUserId}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data) => setOtherUser(data))
            .catch((err) => console.log(err));
    }, [otherUserId]);

    if (!item || !otherUser) return null;

    const UserAvatar = ({ user }) => (
        <Avatar src={user.avatar ? `/api/${user.avatar}` : undefined} />
    );

    const ItemView = ({ item }) => (
        <Box
            sx={{
                width: 56,
                height: 56,
                bgcolor: "grey.300",
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            {item.images?.length > 0 && (
                <img
                    src={`/api/${item.images[0]}`}
                    alt="item"
                    style={{ width: 56, height: 56 }}
                />
            )}
        </Box>
    );

    return (
        <ListItem
            component={Link}
            to={`/messages/${itemId}/${otherUserId}`}
            sx={{
                color: "inherit",
                textDecoration: "inherit",
            }}
        >
            <ListItemAvatar>
                <Badge badgeContent={unread} color="primary">
                    <UserAvatar user={otherUser} />
                </Badge>
            </ListItemAvatar>
            <ListItemText
                primary={otherUser.name}
                secondary={latestMessage.content}
                primaryTypographyProps={{ noWrap: true }}
                secondaryTypographyProps={{ noWrap: true }}
            />
            <ListItemAvatar>
                <ItemView item={item} />
            </ListItemAvatar>
        </ListItem>
    );
}

export const ConversationSkeleton = () => (
    <ListItem>
        <ListItemAvatar>
            <Skeleton variant="circular">
                <Avatar />
            </Skeleton>
        </ListItemAvatar>
        <ListItemText
            primary={<Skeleton variant="text" width={50} />}
            secondary={<Skeleton variant="text" width={200} />}
        />
        <ListItemAvatar>
            <Skeleton
                variant="rectangular"
                sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            />
        </ListItemAvatar>
    </ListItem>
);

export default Conversation;
