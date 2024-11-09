import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';

const DropzoneContainer = styled.div`
    width: 100%;
    padding: 20px;
    border: 2px dashed #cccccc;
    border-radius: 5px;
    margin-bottom: 20px;
    cursor: pointer;
`;

const DropzoneUpload = ({ onDrop }) => (
    <Dropzone onDrop={onDrop} accept="image/*">
        {({ getRootProps, getInputProps }) => (
            <DropzoneContainer {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag & drop some photos here, or click to select files</p>
            </DropzoneContainer>
        )}
    </Dropzone>
);

export default DropzoneUpload;
