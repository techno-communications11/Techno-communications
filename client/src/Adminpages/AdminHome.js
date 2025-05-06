import Button from "../utils/Button";
import { Link } from "react-router-dom";
import DetailCards from "./DetailCards";
const menuItems = [
  { label: "Detailed View", path: "/detail" },
  { label: "Hired Applicants", path: "/selectedathr" },
  { label: "Job Openings", path: "/jobinfo" },
  { label: "NTIDs Dashboard", path: "/ntidDboard" },
];

function AdminHome() {
  return (
    <div sx={{ mt: 3 }} className="m-4">
      <div container>
        <div xs={12}>
          <div container className="d-flex gap-3">
            <div style={{ display: "flex", gap: "10px" }}>
              {menuItems.map((item, index) => (
                <Link to={item.path} key={index}>
                  <Button variant="btn-primary opacity-75" label={item.label} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div xs={12}>
          <DetailCards />
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
