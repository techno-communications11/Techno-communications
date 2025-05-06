import React, { useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import useFetchMarkets from "../Hooks/useFetchMarkets";

const MarketSelector = ({
  selectedMarket,
  smallerFormStyles,
  text,
  setSelectedMarket,
  isAllSelected,
  setIsAllSelected,
  setMarketFilter,
}) => {
  const { markets } = useFetchMarkets();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    setIsAllSelected(checked);
    if (checked) {
      setSelectedMarket(markets.map((location) => location.location_name));
      setMarketFilter(markets.map((location) => location.location_name));
    } else {
      setSelectedMarket([]);
      setMarketFilter([]);
    }
  };

  const handleLocationChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedMarket((prevSelected) => [...prevSelected, value]);
      setMarketFilter((prevFilter) => [...prevFilter, value]);
    } else {
      setSelectedMarket((prevSelected) =>
        prevSelected.filter((market) => market !== value)
      );
      setMarketFilter((prevFilter) =>
        prevFilter.filter((market) => market !== value)
      );
    }
    setIsAllSelected(false);
  };

  const filteredMarkets = markets.filter((location) =>
    location.location_name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  return (
    <Dropdown>
      <Dropdown.Toggle
        className="bg-white text-dark border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        id="dropdown-basic"
      >
        {text}
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
          className="mb-3 font-semibold text-gray-800 hover:text-blue-600 cursor-pointer"
        />
        {filteredMarkets.map((location) => (
          <Form.Check
            key={location.id}
            type="checkbox"
            className="text-capitalize text-gray-700 hover:text-blue-600 mb-2 cursor-pointer"
            label={location.location_name.toLowerCase()}
            value={location.location_name}
            checked={selectedMarket?.includes(location.location_name)}
            onChange={handleLocationChange}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MarketSelector;