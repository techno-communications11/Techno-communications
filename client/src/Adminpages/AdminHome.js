import Button from "../utils/Button";
import { Link, useNavigate } from "react-router-dom";
import DetailCards from "./DetailCards";
import menuItems from "../Constants/AdminHomeMenuItems";
import { useEffect } from "react";
import { setNavigate } from "../api/axios";

function AdminHome() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <div sx={{ mt: 3 }} className="m-4">
      <div container>
        <div xs={12}>
          <div container className="d-flex gap-3">
            <div style={{ display: "flex", gap: "10px" }}>
              {menuItems.map((item, index) => (
                <Link to={item.path} key={index}>
                  <Button
                    variant="opacity-75"
                    code="#E10174"
                    label={item.label}
                  />
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