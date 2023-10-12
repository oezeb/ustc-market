import { Box } from "@mui/material";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import React from "react";

import { apiRoutes } from "api";
import { useAuth } from "components/auth/AuthProvider";
import Conversation, { ConversationSkeleton } from "./Conversation";

function ConversationList() {
    const { user } = useAuth();
    const [messages, setMessages] = React.useState(undefined);

    React.useEffect(() => {
        fetch(apiRoutes.messages)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data) => {
                // group by item
                const grouped = data.reduce((acc, msg) => {
                    acc[msg.item] = acc[msg.item] || [];
                    acc[msg.item].push(msg);
                    return acc;
                }, {});

                const latestMessages = Object.keys(grouped)
                    .map((item) => {
                        const messages = grouped[item];
                        const latestMessage = messages[messages.length - 1];
                        const otherUser =
                            latestMessage.sender === user._id
                                ? latestMessage.receiver
                                : latestMessage.sender;
                        const unread = messages.filter(
                            (msg) => msg.receiver === user._id && !msg.read
                        ).length;
                        return { item, otherUser, latestMessage, unread };
                    })
                    .sort((a, b) => {
                        const aDate = new Date(a.latestMessage.createdAt);
                        const bDate = new Date(b.latestMessage.createdAt);
                        return bDate - aDate;
                    });

                setMessages(latestMessages);
            })
            .catch((err) => console.log(err));
    }, [user._id]);

    if (!messages)
        return messages === undefined ? <ConversationListSkeleton /> : null;

    return (
        <Box>
            <Toolbar />
            <List dense>
                {messages.map((msg) => (
                    <Conversation
                        key={msg.item}
                        itemId={msg.item}
                        otherUserId={msg.otherUser}
                        latestMessage={msg.latestMessage}
                        unread={msg.unread}
                    />
                ))}
            </List>
        </Box>
    );
}

const ConversationListSkeleton = () => (
    <div>
        <Toolbar />
        <List dense>
            {[...Array(5)].map((_, i) => (
                <ConversationSkeleton key={i} />
            ))}
        </List>
    </div>
);

export default ConversationList;
