import { getCategories } from "@/api/category";
import { uploadImages } from "@/api/image";
import { deleteProduct, getProduct, updateProduct } from "@/api/user.product";
import AddEditProduct from "@/components/AddEditProduct";
import DeleteIcon from "@mui/icons-material/Delete";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useDialogs, useNotifications } from "@toolpad/core";
import * as React from "react";
import { useNavigate, useParams } from "react-router";

export default function ProfileProductEdit() {
    const { id } = useParams();
    const [loading, setLoading] = React.useState(false);
    const [product, setProduct] = React.useState(null);
    const notifications = useNotifications();
    const navigate = useNavigate();
    const dialogs = useDialogs();

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

    const onSubmit = (data) => {
        updateProduct(id, data)
            .then((res) => {
                if (res.status === 200) {
                    notifications.show("Product updated", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    if (res.data.sold) navigate("/profile/products?tab=sold");
                    else navigate("/profile/products?tab=listed");
                } else throw new Error(res.message);
            })
            .catch((error) => {
                let msg = error.message || "Failed to update product";
                notifications.show(msg, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = () => {
        dialogs
            .confirm("You're about to delete this product. Proceed?")
            .then((confirmed) => {
                if (!confirmed) return;
                deleteProduct(id)
                    .then((res) => {
                        if (res.status === 204) {
                            notifications.show("Product deleted", {
                                severity: "success",
                                autoHideDuration: 3000,
                            });
                            navigate(-1);
                        } else throw new Error(res.message);
                    })
                    .catch((error) => {
                        let msg = error.message || "Failed to delete product";
                        notifications.show(msg, {
                            severity: "error",
                            autoHideDuration: 5000,
                        });
                    })
                    .finally(() => setLoading(false));
            });
    };

    React.useEffect(() => {
        const controller = new AbortController();
        fetchProduct(controller.signal);
        return () => controller.abort();
    }, [fetchProduct]);

    return (
        <Box>
            {product && (
                <>
                    <Box display="flex" justifyContent="end">
                        <Button
                            endIcon={<DeleteIcon />}
                            color="error"
                            onClick={handleDelete}
                        >
                            Delete Product
                        </Button>
                    </Box>
                    <AddEditProduct
                        product={product}
                        getCategories={getCategories}
                        uploadImages={uploadImages}
                        onSubmit={onSubmit}
                        loading={loading}
                        setLoading={setLoading}
                    />
                </>
            )}
            <Backdrop open={loading}>
                <CircularProgress />
            </Backdrop>
        </Box>
    );
}
