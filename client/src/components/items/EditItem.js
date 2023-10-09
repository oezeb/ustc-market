import { Alert, Skeleton, Snackbar } from "@mui/material";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import AddEditItem from "./AddEditItem";

import { apiRoutes } from "api";
import { useAuth } from "components/auth/AuthProvider";

function EditItem() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [item, setItem] = React.useState(undefined);
    const [open, setOpen] = React.useState(false); // Snackbar

    const imgtoDataUrl = (src) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(xhr.response);
            };
            xhr.onerror = reject;
            xhr.open("GET", src);
            xhr.responseType = "blob";
            xhr.send();
        });
    };

    React.useEffect(() => {
        fetch(apiRoutes.items + `/${id}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((item) => {
                item.images = item.images.map((img) => `/api/${img}`);
                Promise.all(item.images.map(imgtoDataUrl)).then((dataUrls) => {
                    item.images = dataUrls;
                    setItem(item);
                });
            })
            .catch((err) => console.error(err));
    }, [id]);

    const handleSubmit = (formData) => {
        formData.append("replaceImages", true);
        fetch(apiRoutes.profileItems + `/${id}`, {
            method: "PATCH",
            body: formData,
        })
            .then((res) => {
                if (res.ok) {
                    navigate(`/items/${id}`);
                } else
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
            })
            .catch((err) => {
                console.error(err);
                setOpen(true);
            });
    };

    if (item) {
        if (item.owner !== user._id)
            return (
                <Box p={1}>
                    <Toolbar />
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                    >
                        <Box textAlign="center">
                            <Box fontSize={30} fontWeight="bold">
                                You are not the owner of this item
                            </Box>
                            <Box fontSize={20} fontWeight="bold">
                                You cannot edit this item
                            </Box>
                        </Box>
                    </Box>
                    <Toolbar />
                </Box>
            );
        return (
            <>
                <AddEditItem
                    onSubmit={handleSubmit}
                    {...item}
                    showSoldCheckbox
                />
                <Snackbar
                    open={open}
                    autoHideDuration={5000}
                    onClose={() => setOpen(false)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert
                        onClose={() => setOpen(false)}
                        severity="error"
                        sx={{ width: "100%" }}
                    >
                        Error updating item
                    </Alert>
                </Snackbar>
            </>
        );
    } else if (item === undefined)
        return (
            <Box p={1}>
                <Toolbar />
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={30}
                    sx={{ mb: 2 }}
                />
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={100}
                    sx={{ mb: 2 }}
                />
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={70}
                    sx={{ mb: 2 }}
                />
                <Skeleton />
                <ListItem divider>
                    <Skeleton width={70} />
                </ListItem>
                <Box display="flex">
                    {Array(3)
                        .fill()
                        .map((_, index) => (
                            <Skeleton
                                key={index}
                                variant="rectangular"
                                sx={{
                                    m: 1,
                                    width: 56,
                                    height: 56,
                                    borderRadius: 1,
                                }}
                            />
                        ))}
                </Box>
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={35}
                    sx={{ mt: 2 }}
                />
                <Toolbar />
            </Box>
        );
    else return null;
}

export default EditItem;
