import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import React from "react";

import { apiRoutes } from "api";

const SearchBar = ({ onSubmit, defaultValue }) => {
    const [value, setValue] = React.useState(defaultValue || "");

    const onSearchChange = (event) => setValue(event.target.value);

    const onSearchSubmit = (event) => {
        event.preventDefault();
        if (onSubmit) onSubmit(value);
    };

    const onTagClick = (tag) => {
        if (!value.includes(`#${tag}`)) setValue(value + `#${tag}`);
    };

    return (
        <Box sx={{ p: 1 }}>
            <Paper
                elevation={5}
                component="form"
                onSubmit={onSearchSubmit}
                sx={{ display: "flex", borderRadius: 5 }}
            >
                <InputBase
                    placeholder="Search..."
                    inputProps={{ "aria-label": "search" }}
                    fullWidth
                    onChange={onSearchChange}
                    value={value}
                    sx={{ pl: 2, flexGrow: 1 }}
                />
                <IconButton
                    type="submit"
                    sx={{ pl: 1 }}
                    size="small"
                    aria-label="search"
                >
                    <SearchIcon fontSize="small" />
                </IconButton>
            </Paper>
            <TagList onClick={onTagClick} />
        </Box>
    );
};

const TagList = ({ onClick }) => {
    const [tags, setTags] = React.useState(undefined);
    const [tagsExpanded, setTagsExpanded] = React.useState(false);

    React.useEffect(() => {
        fetch(apiRoutes.itemTags + "?limit=10")
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((tags) => setTags(tags))
            .catch((err) => {
                console.error(err);
                setTags(null);
            });
    }, []);

    if (!tags) return null;

    const Tag = ({ tag }) => (
        <Chip
            onClick={() => onClick(tag)}
            sx={{
                color: "inherit",
                textDecoration: "inherit",
                mr: 1,
                mb: 1,
            }}
            size="small"
            label={"#" + tag}
        />
    );

    const onClickExpand = () => setTagsExpanded((prev) => !prev);

    return (
        <ListItem dense disablePadding sx={{ p: 1 }}>
            <Box sx={{ flexGrow: 1 }} />
            <Collapse in={tagsExpanded} timeout="auto" collapsedSize="24px">
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    {tags.map((tag, index) => (
                        <Tag key={index} tag={tag.tag} />
                    ))}
                </Box>
            </Collapse>
            <IconButton sx={{ p: 0 }} onClick={onClickExpand}>
                {tagsExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
        </ListItem>
    );
};

export default SearchBar;
