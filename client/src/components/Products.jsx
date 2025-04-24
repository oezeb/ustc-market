import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import { useNotifications } from "@toolpad/core";
import * as React from "react";
import { Link } from "react-router";

const PAGE_SIZE = 12;

export default function Products({
    getProducts,
    params,
    searchParams,
    setSearchParams,
}) {
    const [loading, setLoading] = React.useState(false);
    const [products, setProducts] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const notifications = useNotifications();

    const fetchProducts = React.useCallback(
        (signal) => {
            setLoading(true);

            getProducts({
                params: {
                    ...params,
                    page: parseInt(searchParams.get("page")) || 0,
                    size: PAGE_SIZE,
                    sort: "updatedAt,desc",
                },
                signal,
            })
                .then((response) => {
                    if (response.status !== 200)
                        throw new Error(response.message);
                    setProducts(response.data.content);
                    setTotal(response.data.totalElements);
                })
                .catch((error) => {
                    if (signal && signal.aborted) return;
                    let msg = error.message || "Error getting product list";
                    notifications.show(msg, {
                        severity: "error",
                        autoHideDuration: 5000,
                    });
                })
                .finally(() => setLoading(false));
        },
        [searchParams, notifications, getProducts, params]
    );

    const handleChangePage = (_, newPage) => {
        setSearchParams((prev) => {
            const params = Object.fromEntries(prev.entries());
            return { ...params, page: newPage };
        });
    };

    React.useEffect(() => {
        const controller = new AbortController();
        fetchProducts(controller.signal);
        return () => controller.abort();
    }, [fetchProducts]);

    return (
        <Box pt={1}>
            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid
                        size={{ xs: 6, md: 2 }}
                        key={product.id}
                        component={Link}
                        to={`${product.id}`}
                        sx={{ textDecoration: "none" }}
                    >
                        <Card>
                            <CardMedia
                                component="img"
                                height={175}
                                image={`/uploads/thumbnail.${product.images[0]?.fileName}`}
                            />

                            <CardContent
                                sx={{
                                    p: 1,
                                    "&:last-child": { pb: 1 },
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 3,
                                        wordBreak: "break-all",
                                    }}
                                >
                                    {product.name}
                                </Typography>
                                <Box>
                                    <Typography
                                        component="span"
                                        variant="caption"
                                        color="#ff5000"
                                    >
                                        ¥
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="h4"
                                        color="#ff5000"
                                        fontWeight="bold"
                                        fontSize={18}
                                    >
                                        {product.price}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box mt={2} display="flex" justifyContent="center">
                <TablePagination
                    component="div"
                    count={total}
                    page={parseInt(searchParams.get("page")) || 0}
                    onPageChange={handleChangePage}
                    rowsPerPage={PAGE_SIZE}
                    rowsPerPageOptions={[PAGE_SIZE]}
                />
            </Box>
            <Backdrop open={loading}>
                <CircularProgress />
            </Backdrop>
        </Box>
    );
}
