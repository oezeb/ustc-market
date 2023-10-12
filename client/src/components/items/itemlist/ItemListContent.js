import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import Pagination from "@mui/material/Pagination";
import React from "react";

import { apiRoutes } from "api";
import ItemView, { ItemViewSkeleton } from "./ItemView";

function ItemListContent(props) {
    const [items, setItems] = React.useState(undefined);
    const [itemCount, setItemCount] = React.useState(undefined);
    const [page, setPage] = React.useState(1);

    const itemsperPage = 10;
    const itemsPerRow = Math.floor(window.innerWidth / 200);

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

    if (!items) return items === undefined ? <ItemListContentSkeleton /> : null;

    return (
        <>
            <ImageList variant="masonry" gap={8} cols={itemsPerRow}>
                {items.map((item, index) => (
                    <ItemView key={index} item={item} />
                ))}
            </ImageList>
            <Pagination
                sx={{ alignSelf: "center" }}
                count={Math.ceil(itemCount / itemsperPage)}
                page={page}
                onChange={(event, value) => setPage(value)}
            />
        </>
    );
}

export const ItemListContentSkeleton = ({ itemsPerRow }) => (
    <>
        <Box>
            <ImageList variant="masonry" gap={8} cols={itemsPerRow}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <ItemViewSkeleton key={index} />
                ))}
            </ImageList>
        </Box>
        <Pagination sx={{ alignSelf: "center" }} />
    </>
);

export default ItemListContent;
