// src/components/ImageCard.js

import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import Modal from 'react-modal';
import Cropper from 'react-easy-crop';
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import {Avatar, Button, CircularProgress, Dialog, DialogTitle, ListItemAvatar} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import {Cancel, Save, SaveAlt, SaveAsSharp, SaveAsTwoTone} from "@mui/icons-material";

const gridArePixelsMap = {
    1: {
        height: 840,
        width: 473,
        x: 1120,
        y: 348
    },
    2: {
        height: 840,
        width: 473,
        x: 1163,
        y: 327
    },
    3: {
        height: 840,
        width: 473,
        x: 1122,
        y: 338
    }
}

const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    padding-bottom: 177.78%; /* 9:16 aspect ratio */
    overflow: hidden;
`;

const Image = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
`;

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '500px',
    },
};

const ImageCard = ({
                       originalImage,
                       applyCropToAll,
                       cropParameters,
                       text,
                       defaultCropParameters,
    globalTextColor, globalFontSize, gridNumber
                   }) => {
    const [loading, setLoading] = useState(false);
    const [crop, setCrop] = useState(defaultCropParameters.crop);
    const [zoom, setZoom] = useState(defaultCropParameters.zoom);
    const [croppedImage, setCroppedImage] = useState(originalImage.preview);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(defaultCropParameters.croppedAreaPixels);
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

    const handleCropComplete = useCallback((croppedArea, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleImageClick = () => {
        setOpen(true)
    };

    const getCroppedImg = useCallback(
        (imageSrc, pixelCrop) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const image = document.createElement('img');
            image.crossOrigin = 'anonymous';
            image.src = imageSrc;
            return new Promise((resolve, reject) => {
                image.onload = () => {
                    canvas.width = pixelCrop.width;
                    canvas.height = pixelCrop.height;

                    ctx.drawImage(
                        image,
                        pixelCrop.x,
                        pixelCrop.y,
                        pixelCrop.width,
                        pixelCrop.height,
                        0,
                        0,
                        pixelCrop.width,
                        pixelCrop.height
                    );

                    // Add text to canvas
                    if (text) {
                        ctx.font = `${globalFontSize}px Arial`;
                        ctx.fillStyle = globalTextColor;
                        ctx.textBaseline = 'top';

                        const textX = textPosition.x * canvas.width + 10;
                        const textY = textPosition.y * canvas.height + 20;

                        ctx.fillText(text, textX, textY);
                    }

                    resolve(canvas.toDataURL('image/png'));
                };

                image.onerror = (error) => reject(error);
            });
        },
        [text, textPosition, globalFontSize, globalTextColor]
    );

    const handleApplyToAll = () => {
        applyCropToAll({
            crop,
            zoom,
            croppedAreaPixels,
        });
        setOpen(false)
    };

    const saveCroppedImage = async () => {
        try {
            const croppedDataUrl = await getCroppedImg(
                originalImage.preview,
                croppedAreaPixels
            );
            setCroppedImage(croppedDataUrl);
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        setLoading(true)
        saveCroppedImage().then(() => setLoading(false))
    },[globalFontSize, globalTextColor])

    // useEffect(() => {
    //     if (fontSettings) {
    //         setFontSize(fontSettings.fontSize);
    //         setTextColor(fontSettings.textColor);
    //     }
    // }, [fontSettings]);

    useEffect(() => {
        if (cropParameters) {
            setCrop(cropParameters.crop);
            setZoom(cropParameters.zoom);
            setCroppedAreaPixels(cropParameters.croppedAreaPixels);
            // Re-generate cropped image
            getCroppedImg(originalImage.preview, cropParameters.croppedAreaPixels)
                .then((croppedDataUrl) => {
                    setCroppedImage(croppedDataUrl);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [cropParameters, globalFontSize, globalTextColor]);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <ImageWrapper>
                <Image src={croppedImage} alt="croppable" onClick={handleImageClick} />
                {loading && <div style={{position: 'absolute', bottom: 0, left: 0}}><CircularProgress size="30px"/></div>}
            </ImageWrapper>
            <Dialog onClose={handleClose} open={open}>
                <div style={{width: '500px', padding: '10px'}}>
                    <DialogTitle>Параметры изображения</DialogTitle>
                    <div style={{position: 'relative', width: '100%', height: '400px'}}>
                        <Cropper
                            image={originalImage.preview}
                            crop={crop}
                            zoom={zoom}
                            aspect={9 / 16}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={handleCropComplete}
                        />
                    </div>
                    <div style={{display: 'flex', gap: '5px', flexDirection: 'column'}}>
                        {/*<Button variant={"contained"} onClick={() => {}} style={{marginTop: '10px'}}>*/}
                        {/*    Применить*/}
                        {/*</Button>*/}
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Button color="success" fullWidth variant="contained" size="small" endIcon={<Save />} onClick={saveCroppedImage} style={{marginTop: '10px'}}>
                                Применить
                            </Button>
                            <Button
                                color="warning"
                                variant="contained"
                                size="small"
                                fullWidth
                                endIcon={<SaveAsTwoTone />}
                                onClick={handleApplyToAll}
                                style={{marginLeft: '10px', marginTop: '10px'}}
                            >
                                Применить ко всем
                            </Button>
                        </div>
                        <Button
                            color="error"
                            variant="outlined"
                            size="small"
                            fullWidth
                            endIcon={<Cancel />}
                            onClick={() => setOpen(false)}
                        >
                            Отмена
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ImageCard;
