import { getProduct } from "@/api/product";
import StoreIcon from "@mui/icons-material/Store";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useNotifications } from "@toolpad/core";
import * as React from "react";
import { Link, useParams } from "react-router";

export default function ProductDetail() {
    const { id } = useParams();
    const [loading, setLoading] = React.useState(false);
    const [product, setProduct] = React.useState(null);
    const notifications = useNotifications();

    const fetchProduct = React.useCallback(
        (signal) => {
            setLoading(true);
            getProduct(id, { signal })
                .then((response) => {
                    if (response.status !== 200)
                        throw new Error(response.message);
                    setProduct(response.data);
                })
                .catch((error) => {
                    if (signal && signal.aborted) return;
                    let msg = error.message || "Error getting product info";
                    notifications.show(msg, {
                        severity: "error",
                        autoHideDuration: 5000,
                    });
                })
                .finally(() => setLoading(false));
        },
        [notifications, id]
    );

    React.useEffect(() => {
        const controller = new AbortController();
        fetchProduct(controller.signal);
        return () => controller.abort();
    }, [fetchProduct]);

    return (
        <Box pt={1}>
            {product && (
                <>
                    <Box display="flex" justifyContent="space-between">
                        <Box>
                            <Typography
                                component="span"
                                variant="body2"
                                color="#ff5000"
                            >
                                ¥
                            </Typography>
                            <Typography
                                component="span"
                                variant="h4"
                                color="#ff5000"
                                fontWeight="bold"
                                fontSize={24}
                            >
                                {product.price}
                            </Typography>
                        </Box>
                        <Button
                            endIcon={<StoreIcon />}
                            component={Link}
                            to={`/users/${product.user.id}`}
                        >
                            store
                        </Button>
                    </Box>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2" whiteSpace="pre-line">
                        {product.description}
                    </Typography>
                    {product.images.map((image, index) => (
                        <Box
                            key={index}
                            component="img"
                            src={`/uploads/${image.fileName}`}
                            sx={{
                                width: "100%",
                                objectFit: "contain",
                            }}
                        />
                    ))}
                </>
            )}
            <Backdrop open={loading}>
                <CircularProgress />
            </Backdrop>
        </Box>
    );
}
