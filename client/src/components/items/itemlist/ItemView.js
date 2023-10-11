import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link } from "react-router-dom";

import { apiRoutes } from "api";

const soldIcon = require("sold.icon.png");

const ItemView = ({ item }) => {
    if (!item) return null;
    return (
        <ImageListItem
            component={Link}
            to={`/items/${item._id}`}
            sx={{ color: "inherit", textDecoration: "inherit" }}
        >
            <Image image={item?.images?.[0]} />
            <ImageListItemBar
                position="below"
                title={item.description}
                subtitle={<ImageCaption item={item} />}
            />
        </ImageListItem>
    );
};

const Image = ({ image }) => {
    const [error, setError] = React.useState(false);

    const onError = (event) => {
        setError(true);
    };

    if (image && !error) {
        return (
            <img
                src={`/api/${image}`}
                loading="lazy"
                alt="item"
                onError={onError}
                style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    width: "100%",
                }}
            />
        );
    } else return <ImagePlaceholder />;
};

const ImageCaption = ({ item }) => {
    if (!item) return null;
    return (
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
            <Profile userId={item.owner} />
        </Box>
    );
};

const Profile = ({ userId }) => {
    const [user, setUser] = React.useState(undefined);
    React.useEffect(() => {
        fetch(apiRoutes.users + "/" + userId)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((user) => setUser(user))
            .catch((err) => {
                console.error(err);
                setUser(null);
            });
    }, [userId]);

    if (!user) return user === undefined ? <ProfileSkeleton /> : null;

    return (
        <Box
            component={Link}
            to={`/users/${user._id}`}
            sx={{
                color: "inherit",
                textDecoration: "inherit",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Avatar
                src={user.avatar ? `/api/${user.avatar}` : undefined}
                sx={{
                    width: 20,
                    height: 20,
                    mr: 1,
                }}
            />
            {user.name || "Anonymous"}
        </Box>
    );
};

export const ItemViewSkeleton = () => (
    <ImageListItem>
        <ImageSkeleton />
        <ImageListItemBar
            position="below"
            title={<Skeleton />}
            subtitle={<ImageCaptionSkeleton />}
        />
    </ImageListItem>
);

const ImagePlaceholder = () => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
            backgroundColor: "grey.200",
            borderRadius: "10px",
            overflow: "hidden",
            width: "100%",
        }}
    >
        <QuestionMarkIcon fontSize="large" />
    </Box>
);

const ImageSkeleton = () => (
    <Box sx={{ borderRadius: "10px", overflow: "hidden", width: "100%" }}>
        <Skeleton variant="rectangular" height={200} width="100%" />
    </Box>
);

const ImageCaptionSkeleton = () => (
    <Box>
        <Typography variant="h6">
            <Skeleton variant="text" width={70} />
        </Typography>
        <ProfileSkeleton />
    </Box>
);

const ProfileSkeleton = () => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
        }}
    >
        <Skeleton variant="circular" sx={{ mr: 1, width: 20, height: 20 }} />
        <Skeleton variant="text" width={70} />
    </Box>
);

export default ItemView;
