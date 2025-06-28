import { useState, useMemo, useEffect } from "react";
import { Dropdown, Form } from "react-bootstrap";

const MarketSelector = ({
  selectedMarket,
  setSelectedMarket,
  isAllSelected,
  setIsAllSelected,
  setMarketFilter,
  markets = [],
  text = "Select Market",
  className = "jira-input",
  smallerFormStyles,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sync marketFilter with selectedMarket
  useEffect(() => {
    if (setMarketFilter) {
      setMarketFilter(selectedMarket);
    }
  }, [selectedMarket, setMarketFilter]);

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setIsAllSelected(checked);
    const newSelected = checked
      ? (markets || []).map((m) => m.location_name || (typeof m === "string" ? m : "Unknown"))
      : [];
    setSelectedMarket(newSelected);
  };

  const handleLocationChange = (e) => {
    const { value, checked } = e.target;
    setSelectedMarket((prevSelected) => {
      const updated = checked
        ? [...new Set([...prevSelected, value])]
        : prevSelected.filter((market) => market !== value);
      return updated;
    });
    setIsAllSelected(false);
  };

  const filteredMarkets = useMemo(() => {
    return (markets || [])
      .map((loc, index) => ({
        id: loc?.id || index,
        location_name: loc?.location_name || (typeof loc === "string" ? loc : "Unknown"),
      }))
      .filter((loc) =>
        (loc.location_name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, markets]);

  return (
    <Dropdown>
      <Dropdown.Toggle
        id="market-dropdown"
        className={`bg-white text-dark border border-gray-300 rounded-md px-5 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${className}`}
      >
        {isAllSelected ? "All Markets" : (selectedMarket.length > 0 ? `${selectedMarket.length} selected` : text)}
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="border border-gray-200 rounded-md shadow-lg p-3 bg-white"
        style={{
          ...smallerFormStyles,
          maxHeight: "300px",
          overflowY: "auto",
          width: "250px",
          zIndex: 1000,
        }}
      >
        <Form.Control
          type="text"
          placeholder="Search markets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-sm"
        />

        <Form.Check
          type="checkbox"
          label="Select All"
          checked={isAllSelected}
          onChange={handleSelectAllChange}
          className="mb-3 font-semibold text-gray-800 cursor-pointer"
        />

        {filteredMarkets.length > 0 ? (
          filteredMarkets.map((location) => (
            <Form.Check
              key={location.id}
              type="checkbox"
              label={location.location_name}
              value={location.location_name}
              checked={selectedMarket.includes(location.location_name)}
              onChange={handleLocationChange}
              className="text-gray-700 mb-2 cursor-pointer text-sm text-capitalize"
            />
          ))
        ) : (
          <div className="text-gray-500 text-sm text-center">No markets found</div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MarketSelector;