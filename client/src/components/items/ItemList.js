import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import InputBase from "@mui/material/InputBase";
import ListItem from "@mui/material/ListItem";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { apiRoutes } from "api";

const soldIcon = require("sold.icon.png");

function ItemList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const q = searchParams.get("q");
    const tagsQuery = searchParams.get("tags");

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

    return (
        <Box display="flex" flexDirection="column">
            <Box position="sticky" top={0} zIndex={1}>
                <Toolbar />
                <SearchBar
                    onSubmit={onSearchSubmit}
                    defaultValue={defaultSeach()}
                />
            </Box>
            <ItemListContent
                q={q}
                tagsQuery={tagsQuery}
                sold={false}
                showOwner
            />
            <Toolbar />
        </Box>
    );
}

export function ItemListContent(props) {
    const { showOwner } = props;
    const [items, setItems] = React.useState(undefined);
    const [itemCount, setItemCount] = React.useState(undefined);
    const [page, setPage] = React.useState(1);

    const itemsperPage = 10;

    React.useEffect(() => {
        const { q, tagsQuery, owner, sold } = props;
        const query = new URLSearchParams();
        if (q) query.append("text", q);
        if (tagsQuery) query.append("tags", tagsQuery);
        if (owner) query.append("owner", owner);
        if (sold !== undefined) query.append("sold", sold);

        const queryText = query.size > 0 ? "?" + query.toString() : "";
        fetch(apiRoutes.itemCount + queryText)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((count) => {
                setItemCount(count);

                const offset = (page - 1) * itemsperPage;
                if (offset >= count) setItems([]);
                else {
                    query.append("limit", itemsperPage);
                    query.append("offset", offset);

                    fetch(apiRoutes.items + "?" + query.toString())
                        .then((res) =>
                            res.ok ? res.json() : Promise.reject(res)
                        )
                        .then((items) => setItems(items));
                }
            })
            .catch((err) => {
                console.error(err);
                setItemCount(0);
                setItems(null);
            });
    }, [page, props]);

    if (items)
        return (
            <>
                <ItemImageList items={items} showOwner={showOwner} />
                <Pagination
                    sx={{ alignSelf: "center" }}
                    count={Math.ceil(itemCount / itemsperPage)}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                />
            </>
        );
    else if (items === undefined)
        return (
            <>
                <Box>
                    <ItemImageList />
                </Box>
                <Pagination sx={{ alignSelf: "center" }} />
            </>
        );
    else
        return (
            <Typography variant="h4" color="text.secondary" align="center">
                Items not found
            </Typography>
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
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
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
    const { items, showOwner } = props;
    const itemsPerRow = Math.floor(window.innerWidth / 200);

    if (items) {
        return (
            <ImageList variant="masonry" gap={8} cols={itemsPerRow}>
                {items.map((item, index) => (
                    <ItemImage key={index} item={item} showOwner={showOwner} />
                ))}
            </ImageList>
        );
    } else if (items === undefined)
        return (
            <ImageList variant="masonry" gap={8} cols={itemsPerRow}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <ItemImage key={index} />
                ))}
            </ImageList>
        );
    else return null;
};

const ItemImage = (props) => {
    const { item, showOwner } = props;
    const [owner, setOwner] = React.useState(undefined);

    React.useEffect(() => {
        if (item)
            fetch(apiRoutes.users + "/" + item.owner)
                .then((res) => (res.ok ? res.json() : Promise.reject(res)))
                .then((user) => setOwner(user))
                .catch((err) => {
                    console.error(err);
                    setOwner(null);
                });
    }, [item]);

    if (item)
        return (
            <ImageListItem
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
                                sx={{ mr: 2 }}
                            >
                                {item.price ? item.price : "0"}
                            </Typography>
                            {item.sold && (
                                <img src={soldIcon} alt="sold" width="30" />
                            )}
                            <Box>
                                {owner && showOwner && (
                                    <Box
                                        component={Link}
                                        to={`/users/${owner._id}`}
                                        sx={{
                                            color: "inherit",
                                            textDecoration: "inherit",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Avatar
                                            src={
                                                owner.avatar
                                                    ? `/api/${owner.avatar}`
                                                    : undefined
                                            }
                                            sx={{
                                                width: 20,
                                                height: 20,
                                                mr: 1,
                                            }}
                                        />
                                        {owner.name || "Anonymous"}
                                    </Box>
                                )}
                            </Box>
                        </>
                    }
                />
            </ImageListItem>
        );
    else if (item === undefined)
        return (
            <ImageListItem sx={{ color: "inherit", textDecoration: "inherit" }}>
                <Box sx={{ borderRadius: "10px", overflow: "hidden" }}>
                    <Skeleton variant="rectangular" height={150} />
                </Box>
                <ImageListItemBar
                    position="below"
                    title={<Skeleton />}
                    subtitle={<Skeleton />}
                />
            </ImageListItem>
        );
    else return null;
};

export default ItemList;
