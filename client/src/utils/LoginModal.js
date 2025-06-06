import Modal from "react-bootstrap/Modal";
import Login from "../Auth/Login";

const LoginModal = ({ show, onClose }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Body>
      <Login />
    </Modal.Body>
  </Modal>
);

export default LoginModal;
