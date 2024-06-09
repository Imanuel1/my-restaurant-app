import React, { useState } from 'react';
import { Modal, Box, Button } from '@mui/material';

const PopupModal = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className='c-popup-modal'>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{ '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }} // Apply style to Backdrop
      >
        <Box sx={style}>
          <h2 id="modal-title">Text in a modal</h2>
          <p id="modal-description">
            Duis mollis, est eget dictum ullamcorper, neque laoreet ultricies
            erat, lorem pulvinar quam at lorem.
          </p>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default PopupModal;
