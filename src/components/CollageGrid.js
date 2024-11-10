// src/components/CollageGrid.js

import React, { useRef } from 'react';
import styled from 'styled-components';
import GridComponent from './GridComponent';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { Save } from '@mui/icons-material';

const CollageWrapper = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const CollageGrid = ({
                         originalImages,
                         globalFontSize,
                         globalTextColor,
                         gridSize,
                     }) => {
    // Ensure we have enough images
    if (originalImages.length < 32) {
        return (
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h6" noWrap component="div">
                    Загрузите изображения для начала работы
                </Typography>
            </div>
        );
    }

    // Create a map from fileNumber to image
    const imageMap = {};
    originalImages.forEach((img) => {
        imageMap[img.fileNumber] = img;
    });

    // Define fileNumbers for each grid
    const grid1ImageNumbers = [13, 12, 11, 21, 22, 23, 43, 42, 41, 31, 32, 33];
    const grid2ImageNumbers = [18, 17, 16, 15, 14, 48, 47, 46, 45, 44];
    const grid3ImageNumbers = [24, 25, 26, 27, 28, 34, 35, 36, 37, 38];

    // Get images for each grid
    const grid1Images = grid1ImageNumbers
        .map((num) => imageMap[num])
        .filter(Boolean);
    const grid2Images = grid2ImageNumbers
        .map((num) => imageMap[num])
        .filter(Boolean);
    const grid3Images = grid3ImageNumbers
        .map((num) => imageMap[num])
        .filter(Boolean);

    // Create refs for each GridComponent
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const grid1Ref = useRef(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const grid2Ref = useRef(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const grid3Ref = useRef(null);

    const handleSaveAll = () => {
        if (grid1Ref.current) grid1Ref.current.saveCollage();
        if (grid2Ref.current) grid2Ref.current.saveCollage();
        if (grid3Ref.current) grid3Ref.current.saveCollage();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Save All Button */}
            <div style={{ marginBottom: '20px', position: 'fixed', bottom: '50px', right: '100px', zIndex: '100' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveAll}
                    startIcon={<Save />}
                >
                    Сохранить все
                </Button>
            </div>

            <CollageWrapper>
                <GridComponent
                    ref={grid1Ref}
                    gridSize={gridSize}
                    globalFontSize={globalFontSize}
                    globalTextColor={globalTextColor}
                    images={grid1Images}
                    gridNumber={1}
                />
            </CollageWrapper>
            <CollageWrapper>
                <GridComponent
                    ref={grid2Ref}
                    gridSize={gridSize}
                    globalFontSize={globalFontSize}
                    globalTextColor={globalTextColor}
                    images={grid2Images}
                    gridNumber={2}
                />
            </CollageWrapper>

            {/* Third Grid */}
            <CollageWrapper>
                <GridComponent
                    ref={grid3Ref}
                    gridSize={gridSize}
                    globalFontSize={globalFontSize}
                    globalTextColor={globalTextColor}
                    images={grid3Images}
                    gridNumber={3}
                />
            </CollageWrapper>
        </div>
    );
};

export default CollageGrid;
