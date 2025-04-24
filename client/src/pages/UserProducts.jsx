import { getProducts } from "@/api/product";
import { getUserById } from "@/api/user";
import ProductsComponent from "@/components/Products";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNotifications } from "@toolpad/core";
import * as React from "react";
import { useParams, useSearchParams } from "react-router";

export default function UserProducts() {
    const { id } = useParams();
    const [user, setUser] = React.useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const notifications = useNotifications();

    const fetchUser = React.useCallback(
        (signal) => {
            getUserById(id, { signal })
                .then((response) => {
                    if (response.status !== 200)
                        throw new Error(response.message);
                    setUser(response.data);
                })
                .catch((error) => {
                    if (signal && signal.aborted) return;
                    let msg = error.message || "Error getting user info";
                    notifications.show(msg, {
                        severity: "error",
                        autoHideDuration: 5000,
                    });
                });
        },
        [notifications, id]
    );

    React.useEffect(() => {
        const controller = new AbortController();
        fetchUser(controller.signal);
        return () => controller.abort();
    }, [fetchUser]);

    return (
        <Box>
            <Box position="sticky" top={5} zIndex={1}>
                <Stack direction="row" spacing={1} component={Paper}>
                    <Avatar />
                    <Typography>{user?.name || "Anonymous"}</Typography>
                </Stack>
            </Box>
            <ProductsComponent
                getProducts={getProducts}
                params={{ userId: id }}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
        </Box>
    );
}
