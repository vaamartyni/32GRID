// src/App.js

import React, { useState, useRef } from 'react';
import styled from 'styled-components';

import CollageGrid from './components/CollageGrid';
import DropzoneUpload from './components/DropzoneUpload';
import CollageTypeSelector from './components/CollageTypeSelector';
import html2canvas from "html2canvas";
import {Button} from "@mui/material";

const Container = styled.div`
    text-align: center;
    padding: 20px;
    display: flex;
    flex-direction: column;
`;

function App() {
    const [originalImages, setOriginalImages] = useState([]);
    const [collageType, setCollageType] = useState('two-rows-twelve-elements');
    const [cropParameters, setCropParameters] = useState(null); // New state for crop parameters
    const collageRef = useRef(null);

    const handleDrop = (acceptedFiles) => {
        const newImages = acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        );
        const maxImages = collageType === 'two-rows-ten-elements' ? 10 : 12;
        setOriginalImages((prevImages) => [...prevImages, ...newImages].slice(0, maxImages));
    };

    const handleCollageTypeChange = (event) => {
        setCollageType(event.target.value);
        setOriginalImages([]); // Clear images when changing layout
    };

    // Function to update crop parameters and apply to all images
    const applyCropToAll = (cropParams) => {
        setCropParameters(cropParams);
    };

    const saveCollage = async () => {
        if (collageRef.current) {
            const scale = 1920 / collageRef.current.offsetWidth; // Calculate the scale based on desired width
            const canvas = await html2canvas(collageRef.current, {
                scale: scale,
                useCORS: true,
            });

            // Create a link to download the image
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'collage.png';
            link.click();
        }
    };

    return (
        <Container>
            <DropzoneUpload onDrop={handleDrop} />
            <CollageTypeSelector onChange={handleCollageTypeChange} />
            <CollageGrid
                originalImages={originalImages}
                collageType={collageType}
                collageRef={collageRef}
                cropParameters={cropParameters} // Pass down crop parameters
                applyCropToAll={applyCropToAll} // Pass down function to update crop parameters
            />
            <Button onClick={saveCollage}>Создать</Button>
        </Container>
    );
}

export default App;
