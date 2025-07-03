import Dropdown from "react-bootstrap/Dropdown";
import { FaBuilding } from "react-icons/fa";

const MarketDropdown = ({ selectedMarket, handleSelectMarket, markets, formErrors, pathname }) => {
  const memphisArray = ["memphis", "relocation"];
  const dubaiArray = ["dubai",  "relocation"];
  return (
    <div className={`rounded ${formErrors.market ? "border-danger" : "border"}`}>
      <Dropdown onSelect={handleSelectMarket}>
        <Dropdown.Toggle
          className={`w-100 bg-transparent text-muted shadow-none border ${formErrors.market ? "border-danger" : ""}`}
          id="dropdown-basic"
          style={{ padding: "10px", textAlign: "left" }}
        >
          <FaBuilding className="me-2" style={{ color: "#e10174" }} />
          {selectedMarket || "Select Market"}
        </Dropdown.Toggle>
        <Dropdown.Menu className="w-100 overflow-auto shadow-none border" style={{ height: "15rem" }}>
          {markets
            .filter((m) => pathname === "/memphis" ? memphisArray.includes(m.location_name.toLowerCase()) : true)
            .filter((m) => pathname === "/dubai" ? dubaiArray.includes(m.location_name.toLowerCase()) : true)
            .sort((a, b) => (a.location_name || "").localeCompare(b.location_name || ""))
            .map((market) => (
              <Dropdown.Item key={market.id} eventKey={market.location_name} className="text-capitalize border fw-medium mt-1">   
                {market.location_name?.toLowerCase()}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
      {formErrors.market && <div className="invalid-feedback d-block">{formErrors.market}</div>}
    </div>
  );
};

export default MarketDropdown;
