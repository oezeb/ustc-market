import { Alert, Snackbar } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useNavigate } from "react-router-dom";

import AddEditItem from "./AddEditItem";

import { apiRoutes } from "api";

function AddItem() {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false); // snackbar

    const handleSubmit = async (data) => {
        try {
            let res = await fetch(apiRoutes.items, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw res;
            let item = await res.json();
            navigate(`/items/${item._id}`);
        } catch (err) {
            console.error(err);
            setOpen(true);
        }
    };

    return (
        <Box>
            <AddEditItem onSubmit={handleSubmit} />
            <Snackbar open={open} autoHideDuration={6000} onClose={setOpen}>
                <Alert
                    onClose={setOpen}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    Error submitting item
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default AddItem;
