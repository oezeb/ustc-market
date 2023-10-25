import React from "react";
import ImageBackdrop from "components/ImageBackdrop";

const ImageLayout = ({ images }) => {
    const [open, setOpen] = React.useState(false);
    const [currentImage, setCurrentImage] = React.useState(0);

    const onClickOpenDialog = (index) => {
        setCurrentImage(index);
        setOpen(true);
    };

    const Img = (props) => {
        const { index } = props;
        return (
            <img
                loading="lazy"
                src={`/api/${images[index]}`}
                alt="item"
                onClick={() => onClickOpenDialog(index)}
                {...props}
            />
        );
    };

    var imageList = null;
    if (images.length <= 0) return null;
    else if (images.length === 1)
        imageList = (
            <div style={{ p: 1, m: 1 }}>
                <Img index={0} style={{ width: "100%" }} />
            </div>
        );
    else if (images.length === 2)
        imageList = (
            <div style={{ p: 1, m: 1 }}>
                <Img index={0} style={{ width: "100%" }} />
                <Img index={1} style={{ width: "100%" }} />
            </div>
        );
    else if (images.length === 3)
        imageList = (
            <div style={{ p: 1, m: 1 }}>
                <Img index={0} style={{ width: "100%" }} />
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Img index={1} style={{ width: "49.5%" }} />
                    <Img index={2} style={{ width: "49.5%" }} />
                </div>
            </div>
        );
    else if (images.length === 4)
        imageList = (
            <div style={{ p: 1, m: 1 }}>
                <Img index={0} style={{ width: "100%" }} />
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Img index={1} style={{ width: "32.5%" }} />
                    <Img index={2} style={{ width: "32.5%" }} />
                    <Img index={3} style={{ width: "32.5%" }} />
                </div>
            </div>
        );
    else
        imageList = (
            <div style={{ p: 1, m: 1 }}>
                <Img index={0} style={{ width: "100%" }} />
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Img index={1} style={{ width: "49.5%" }} />
                    <Img index={2} style={{ width: "49.5%" }} />
                </div>
                <div style={{ height: 4 }} />
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Img index={3} style={{ width: "49.5%" }} />
                    <Img index={4} style={{ width: "49.5%" }} />
                </div>
            </div>
        );

    return (
        <>
            {imageList}
            <ImageBackdrop
                open={open}
                setOpen={setOpen}
                imageURL={`/api/${images[currentImage]}`}
            />
        </>
    );
};

export default ImageLayout;
