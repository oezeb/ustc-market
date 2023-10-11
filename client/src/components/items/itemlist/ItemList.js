import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import SearchBar from "./SearchBar";
import ItemListContent from "./ItemListContent";

function ItemList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const q = searchParams.get("q");
    const tagsQuery = searchParams.get("tags");

    const onSubmit = (value) => {
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
                <SearchBar onSubmit={onSubmit} defaultValue={defaultSeach()} />
            </Box>
            <ItemListContent q={q} tagsQuery={tagsQuery} sold={false} />
            <Toolbar />
        </Box>
    );
}

export default ItemList;
