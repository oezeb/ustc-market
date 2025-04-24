import { getCategories } from "@/api/category";
import { uploadImages } from "@/api/image";
import { getProducts } from "@/api/product";
import { createProduct } from "@/api/user.product";
import FloatingAddButton from "@/components/FloatingAddButton";
import ProductsComponent from "@/components/Products";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useNotifications } from "@toolpad/core";
import * as React from "react";
import { useSearchParams } from "react-router";

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = React.useState(null);
    const [category, setCategory] = React.useState(null);
    const [categories, setCategories] = React.useState([]);
    const notifications = useNotifications();

    const fetchCategories = React.useCallback(
        (signal) => {
            getCategories({ signal })
                .then((response) => {
                    if (response.status !== 200)
                        throw new Error(response.message);
                    setCategories(response.data.content);
                })
                .catch((error) => {
                    if (signal && signal.aborted) return;
                    let msg = error.message || "Error getting category list";
                    notifications.show(msg, {
                        severity: "error",
                        autoHideDuration: 5000,
                    });
                });
        },
        [notifications]
    );

    const handleSubmit = (event) => {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let query = formData.get("query");
        let category = formData.get("category");

        console.log(categories.find((value) => value.name === category));

        setQuery(query);
        setCategory(categories.find((value) => value.name === category));
    };

    React.useEffect(() => {
        const controller = new AbortController();
        fetchCategories(controller.signal);
        return () => controller.abort();
    }, [fetchCategories]);

    return (
        <Box>
            <Box
                component="form"
                onSubmit={handleSubmit}
                position="sticky"
                top={5}
                zIndex={1}
            >
                <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <TextField
                            name="query"
                            placeholder="Search"
                            size="small"
                            fullWidth
                            component={Paper}
                        />
                    </Grid>
                    <Grid size={{ xs: 9, md: 3 }}>
                        <Autocomplete
                            size="small"
                            options={categories}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    name="category"
                                    label="Category"
                                    size="small"
                                    fullWidth
                                    component={Paper}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 3, md: 1 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ height: "100%" }}
                        >
                            Filter
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <ProductsComponent
                getProducts={getProducts}
                params={{ query, categoryId: category?.id }}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
            <FloatingAddButton
                add={createProduct}
                addFormPayload={{ uploadImages }}
            />
        </Box>
    );
}
