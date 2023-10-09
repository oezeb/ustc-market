import React from "react";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Input,
    InputLabel,
    Snackbar,
    TextField,
    Toolbar,
} from "@mui/material";
import BorderColor from "@mui/icons-material/BorderColor";
import { useAuth } from "AuthProvider";
import { apiRoutes } from "api";
import { useNavigate } from "react-router-dom";
import { FullScreenImageDialog } from "./items/ItemDetails";

function ProfileEdit() {
    const { user, login, updateUser } = useAuth();
    const navigate = useNavigate();
    const [image, setImage] = React.useState(`/api/${user.avatar}`);
    const [openAvatar, setOpenAvatar] = React.useState(false); // full screen avatar
    const [open, setOpen] = React.useState(false); // Snackbar
    const [msg, setMsg] = React.useState(""); // Snackbar

    const onUploadImage = (event) => {
        if (!event.target.files.length) return;

        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const image = event.target.result;
            setImage(image);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const requestForm = new FormData();

        requestForm.set("name", formData.get("name").trim());

        const password = formData.get("password").trim();
        const newPassword = formData.get("newPassword").trim();
        const confirmPassword = formData.get("confirmPassword").trim();

        if (newPassword || confirmPassword) {
            if (!password) {
                setMsg("Please enter your current password");
                setOpen(true);
                return;
            }
            if (newPassword !== confirmPassword) {
                setMsg("New password and confirm password do not match");
                setOpen(true);
                return;
            }

            const res = login(user.username, password);
            if (!res) {
                setMsg("Incorrect password");
                setOpen(true);
                return;
            }

            requestForm.set("password", newPassword);
        }

        const avatar = formData.get("avatar");
        if (avatar) requestForm.append("avatar", avatar);

        fetch(apiRoutes.profile, {
            method: "PATCH",
            body: requestForm,
        })
            .then((res) => {
                if (res.ok) {
                    updateUser();
                    navigate(`/profile`);
                } else {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
            })
            .catch((err) => {
                console.error(err);
                setMsg("Error updating profile. Please try again.");
                setOpen(true);
            });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
            <Toolbar />
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box width="60%">
                    <TextField
                        name="name"
                        label="Name"
                        variant="standard"
                        fullWidth
                        margin="normal"
                        size="small"
                        defaultValue={user.name}
                        placeholder="Anonymous"
                    />
                    <TextField
                        label="Username"
                        variant="standard"
                        fullWidth
                        margin="normal"
                        size="small"
                        defaultValue={user.username}
                        disabled
                    />
                </Box>
                <Box width="40%" display="flex" justifyContent="center">
                    <Avatar
                        src={image}
                        sx={{ m: 1, width: 100, height: 100 }}
                        onClick={() => setOpenAvatar(true)}
                    />
                    <InputLabel htmlFor="avatar" sx={{ alignSelf: "end" }}>
                        <Input
                            id="avatar"
                            name="avatar"
                            type="file"
                            inputProps={{
                                accept: "image/*",
                            }}
                            sx={{ display: "none" }}
                            onChange={onUploadImage}
                        />
                        <BorderColor fontSize="small" />
                    </InputLabel>
                </Box>
            </Box>
            {[
                ["password", "Password"],
                ["newPassword", "New Password"],
                ["confirmPassword", "Confirm Password"],
            ].map(([name, label]) => (
                <TextField
                    key={name}
                    name={name}
                    label={label}
                    variant="standard"
                    fullWidth
                    margin="normal"
                    size="small"
                    type="password"
                />
            ))}
            <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
                Save
            </Button>
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
                    {msg}
                </Alert>
            </Snackbar>
            <FullScreenImageDialog
                open={openAvatar}
                setOpen={setOpenAvatar}
                imageURL={image}
            />
        </Box>
    );
}

export default ProfileEdit;
