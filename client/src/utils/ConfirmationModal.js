import { Modal } from 'react-bootstrap';
import Button from './Button';

function ConfirmationModal({ show, handleClose, handleConfirm, message, confirmDisabled }) {
  console.log('ConfirmationModal rendered:', { show, message, confirmDisabled }); // Debug log
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Assignment</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="btn-secondary"
          label="Cancel"
          onClick={handleClose}
        />
        <Button
          variant="btn-primary"
          label="Confirm"
          onClick={() => {
            console.log('Confirm button clicked'); // Debug log
            handleConfirm();
          }}
          disabled={confirmDisabled}
        />
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;