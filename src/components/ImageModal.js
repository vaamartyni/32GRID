import React from 'react';
import Modal from 'react-modal';
import Cropper from 'react-easy-crop';

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '500px'
    }
};

const ImageModal = ({ isOpen, image, crop, zoom, onClose, onCropChange, onZoomChange, onCropComplete, onSave }) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        style={modalStyles}
        contentLabel="Crop Image Modal"
    >
        <h2>Crop Image</h2>
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={9 / 16}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropComplete}
            />
        </div>
        <button onClick={onSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
    </Modal>
);

export default ImageModal;
