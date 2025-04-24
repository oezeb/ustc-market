import { getCategories } from "@/api/category";
import { uploadImages } from "@/api/image";
import { createProduct } from "@/api/user.product";
import AddEditProduct from "@/components/AddEditProduct";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useNotifications } from "@toolpad/core";
import * as React from "react";
import { useNavigate } from "react-router";

export default function ProfileProductAdd() {
    const [loading, setLoading] = React.useState(false);
    const notifications = useNotifications();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        createProduct(data)
            .then((res) => {
                if (res.status === 201) {
                    notifications.show("Product created", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    if (res.data.sold) navigate("/profile/products?tab=sold");
                    else navigate("/profile/products?tab=listed");
                } else throw new Error(res.message);
            })
            .catch((error) => {
                let msg = error.message || "Failed to create product";
                notifications.show(msg, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
            })
            .finally(() => setLoading(false));
    };

    return (
        <Box>
            <AddEditProduct
                getCategories={getCategories}
                uploadImages={uploadImages}
                onSubmit={onSubmit}
                loading={loading}
                setLoading={setLoading}
            />
            <Backdrop open={loading}>
                <CircularProgress />
            </Backdrop>
        </Box>
    );
}
