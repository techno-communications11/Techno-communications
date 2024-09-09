import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button, Grid } from '@mui/material';
import { Cancel as CancelIcon, CheckCircle as ConfirmIcon } from '@mui/icons-material';

const ConfirmationModal = ({ show, handleClose, handleConfirm, message }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Action</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Button
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleClose}
              sx={{ backgroundColor: '#f44336' }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ConfirmIcon />}
              onClick={handleConfirm}
              sx={{ backgroundColor: '#4caf50' }}
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
