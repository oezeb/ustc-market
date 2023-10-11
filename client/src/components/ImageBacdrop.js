import React from "react";
import Backdrop from "@mui/material/Backdrop";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ImageBackdrop = ({ open, setOpen, imageURL }) => (
    <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <IconButton
            sx={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 1,
                color: "white",
            }}
            onClick={() => setOpen(false)}
        >
            <CloseIcon color="white" fontSize="large" />
        </IconButton>
        <img
            loading="lazy"
            src={imageURL}
            alt="item"
            style={{ maxWidth: "100%" }}
            objectFit="contain"
        />
    </Backdrop>
);

export default ImageBackdrop;
