import BorderColorIcon from "@mui/icons-material/BorderColor";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ForumIcon from "@mui/icons-material/Forum";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import Skeleton from "@mui/material/Skeleton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "AuthProvider";
import { apiRoutes } from "api";

const soldIcon = require("sold.icon.png");

function ItemDetails(props) {
    const { user } = useAuth();
    const [item, setItem] = React.useState(undefined);
    const [owner, setOwner] = React.useState(undefined);
    const [tagsExpanded, setTagsExpanded] = React.useState(false);

    React.useEffect(() => {
        fetch(apiRoutes.items + "/" + props.id)
            .then((res) => res.json())
            .then((item) => setItem(item))
            .catch((err) => {
                console.error(err);
                setItem(null);
            });
    }, [props.id]);

    React.useEffect(() => {
        if (item) {
            fetch(apiRoutes.users + "/" + item.owner)
                .then((res) => res.ok && res.json())
                .then((user) => setOwner(user))
                .catch((err) => {
                    console.error(err);
                    setOwner(null);
                });
        }
    }, [item]);

    const OwnerProfile = (props) => {
        const { owner } = props;
        if (owner)
            return (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 1,
                    }}
                >
                    <Box
                        component={Link}
                        to={`/users/${owner._id}`}
                        sx={{
                            color: "inherit",
                            textDecoration: "inherit",
                            display: "flex",
                        }}
                    >
                        <Avatar
                            src={owner?.avatar}
                            sx={{ width: 50, height: 50, mr: 2 }}
                        />
                        <Typography sx={{ fontWeight: "bold" }}>
                            {owner.name || "Anonymous"}
                        </Typography>
                    </Box>
                    <Chip
                        component={Link}
                        to={`/messages/${owner._id}/${item._id}`}
                        disabled={user._id === owner._id}
                        onClick={() => {}}
                        icon={<ForumIcon fontSize="small" />}
                        label="Chat"
                        sx={{ alignSelf: "center" }}
                    />
                </Box>
            );
        else
            return (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 1,
                    }}
                >
                    <Box sx={{ display: "flex" }}>
                        <Avatar sx={{ width: 50, height: 50, mr: 2 }} />
                        <Typography sx={{ fontWeight: "bold" }}>
                            <Skeleton width={100} />
                        </Typography>
                    </Box>
                    <Chip
                        disabled
                        icon={<ForumIcon fontSize="small" />}
                        label="Chat"
                        sx={{ alignSelf: "center" }}
                    />
                </Box>
            );
    };

    if (item)
        return (
            <Box>
                <Toolbar />
                <OwnerProfile owner={owner} />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 1,
                    }}
                >
                    <Box>
                        <Typography
                            component="span"
                            variant="body2"
                            color="error"
                            sx={{ fontWeight: "bold" }}
                        >
                            ¥
                        </Typography>
                        <Typography
                            component="span"
                            variant="h4"
                            color="error"
                            sx={{ fontWeight: "bold", mr: 2 }}
                        >
                            {item.price ? item.price : "0"}
                        </Typography>
                        {item.sold && (
                            <img src={soldIcon} alt="sold" width="50" />
                        )}
                    </Box>
                    <Typography
                        component="span"
                        variant="body3"
                        color="text.secondary"
                        sx={{ alignSelf: "center" }}
                    >
                        Last updated {lastUpdatedText(item.updatedAt)}
                    </Typography>
                </Box>
                {user._id === item.owner && (
                    <Box
                        component={Link}
                        to={`/items/${item._id}/edit`}
                        sx={{
                            mx: 1,
                            px: 1,
                            backgroundColor: "grey.200",
                            borderRadius: 5,
                            overflow: "hidden",
                            width: "fit-content",
                        }}
                    >
                        <BorderColorIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                        Edit item
                    </Box>
                )}
                <Box sx={{ p: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {item.description}
                    </Typography>
                </Box>
                {item.tags && (
                    <ListItem dense disablePadding sx={{ p: 1 }}>
                        <Box sx={{ flexGrow: 1 }} />
                        <Collapse
                            in={tagsExpanded}
                            timeout="auto"
                            collapsedSize="24px"
                        >
                            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                                {item.tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        component={Link}
                                        to={`/items?tags=${tag}`}
                                        onClick={() => {}}
                                        sx={{
                                            color: "inherit",
                                            textDecoration: "inherit",
                                            mr: 1,
                                            mb: 1,
                                        }}
                                        size="small"
                                        label={"#" + tag}
                                    />
                                ))}
                            </Box>
                        </Collapse>
                        <IconButton
                            sx={{ p: 0 }}
                            onClick={() => setTagsExpanded((prev) => !prev)}
                        >
                            {tagsExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </ListItem>
                )}
                {item.images && (
                    <Box
                        sx={{ borderRadius: "10px", overflow: "hidden", m: 1 }}
                    >
                        <ImageLayout images={item.images} />
                    </Box>
                )}
                <Toolbar />
            </Box>
        );
    else if (item === undefined)
        return (
            <Box
                display="flex"
                flexDirection="column"
                height={`calc(100vh - 20px)`}
            >
                <Toolbar />
                <OwnerProfile />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 1,
                    }}
                >
                    <Typography
                        component="span"
                        variant="h4"
                        color="error"
                        sx={{ fontWeight: "bold" }}
                    >
                        <Skeleton width={50} />
                    </Typography>
                    <Typography
                        component="span"
                        variant="body3"
                        color="text.secondary"
                        sx={{ alignSelf: "center" }}
                    >
                        <Skeleton width={150} />
                    </Typography>
                </Box>
                <Box sx={{ p: 1 }}>
                    <Skeleton variant="rectangular" height={100} />
                </Box>
                <Box sx={{ p: 1 }}>
                    <Skeleton />
                </Box>
                <Box
                    sx={{
                        borderRadius: "10px",
                        overflow: "hidden",
                        m: 1,
                        flexGrow: 1,
                    }}
                >
                    <Skeleton variant="rectangular" height="100%" />
                </Box>
                <Toolbar />
            </Box>
        );
    else
        return (
            <Box>
                <Toolbar />
                <Typography variant="h4" color="text.secondary" align="center">
                    Item not found
                </Typography>
                <Toolbar />
            </Box>
        );
}

const lastUpdatedText = (date) => {
    const diff = Date.now() - Date.parse(date);
    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes < 1) return "Just now";
    if (minutes < 60)
        return `${minutes === 1 ? "a minute" : minutes + " minutes"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours === 1 ? "an hour" : hours + " hours"} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days === 1 ? "a day" : days + " days"} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks === 1 ? "a week" : weeks + " weeks"} ago`;
    const months = Math.floor(days / 30);
    if (months < 12)
        return `${months === 1 ? "a month" : months + " months"} ago`;
    const years = Math.floor(days / 365);
    return `${years === 1 ? "a year" : years + " years"} ago`;
};

const ImageLayout = (props) => {
    const { images } = props;
    const [open, setOpen] = React.useState(false);
    const [currentImage, setCurrentImage] = React.useState(0);

    const onClickOpenDialog = (index) => {
        setCurrentImage(index);
        setOpen(true);
    };

    const Img = (props) => {
        const { index } = props;
        return (
            <img
                loading="lazy"
                src={`/api/${images[index]}`}
                alt="item"
                onClick={() => onClickOpenDialog(index)}
                {...props}
            />
        );
    };

    const ImageDialog = () => (
        <FullScreenImageDialog
            open={open}
            setOpen={setOpen}
            imageURL={`/api/${images[currentImage]}`}
        />
    );

    if (images.length <= 0) return null;

    if (images.length === 1)
        return (
            <div style={{ p: 1, m: 1 }}>
                <Img index={0} style={{ width: "100%" }} />
                <ImageDialog />
            </div>
        );

    if (images.length === 2)
        return (
            <div style={{ p: 1, m: 1 }}>
                <Img index={0} style={{ width: "100%" }} />
                <Img index={1} style={{ width: "100%" }} />
                <ImageDialog />
            </div>
        );

    if (images.length === 3)
        return (
            <div style={{ p: 1, m: 1 }}>
                <Img index={0} style={{ width: "100%" }} />
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Img index={1} style={{ width: "49.5%" }} />
                    <Img index={2} style={{ width: "49.5%" }} />
                </div>
                <ImageDialog />
            </div>
        );

    if (images.length === 4)
        return (
            <div style={{ p: 1, m: 1 }}>
                <Img index={0} style={{ width: "100%" }} />
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Img index={1} style={{ width: "32.5%" }} />
                    <Img index={2} style={{ width: "32.5%" }} />
                    <Img index={3} style={{ width: "32.5%" }} />
                </div>
                <ImageDialog />
            </div>
        );

    return (
        <div style={{ p: 1, m: 1 }}>
            <Img index={0} style={{ width: "100%" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Img index={1} style={{ width: "49.5%" }} />
                <Img index={2} style={{ width: "49.5%" }} />
            </div>
            <div style={{ height: 4 }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Img index={3} style={{ width: "49.5%" }} />
                <Img index={4} style={{ width: "49.5%" }} />
            </div>
            <ImageDialog />
        </div>
    );
};

export const FullScreenImageDialog = (props) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const { open, setOpen, imageURL } = props;

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{ style: { backgroundColor: "rgba(0,0,0,0.6)" } }}
        >
            <DialogContent
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 0,
                    m: 0,
                    height: "100vh",
                    position: "relative",
                }}
            >
                <IconButton
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                    }}
                    onClick={() => setOpen(false)}
                >
                    <CloseIcon color="primary" fontSize="large" />
                </IconButton>
                <img
                    loading="lazy"
                    src={imageURL}
                    alt="item"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
                <IconButton
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        zIndex: 1,
                    }}
                    component={Link}
                    to={imageURL}
                    target="_blank"
                >
                    <DownloadIcon color="primary" fontSize="large" />
                </IconButton>
            </DialogContent>
        </Dialog>
    );
};

export default ItemDetails;
