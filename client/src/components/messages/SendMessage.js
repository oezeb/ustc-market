import SendIcon from "@mui/icons-material/Send";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import { Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import { apiRoutes } from "api";
import { useSnackbar } from "components/SnackbarProvider";
import { useAuth } from "components/auth/AuthProvider";

const soldIcon = require("sold.icon.png");

function SendMessage() {
    const { itemId, userId } = useParams();
    const { showSnackbar } = useSnackbar();
    const bottomRef = React.useRef(null);
    const { user } = useAuth();
    const [message, setMessage] = React.useState("");
    const [messages, setMessages] = React.useState(undefined);
    const [otherUser, setOtherUser] = React.useState(undefined);

    const maxMessages = 100;

    React.useEffect(() => {
        const refreshInterval = 60 * 1000; // 1 minute
        const interval = setInterval(
            () => setMessages(undefined),
            refreshInterval
        );
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        if (!messages || !otherUser) return;
        bottomRef?.current.scrollIntoView(false);
    }, [messages, otherUser]);

    const handleRead = (id) => {
        fetch(apiRoutes.messages + `/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ read: true }),
        })
            .then((res) => res.ok || Promise.reject(res))
            .catch((err) => console.log(err));
    };

    React.useEffect(() => {
        if (messages) return;

        const q = `?item=${itemId}&otherUser=${userId}&limit=${maxMessages}`;
        fetch(apiRoutes.messages + q)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data) => {
                setMessages(data);
                data.forEach((msg) => {
                    if (msg.receiver === user._id && !msg.read) {
                        handleRead(msg._id);
                    }
                });
            })
            .catch((err) => console.log(err));
    }, [itemId, userId, messages, user._id]);

    React.useEffect(() => {
        fetch(apiRoutes.users + `/${userId}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data) => setOtherUser(data))
            .catch((err) => console.log(err));
    }, [userId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const content = formData.get("message");

        fetch(apiRoutes.messages, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content, item: itemId, receiver: userId }),
        })
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data) => {
                setMessage("");
                if (data.blocked) {
                    showSnackbar(
                        "Message not sent: you have been blocked by this user",
                        "error",
                        5000
                    );
                } else setMessages([...messages, data]);
            })
            .catch((error) => {
                console.error("Error:", error);
                showSnackbar("Error sending message", "error", 5000);
            });
    };

    const UserAvatar = ({ user, message, ...sxProps }) => (
        <Avatar
            component={Link}
            to={`/users/${user._id}`}
            src={user.avatar ? `/api/${user.avatar}` : undefined}
            sx={{
                visibility: message.sender === user._id ? "visible" : "hidden",
                ...sxProps,
            }}
        />
    );

    return (
        <Box>
            <Toolbar />
            <Toolbar />
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1,
                    bgcolor: "background.paper",
                }}
            >
                <Toolbar />
                <ItemView itemId={itemId} />
            </Box>
            <List dense disablePadding>
                {messages &&
                    otherUser &&
                    messages.map((msg, index) => (
                        <ListItem key={index} alignItems="flex-start">
                            <ListItemAvatar>
                                <UserAvatar user={otherUser} message={msg} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={msg.content}
                                secondary={new Date(
                                    msg.createdAt
                                ).toLocaleString()}
                                sx={{
                                    bgcolor:
                                        msg.sender === user._id
                                            ? "primary.main"
                                            : "grey.300",
                                    borderRadius: 2.5,
                                    padding: 1,
                                }}
                            />
                            <ListItemAvatar>
                                <UserAvatar
                                    user={user}
                                    message={msg}
                                    ml="auto"
                                />
                            </ListItemAvatar>
                        </ListItem>
                    ))}
            </List>
            <Box
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 1,
                    zIndex: 1,
                    bgcolor: "background.paper",
                }}
            >
                <Box component="form" onSubmit={handleSubmit} display="flex">
                    <TextField
                        name="message"
                        size="small"
                        placeholder="Send a message..."
                        sx={{ flexGrow: 1 }}
                        required
                        autoComplete="off"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <IconButton color="primary" type="submit">
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>
            <Toolbar ref={bottomRef} />
        </Box>
    );
}

const ItemView = ({ itemId }) => {
    const [item, setItem] = React.useState(undefined);
    const [owner, setOwner] = React.useState(undefined);

    React.useEffect(() => {
        fetch(apiRoutes.items + `/${itemId}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data) => setItem(data))
            .catch((err) => console.log(err));
    }, [itemId]);

    React.useEffect(() => {
        if (!item) return;
        fetch(apiRoutes.users + `/${item.owner}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data) => setOwner(data))
            .catch((err) => console.log(err));
    }, [item]);

    if (!item || !owner) return null;

    const ImageView = ({ item }) => (
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
        <ListItem component={Link} to={`/items/${item._id}`}>
            <ListItemAvatar>
                <ImageView item={item} />
            </ListItemAvatar>
            <Box ml={1}>
                <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                    noWrap
                >
                    {item.description}
                </Typography>
                <Box>
                    <Typography component="span" variant="body2" color="error">
                        ¥
                    </Typography>
                    <Typography
                        component="span"
                        variant="h6"
                        color="error"
                        sx={{ mr: 2 }}
                    >
                        {item.price ? item.price : "0"}
                    </Typography>
                    {item.sold && <img src={soldIcon} alt="sold" width="30" />}
                </Box>
            </Box>
        </ListItem>
    );
};

export default SendMessage;
