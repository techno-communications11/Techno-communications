import Button from "./Button";
import { FaRegHandPointer } from "react-icons/fa";

const SubmitButton = ({ loading }) => (
  <Button
    variant="btn-primary w-100"
    type="submit"
    disabled={loading}
    loading={loading}
    label=" Submit"
    icon={<FaRegHandPointer />}
  />
);

export default SubmitButton;
