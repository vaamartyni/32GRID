// src/App.js

import React, { useState } from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DropzoneUpload from "./components/DropzoneUpload";
import CollageGrid from "./components/CollageGrid";
import {Slider} from "@mui/material";

const drawerWidth = 240;

const Container = styled.div`
    width: 100vw;
    height: 100vh;
`;

function App() {
    const [originalImages, setOriginalImages] = useState([]);
    const [globalFontSize, setGlobalFontSize] = useState(50); // Global font size
    const [globalTextColor, setGlobalTextColor] = useState('#fff'); // Global text color
    const [gridSize, setGridSize] = useState(70);
    const handleDrop = (acceptedFiles) => {
        const newImages = acceptedFiles.map((file) => {
            const fileName = file.name.split('.')[0]; // e.g., '11'
            const fileNumber = parseInt(fileName, 10);
            return {
                originalImage: Object.assign(file, { preview: URL.createObjectURL(file) }),
                fileNumber,
            };
        });

        // Sort images by fileNumber
        newImages.sort((a, b) => a.fileNumber - b.fileNumber);

        setOriginalImages(newImages);
    };

    const setFontSettings = (newFontSize, newTextColor) => {
        setGlobalFontSize(newFontSize);
        setGlobalTextColor(newTextColor);
    };

    return (
        // <Container>
        //     <h1>Photo Collage App</h1>
        //     <DropzoneUpload onDrop={handleDrop} />
        //     <CollageGrid originalImages={originalImages} />
        // </Container>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Создание сетки изображений
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <DropzoneUpload onDrop={handleDrop} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <label style={{marginRight: '10px'}}>Размер текста:</label>
                                    <input
                                        type="number"
                                        value={globalFontSize}
                                        onChange={(e) => setGlobalFontSize(Number(e.target.value))}
                                        min="10"
                                        max="100"
                                        style={{width: '60px', marginRight: '20px'}}
                                    />
                                    <label style={{marginRight: '10px'}}>Цвет текста</label>
                                    <input
                                        type="color"
                                        value={globalTextColor}
                                        onChange={(e) => setGlobalTextColor(e.target.value)}
                                    />
                                </div>
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                    <ListItem >
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            <Typography variant="caption" gutterBottom sx={{display: 'block'}}>
                                Масштаб сетки: {gridSize}%
                            </Typography>
                            <Slider
                                size="small"
                                value={gridSize}
                                onChange={(e) => setGridSize(e.target.value)}
                                aria-label="Small"
                                valueLabelDisplay="auto"
                            />
                        </div>
                    </ListItem>
                </List>
                    <Divider />
                </Box>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <Toolbar/>
                <Typography sx={{marginBottom: 2}}>
                    <CollageGrid
                        gridSize={gridSize}
                        originalImages={originalImages}
                        globalTextColor={globalTextColor}
                        globalFontSize={globalFontSize}
                    />
                </Typography>
            </Box>
        </Box>
    );
}

export default App;
