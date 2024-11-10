// src/components/GridComponent.js

import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import ImageCard from './ImageCard';
import { convertFileNumberToNumbering } from '../utils';
import html2canvas from 'html2canvas';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { Save } from '@mui/icons-material';

const Collage = styled.div`
    display: grid;
    grid-gap: 2px;
    width: ${({ gridSize }) => `${gridSize}%`};
    background-color: #fff;
    border: 2px solid #fff;
`;

const defaultCropParameters = {
    1: {
        crop: {
            x: -113.75,
            y: -42.625,
        },
        zoom: 1.5,
        croppedAreaPixels: {
            width: 473,
            height: 840,
            x: 1149,
            y: 335,
        },
    },
    2: {
        crop: {
            x: -114.5,
            y: -32.625,
        },
        zoom: 1.5,
        croppedAreaPixels: {
            width: 473,
            height: 840,
            x: 1152,
            y: 305,
        },
    },
    3: {
        crop: {
            x: -93.5,
            y: -39.625,
        },
        zoom: 1.5,
        croppedAreaPixels: {
            width: 473,
            height: 840,
            x: 1090,
            y: 326,
        },
    },
};

const GridComponent = forwardRef(
    ({ images, gridNumber, globalTextColor, globalFontSize, gridSize }, ref) => {
        // Determine grid size based on grid number
        const gridSizes = {
            1: { rows: 2, cols: 6 },
            2: { rows: 2, cols: 5 },
            3: { rows: 2, cols: 5 },
        };

        const { rows, cols } = gridSizes[gridNumber];

        const getGridStyle = () => ({
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
        });

        // Assign numbering and prepare images
        const arrangedImages = images.map((img) => {
            const numbering = convertFileNumberToNumbering(img.fileNumber);
            return { ...img, text: numbering };
        });

        // Initialize crop parameters state
        const [cropParametersList, setCropParametersList] = useState(
            Array(arrangedImages.length).fill(null)
        );

        const applyCropToAll = (cropParameters) => {
            // Update all crop parameters in the grid
            const newCropParametersList = cropParametersList.map(() => cropParameters);
            setCropParametersList(newCropParametersList);
        };

        const collageRef = useRef(null);

        const saveCollage = async () => {
            if (collageRef.current) {
                // Capture the collage as displayed without scaling
                const canvas = await html2canvas(collageRef.current, {
                    useCORS: true,
                    logging: false,
                });

                // Download the image
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `collage-${gridNumber}.png`;
                link.click();
            }
        };

        // Expose the saveCollage function to the parent component
        useImperativeHandle(ref, () => ({
            saveCollage,
        }));

        // Pass the individual crop parameters to each ImageCard
        return (
            <>
                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        flexDirection: 'row',
                        width: 'fit-content',
                    }}
                >
                    <Typography variant="h4">Сетка {gridNumber}</Typography>
                    <Button
                        variant="contained"
                        tabIndex={-1}
                        onClick={saveCollage}
                        color={'success'}
                        endIcon={<Save />}
                    >
                        Сохранить
                    </Button>
                </div>
                <Collage
                    gridSize={gridSize}
                    gridNumber={gridNumber}
                    ref={collageRef}
                    style={getGridStyle()}
                >
                    {arrangedImages.map((imageObj, index) => (
                        <ImageCard
                            defaultCropParameters={defaultCropParameters[gridNumber]}
                            gridNumber={gridNumber}
                            globalFontSize={globalFontSize}
                            globalTextColor={globalTextColor}
                            key={index}
                            originalImage={imageObj.originalImage}
                            text={imageObj.text}
                            setText={() => {}}
                            cropParameters={cropParametersList[index]}
                            applyCropToAll={applyCropToAll}
                        />
                    ))}
                </Collage>
            </>
        );
    }
);

export default GridComponent;
