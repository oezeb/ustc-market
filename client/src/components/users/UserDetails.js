import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";

import { ItemListContent } from "components/items/ItemList";

function UserDetails(props) {
    const { id } = props;
    const [user, setUser] = React.useState(undefined);

    React.useEffect(() => {
        fetch(`/api/users/${id}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((user) => setUser(user))
            .catch((err) => console.error(err));
    }, [id]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box position="sticky" top={0} zIndex={1} p={1}>
                <Toolbar />
                <Box
                    sx={{
                        color: "inherit",
                        textDecoration: "inherit",
                        display: "flex",
                    }}
                >
                    <Avatar
                        src={user?.avatar}
                        sx={{ width: 50, height: 50, mr: 2 }}
                    />
                    <Typography sx={{ fontWeight: "bold" }}>
                        {user ? (
                            user.name || "Anonymous"
                        ) : (
                            <Skeleton width={100} />
                        )}
                    </Typography>
                </Box>
            </Box>
            <ItemListContent owner={id} />
            <Toolbar />
        </Box>
    );
}

export default UserDetails;
