import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { useNotifications } from "@toolpad/core";
import * as React from "react";

const MAX_IMAGES = 6;

export default function AddEditProduct({
    product,
    getCategories,
    uploadImages,
    onSubmit,
    loading,
    setLoading,
}) {
    const [images, setImages] = React.useState(product?.images || []);
    const notifications = useNotifications();
    const [categories, setCategories] = React.useState(null);

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
                    setCategories([]);
                });
        },
        [notifications, getCategories]
    );

    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > MAX_IMAGES) {
            notifications.show(`Max ${MAX_IMAGES} images allowed`, {
                severity: "error",
                autoHideDuration: 5000,
            });
        } else {
            const newImages = files.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setImages((prev) => [...prev, ...newImages]);
        }
    };

    const handleDelete = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const _uploadImages = React.useCallback(
        async (images) => {
            if (images.length > 0) {
                setLoading(true);
                let formData = new FormData();
                images.forEach((image) => formData.append("image", image.file));
                try {
                    let response = await uploadImages(formData);
                    console.log(response);
                    if (response.status !== 201)
                        throw new Error(response.message);
                    return response.data;
                } catch (error) {
                    let msg = error.message || "Failed to upload images";
                    notifications.show(msg, {
                        severity: "error",
                        autoHideDuration: 5000,
                    });
                    throw error;
                } finally {
                    setLoading(false);
                }
            } else return [];
        },
        [notifications, uploadImages, setLoading]
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        let name = formData.get("name");
        let category = formData.get("category");
        let price = formData.get("price");
        let description = formData.get("description");
        let sold = formData.get("sold") === "on";

        var oldImages = [];
        var newImages = [];
        for (let image of images) {
            if (image.id) oldImages.push(image);
            else newImages.push(image);
        }

        _uploadImages(newImages).then((data) => {
            let images = [...oldImages, ...data];
            onSubmit({
                name,
                category: categories.find((value) => value.name === category),
                price,
                description,
                sold,
                images,
            });
        });
    };

    React.useEffect(() => {
        const controller = new AbortController();
        fetchCategories(controller.signal);
        return () => controller.abort();
    }, [fetchCategories]);

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <TextField
                        name="name"
                        label="Name"
                        defaultValue={product?.name}
                        variant="standard"
                        size="small"
                        fullWidth
                        required
                        autoFocus
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    {categories && (
                        <Autocomplete
                            options={categories}
                            getOptionLabel={(option) => option.name}
                            defaultValue={
                                product?.category || { name: "Others" }
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    name="category"
                                    label="Category"
                                    variant="standard"
                                    size="small"
                                    required
                                    fullWidth
                                />
                            )}
                        />
                    )}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        name="price"
                        label="Price"
                        defaultValue={product?.price}
                        type="number"
                        variant="standard"
                        size="small"
                        fullWidth
                        required
                        slotProps={{
                            htmlInput: { min: 0 },
                        }}
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                        name="description"
                        label="Description"
                        defaultValue={product?.description}
                        size="small"
                        fullWidth
                        multiline
                        rows={5}
                    />
                </Grid>
                <Grid size={8}>
                    <Button startIcon={<CloudUploadIcon />} component="label">
                        Upload Images
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={handleUpload}
                        />
                    </Button>
                </Grid>
                <Grid size={4}>
                    <Box display="flex" justifyContent="end">
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="sold"
                                        defaultChecked={product?.sold}
                                    />
                                }
                                label="Sold"
                                labelPlacement="start"
                            />
                        </FormGroup>
                    </Box>
                </Grid>
            </Grid>
            <Grid size={12}>
                <Box
                    height={200}
                    border={1}
                    borderColor="divider"
                    borderRadius={1}
                    display="flex"
                    flexDirection="column"
                    overflow="hidden"
                >
                    <Grid
                        container
                        spacing={1}
                        mt={2}
                        sx={{
                            overflowY: "auto",
                            flex: 1,
                            px: 1,
                        }}
                    >
                        {images?.map((image, index) => (
                            <Grid key={index} size={{ xs: 4, md: 2 }}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: "100%",
                                        aspectRatio: "1",
                                        overflow: "hidden",
                                        borderRadius: 1,
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={
                                            image.id
                                                ? `/uploads/thumbnail.${image.fileName}`
                                                : image.preview
                                        }
                                        alt={`uploaded-${index}`}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                    <IconButton
                                        onClick={() => handleDelete(index)}
                                        className="delete-btn"
                                        color="error"
                                        sx={{
                                            position: "absolute",
                                            top: 2,
                                            right: 2,
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Grid>
            <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ my: 2 }}
                fullWidth
            >
                Submit
            </Button>
        </Box>
    );
}
