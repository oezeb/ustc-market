import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import React from "react";
import { Link } from "react-router-dom";

const TagList = ({ tags }) => {
    const [tagsExpanded, setTagsExpanded] = React.useState(false);

    const onClickExpand = () => setTagsExpanded((prev) => !prev);

    if (!tags) return null;

    return (
        <ListItem dense disablePadding sx={{ p: 1 }}>
            <Box sx={{ flexGrow: 1 }} />
            <Collapse in={tagsExpanded} timeout="auto" collapsedSize="24px">
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    {tags.map((tag, index) => (
                        <Tag key={index} tag={tag} />
                    ))}
                </Box>
            </Collapse>
            <IconButton sx={{ p: 0 }} onClick={onClickExpand}>
                {tagsExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
        </ListItem>
    );
};

const Tag = ({ tag }) => (
    <Chip
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
);

export default TagList;
