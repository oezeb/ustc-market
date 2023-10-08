import BorderColorIcon from "@mui/icons-material/BorderColor";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ForumIcon from "@mui/icons-material/Forum";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase, Paper, Skeleton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListItem from "@mui/material/ListItem";
import Pagination from "@mui/material/Pagination";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import { useAuth } from "../AuthProvider";
import { apiRoutes } from "../api";

function Items() {
    const { id } = useParams();
    return id ? <ItemDetails id={id} /> : <ItemsList />;
}

// ============================================================================
// ItemsList
// ============================================================================

function ItemsList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [items, setItems] = React.useState(undefined);
    const [itemCount, setItemCount] = React.useState(undefined);
    const [page, setPage] = React.useState(1);

    const q = searchParams.get("q");
    const tagsQuery = searchParams.get("tags");

    const itemsperPage = 10;

    React.useEffect(() => {
        const query = new URLSearchParams();
        if (q) query.append("text", q);
        if (tagsQuery) query.append("tags", tagsQuery);

        const queryText = query.size > 0 ? "?" + query.toString() : "";
        fetch(apiRoutes.itemCount + queryText)
            .then((res) => res.json())
            .then((count) => {
                setItemCount(count);

                const offset = (page - 1) * itemsperPage;
                if (offset >= count) setItems([]);
                else {
                    query.append("limit", itemsperPage);
                    query.append("offset", offset);

                    fetch(apiRoutes.items + "?" + query.toString())
                        .then((res) => res.json())
                        .then((items) => setItems(items));
                }
            })
            .catch((err) => {
                console.error(err);
                setItemCount(0);
                setItems(null);
            });
    }, [page, q, tagsQuery]);

    const onSearchSubmit = (value) => {
        let tagMatch = value.match(/#\w+/g);
        let tags = [];
        if (tagMatch) {
            tags = tagMatch.map((tag) => tag.slice(1));
            value = value.replace(/#\w+/g, "").trim();
        }

        const query = new URLSearchParams();
        if (value) query.append("q", value);
        if (tags.length > 0) query.append("tags", tags.join(","));

        navigate({ search: "?" + query.toString() });
    };

    const defaultSeach = () => {
        let value = [];
        if (q) value.push(q);
        if (tagsQuery)
            value.push(
                tagsQuery
                    .split(",")
                    .map((tag) => "#" + tag)
                    .join(" ")
            );
        return value.join(" ");
    };

    if (items)
        return (
            <Box display="flex" flexDirection="column">
                <Box position="sticky" top={0} zIndex={1}>
                    <Toolbar />
                    <SearchBar
                        onSubmit={onSearchSubmit}
                        defaultValue={defaultSeach()}
                    />
                </Box>
                <ItemImageList items={items} />
                <Pagination
                    sx={{ alignSelf: "center" }}
                    count={Math.ceil(itemCount / itemsperPage)}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                />
                <Toolbar />
            </Box>
        );
    else if (items === undefined)
        return (
            <Box
                display="flex"
                flexDirection="column"
                height={`calc(100vh - 20px)`}
            >
                <Box position="sticky" top={0} zIndex={1} p={1}>
                    <Toolbar />
                    <Box sx={{ borderRadius: 5, overflow: "hidden" }}>
                        <Skeleton variant="rectangular" height={30} />
                    </Box>
                    <Skeleton />
                </Box>
                <Box>
                    <ItemImageList />
                </Box>
                <Pagination sx={{ alignSelf: "center" }} />
                <Toolbar />
            </Box>
        );
    else
        return (
            <Box>
                <Toolbar />
                <Box sx={{ p: 1 }}>
                    <SearchBar />
                </Box>
                <Typography variant="h4" color="text.secondary" align="center">
                    Items not found
                </Typography>
                <Toolbar />
            </Box>
        );
}

const SearchBar = (props) => {
    const { onSubmit, defaultValue } = props;
    const [value, setValue] = React.useState(defaultValue || "");
    const [tags, setTags] = React.useState(undefined);
    const [tagsExpanded, setTagsExpanded] = React.useState(false);

    const onSearchChange = (event) => setValue(event.target.value);

    const onSearchSubmit = (event) => {
        event.preventDefault();
        if (onSubmit) onSubmit(value);
    };

    const onTagClick = (tag) => {
        tag = `#${tag}`;
        if (!value.includes(tag)) setValue(value + tag);
    };

    React.useEffect(() => {
        fetch(apiRoutes.itemTags + "?limit=10")
            .then((res) => res.json())
            .then((tags) => setTags(tags))
            .catch((err) => {
                console.error(err);
                setTags(null);
            });
    }, []);

    return (
        <Box sx={{ p: 1 }}>
            <Paper
                elevation={5}
                component="form"
                onSubmit={onSearchSubmit}
                sx={{ display: "flex", borderRadius: 5 }}
            >
                <IconButton sx={{ pl: 1 }} size="small" aria-label="search">
                    <SearchIcon fontSize="small" />
                </IconButton>
                <InputBase
                    placeholder="Search..."
                    inputProps={{ "aria-label": "search" }}
                    fullWidth
                    onChange={onSearchChange}
                    value={value}
                />
                <input type="submit" hidden />
            </Paper>
            {tags && tags.length > 0 && (
                <ListItem dense disablePadding sx={{ p: 1 }}>
                    <Box sx={{ flexGrow: 1 }} />
                    <Collapse
                        in={tagsExpanded}
                        timeout="auto"
                        collapsedSize="24px"
                    >
                        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                            {tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    onClick={() => {
                                        onTagClick(tag.tag);
                                    }}
                                    sx={{
                                        color: "inherit",
                                        textDecoration: "inherit",
                                        mr: 1,
                                        mb: 1,
                                    }}
                                    size="small"
                                    label={"#" + tag.tag}
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
        </Box>
    );
};

const ItemImageList = (props) => {
    const { items } = props;
    const itemsPerRow = Math.floor(window.innerWidth / 200);

    if (items)
        return (
            <ImageList variant="masonry" gap={8} cols={itemsPerRow}>
                {items.map((item, index) => (
                    <ImageListItem
                        key={index}
                        component={Link}
                        to={`/items/${item._id}`}
                        sx={{ color: "inherit", textDecoration: "inherit" }}
                    >
                        {item.images && item.images.length > 0 ? (
                            <img
                                src={`/api/${item.images[0]}`}
                                style={{
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                }}
                                loading="lazy"
                                alt="item"
                            />
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                    height: 200,
                                    backgroundColor: "grey.200",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                }}
                            >
                                <QuestionMarkIcon fontSize="large" />
                            </Box>
                        )}
                        <ImageListItemBar
                            position="below"
                            title={item.description}
                            subtitle={
                                <>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="error"
                                    >
                                        ¥
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="h6"
                                        color="error"
                                    >
                                        {item.price ? item.price : "0"}
                                    </Typography>
                                </>
                            }
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        );
    else if (items === undefined)
        return (
            <ImageList variant="masonry" gap={8} cols={itemsPerRow}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <ImageListItem
                        key={index}
                        sx={{ color: "inherit", textDecoration: "inherit" }}
                    >
                        <Box sx={{ borderRadius: "10px", overflow: "hidden" }}>
                            <Skeleton variant="rectangular" height={150} />
                        </Box>
                        <ImageListItemBar
                            position="below"
                            title={<Skeleton />}
                            subtitle={<Skeleton />}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        );
    else return null;
};

// ============================================================================
// ItemDetails
// ============================================================================

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
                .then((res) => res.json())
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
                            src={
                                owner.avatar
                                    ? `/api/${owner.avatar}`
                                    : undefined
                            }
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
                            sx={{ fontWeight: "bold" }}
                        >
                            {item.price ? item.price : "0"}
                        </Typography>
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
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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

    const FullScreenImageDialog = () => {
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
                    <Img
                        index={currentImage}
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
                        to={`/api/${images[currentImage]}`}
                        target="_blank"
                    >
                        <DownloadIcon color="primary" fontSize="large" />
                    </IconButton>
                </DialogContent>
            </Dialog>
        );
    };

    if (images.length <= 0) return null;

    if (images.length === 1)
        return (
            <div style={{ p: 1, m: 1 }}>
                <Img index={0} style={{ width: "100%" }} />
                <FullScreenImageDialog />
            </div>
        );

    if (images.length === 2)
        return (
            <div style={{ p: 1, m: 1 }}>
                <Img index={0} style={{ width: "100%" }} />
                <Img index={1} style={{ width: "100%" }} />
                <FullScreenImageDialog />
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
                <FullScreenImageDialog />
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
                <FullScreenImageDialog />
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
            <FullScreenImageDialog />
        </div>
    );
};

export default Items;
