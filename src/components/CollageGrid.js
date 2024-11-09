// src/components/CollageGrid.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ImageCard from './ImageCard';

const CollageWrapper = styled.div`
    position: relative;
    width: 100%;
    max-width: 800px; /* Adjust as needed */
    margin: 0 auto;
    border: 1px solid #ccc;
    overflow: hidden;
`;

const Collage = styled.div`
    display: grid;
    width: 100%;
    height: auto;
    grid-gap: 1px;
    aspect-ratio: 16 / 9; /* Modern browsers support */
    position: relative;
`;

const CollageGrid = ({
                         originalImages,
                         collageType,
                         collageRef,
                         cropParameters,
                         applyCropToAll,
                     }) => {
    const numRows = 2;
    const numCols = 6;

    const getCollageStyle = (type) => {
        switch (type) {
            case 'two-rows-ten-elements':
                return {
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gridTemplateRows: 'repeat(2, 1fr)',
                };
            case 'two-rows-twelve-elements':
                return {
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gridTemplateRows: 'repeat(2, 1fr)',
                };
            default:
                return {};
        }
    };

    // Manage text state for each image
    const [texts, setTexts] = useState(Array(originalImages.length).fill(''));

    // Update texts array when originalImages length changes
    useEffect(() => {
        setTexts(Array(originalImages.length).fill(''));
    }, [originalImages.length]);

    const autonumbering = () => {
        const startingNumber = '1.1'; // Starting number as per your example
        let [startFirstNum, startSecondNum] = startingNumber.split('.').map(Number);

        const newTexts = [...texts];

        // Define the numbering logic
        const startRow = 0;
        const startCol = 2; // Third image in first row (indexing from 0)

        // First row numbering
        for (let col = 0; col < numCols; col++) {
            const index = startRow * numCols + col;
            if (index >= originalImages.length) continue;

            if (col <= startCol) {
                // Left side including starting image
                const secondNum = startSecondNum + (startCol - col);
                newTexts[index] = `${startFirstNum}.${secondNum}`;
            } else {
                // Right side
                const firstNum = startFirstNum + 1;
                const secondNum = 1 + (col - startCol - 1);
                newTexts[index] = `${firstNum}.${secondNum}`;
            }
        }

        // Second row numbering
        const otherRow = 1; // Second row
        for (let col = 0; col < numCols; col++) {
            const index = otherRow * numCols + col;
            if (index >= originalImages.length) continue;

            if (col <= startCol) {
                // Left side
                const firstNum = startFirstNum + 3;
                const secondNum = startSecondNum + (startCol - col);
                newTexts[index] = `${firstNum}.${secondNum}`;
            } else {
                // Right side
                const firstNum = startFirstNum + 2;
                const secondNum = 1 + (col - startCol - 1);
                newTexts[index] = `${firstNum}.${secondNum}`;
            }
        }

        setTexts(newTexts);
    };

    return (
        <div>
            <button onClick={autonumbering} style={{ marginBottom: '10px' }}>
                Autonumbering for 2x6
            </button>
            <CollageWrapper ref={collageRef}>
                <Collage style={getCollageStyle(collageType)}>
                    {originalImages.map((image, index) => (
                        <ImageCard
                            key={index}
                            originalImage={image}
                            cropParameters={cropParameters}
                            applyCropToAll={applyCropToAll}
                            text={texts[index]}
                            setText={(newText) => {
                                const newTexts = [...texts];
                                newTexts[index] = newText;
                                setTexts(newTexts);
                            }}
                        />
                    ))}
                </Collage>
            </CollageWrapper>
        </div>
    );
};

export default CollageGrid;
