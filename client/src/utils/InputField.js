import Form from "react-bootstrap/Form";
import Inputicons from "../utils/Inputicons";

const InputField = ({ icon, refProp, placeholder, type = "text", error, onChange }) => (
  <Form.Group className="mb-3">
    <div className="input-group">
      <Inputicons icon={icon} />
      <Form.Control
        ref={refProp}
        type={type}
        placeholder={placeholder}
        className={`shadow-none border ${error ? "is-invalid" : ""}`}
        onChange={onChange}
        isInvalid={!!error}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </div>
  </Form.Group>
);

export default InputField;
