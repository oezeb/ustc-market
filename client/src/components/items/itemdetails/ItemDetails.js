import BorderColorIcon from "@mui/icons-material/BorderColor";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link } from "react-router-dom";

import { apiRoutes } from "api";
import { useAuth } from "components/auth/AuthProvider";
import ImageLayout from "./ImageLayout";
import OwnerProfile, { OwnerProfileSkeleton } from "./OwnerProfile";
import TagList from "./TagList";
import LastUpdated from "./LastUpdated";

const soldIcon = require("sold.icon.png");

function ItemDetails({ id }) {
    const { user } = useAuth();
    const [item, setItem] = React.useState(undefined);

    React.useEffect(() => {
        fetch(apiRoutes.items + "/" + id)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((item) => setItem(item))
            .catch((err) => {
                console.error(err);
                setItem(null);
            });
    }, [id]);

    if (!item) return item === undefined ? <ItemDetailsSkeleton /> : null;

    return (
        <Box>
            <Toolbar />
            <OwnerProfile ownerId={item.owner} itemId={item._id} />
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
                    {item.sold && <img src={soldIcon} alt="sold" width="50" />}
                </Box>
                <LastUpdated date={item.updatedAt} />
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
            <TagList tags={item.tags} />
            {item.images && (
                <Box sx={{ borderRadius: "10px", overflow: "hidden", m: 1 }}>
                    <ImageLayout images={item.images} />
                </Box>
            )}
            <Toolbar />
        </Box>
    );
}

const ItemDetailsSkeleton = () => (
    <Box display="flex" flexDirection="column" height={`calc(100vh - 20px)`}>
        <Toolbar />
        <OwnerProfileSkeleton />
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

export default ItemDetails;
