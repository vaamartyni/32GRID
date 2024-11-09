// src/components/ImageCard.js

import React, {useState, useCallback, useRef, useEffect} from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import Modal from 'react-modal';
import Cropper from 'react-easy-crop';

const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    padding-bottom: 177.78%; /* 9:16 aspect ratio for individual images */
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

const TextOverlay = styled.div`
  position: absolute;
  cursor: move;
  user-select: none;
  font-size: ${(props) => props.fontSize || '28px'};
  color: ${(props) => props.color || '#fffa09'};
  //text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
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

const ImageCard = ({   originalImage,
                       applyCropToAll,
                       cropParameters,
                       text,
                       setText, }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedImage, setCroppedImage] = useState(originalImage.preview);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);


    // Text overlay state
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
    const [fontSize, setFontSize] = useState(20); // New state for font size
    const [textColor, setTextColor] = useState('#fff'); // New state for text color

    const textRef = useRef(null);

    const handleCropComplete = useCallback((croppedArea, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const getCroppedImg = useCallback((imageSrc, pixelCrop) => {
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
                // if (text) {
                //     ctx.font = '28px Arial';
                //     ctx.fillStyle = '#ffffff';
                //     ctx.textBaseline = 'top';
                //
                //     const textX = textPosition.x * canvas.width;
                //     const textY = textPosition.y * canvas.height;
                //
                //     ctx.fillText(text, textX, textY);
                // }

                resolve(canvas.toDataURL('image/png'));
            };
            image.onerror = (error) => reject(error);
        });
    }, [text, textPosition]);

    const handleApplyToAll = () => {
        applyCropToAll({
            crop,
            zoom,
            croppedAreaPixels,
        });
        setIsModalOpen(false);
    };

    const saveCroppedImage = async () => {
        try {
            const croppedDataUrl = await getCroppedImg(originalImage.preview, croppedAreaPixels);
            setCroppedImage(croppedDataUrl);
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleTextDrag = (e, data) => {
        const wrapper = textRef.current.parentElement;
        const wrapperRect = wrapper.getBoundingClientRect();

        setTextPosition({
            x: data.x / wrapperRect.width,
            y: data.y / wrapperRect.height,
        });
    };

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
    }, [cropParameters, getCroppedImg, originalImage.preview]);

    return (
        <div>
            <ImageWrapper>
                <Image src={croppedImage} alt="croppable" onClick={handleImageClick} />

                {text && (
                    <Draggable
                        onDrag={handleTextDrag}
                        position={{
                            x: textPosition.x * 100 + '%',
                            y: textPosition.y * 100 + '%',
                        }}
                    >
                        <TextOverlay
                            ref={textRef}
                            style={{ left: 0, top: 0 }}
                            fontSize={`${fontSize}px`}
                            color={textColor}
                        >
                            {text}
                        </TextOverlay>
                    </Draggable>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    style={modalStyles}
                    contentLabel="Crop Image Modal"
                >
                    <h2>Crop Image</h2>
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
                    <div style={{marginTop: '10px'}}>
                        <input
                            type="text"
                            placeholder="Enter text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{width: '100%', padding: '8px'}}
                        />
                        <div style={{marginTop: '10px', display: 'flex', alignItems: 'center'}}>
                            <label style={{marginRight: '10px'}}>Font Size:</label>
                            <input
                                type="number"
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                                min="10"
                                max="100"
                                style={{width: '60px'}}
                            />
                            <label style={{marginLeft: '20px', marginRight: '10px'}}>Color:</label>
                            <input
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                            />
                        </div>
                    </div>
                    <button onClick={saveCroppedImage} style={{marginTop: '10px'}}>
                        Save
                    </button>
                    <button
                        onClick={handleApplyToAll}
                        style={{marginLeft: '10px', marginTop: '10px'}}
                    >
                        Apply to All
                    </button>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        style={{marginLeft: '10px', marginTop: '10px'}}
                    >
                        Cancel
                    </button>
                </Modal>
            </ImageWrapper>
        </div>
    );
};

export default ImageCard;
