import BorderColor from "@mui/icons-material/BorderColor";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import { useNavigate } from "react-router-dom";

import { apiRoutes } from "api";
import { useAuth } from "components/auth/AuthProvider";
import ImageBackdrop from "components/ImageBackdrop";

function ProfileEdit() {
    const { user, login, updateUser } = useAuth();
    const navigate = useNavigate();
    const [image, setImage] = React.useState(`/api/${user.avatar}`);
    const [openAvatar, setOpenAvatar] = React.useState(false); // full screen avatar
    const [open, setOpen] = React.useState(false); // Snackbar
    const [msg, setMsg] = React.useState(""); // Snackbar
    const [loading, setLoading] = React.useState(false); // submit button

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

    const uploadAvatar = async (avatar) => {
        const formData = new FormData();
        formData.append("image", avatar);

        const res = await fetch(apiRoutes.uploadImages, {
            method: "POST",
            body: formData,
        });
        if (!res.ok) throw res;
        const data = await res.json();
        return data[0];
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = {};
        data.name = formData.get("name").trim();

        const avatar = formData.get("avatar");
        const password = formData.get("password").trim();
        const newPassword = formData.get("newPassword").trim();
        const confirmPassword = formData.get("confirmPassword").trim();

        try {
            data.avatar = await uploadAvatar(avatar);
            if (newPassword || confirmPassword) {
                if (!password)
                    throw new Error("Please enter your current password");
                if (newPassword !== confirmPassword)
                    throw new Error(
                        "New password and confirm password do not match"
                    );

                const res = await login(user.username, password);
                if (!res) throw new Error("Incorrect password");

                data.password = newPassword;
            }

            const res = await fetch(apiRoutes.profile, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw res;
            await updateUser();
            navigate(`/profile`);
        } catch (err) {
            console.error(err);
            setMsg(err.message);
            setOpen(true);
        }

        setLoading(false);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
            <Toolbar />
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box width="60%">
                    <TextField
                        label="Username"
                        variant="standard"
                        fullWidth
                        size="small"
                        defaultValue={user.username}
                        disabled
                    />
                    <TextField
                        label="Email"
                        variant="standard"
                        fullWidth
                        size="small"
                        defaultValue={user.email}
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
            {[
                ["password", "Old Password"],
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
                {loading ? <CircularProgress size={24} /> : "Save"}
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
            <ImageBackdrop
                open={openAvatar}
                setOpen={setOpenAvatar}
                imageURL={image}
            />
        </Box>
    );
}

export default ProfileEdit;
