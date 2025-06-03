import { Modal } from "react-bootstrap";
import Button from "./Button";

function ConformationModal({
  showConfirmModal,
  setShowConfirmModal,
  selectedProfile,
  handleSelect,
  selectedHR,
}) {
  return (
    <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Assignment</Modal.Title>
      </Modal.Header>w
      <Modal.Body>
        Are you sure you want to assign{" "}
        <strong>{selectedProfile?.applicant_name}</strong> to HR{" "}
        <strong>{selectedHR}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="btn-secondary"
          label="Cancel"
          onClick={() => setShowConfirmModal(false)}
        />
        <Button variant="btn-primary" onClick={handleSelect} label="Confirm" />
      </Modal.Footer>
    </Modal>
  );
}

export default ConformationModal;
