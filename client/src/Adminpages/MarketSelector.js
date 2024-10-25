import React, { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';

const MarketSelector = ({ selectedMarket, smallerFormStyles,text, setSelectedMarket, isAllSelected, setIsAllSelected, setMarketFilter }) => {
  const locations = [
    { id: 4, name: 'ARIZONA' },
    { id: 5, name: 'Bay Area' },
    { id: 6, name: 'COLORADO' },
    { id: 7, name: 'DALLAS' },
    { id: 8, name: 'El Paso' },
    { id: 9, name: 'FLORIDA' },
    { id: 10, name: 'HOUSTON' },
    { id: 11, name: 'LOS ANGELES' },
    { id: 12, name: 'MEMPHIS' },
    { id: 13, name: 'NASHVILLE' },
    { id: 14, name: 'NORTH CAROLINA' },
    { id: 15, name: 'SACRAMENTO' },
    { id: 16, name: 'SAN DIEGO' },
    { id: 17, name: 'SAN FRANCISCO' },
    { id: 18, name: 'SAN JOSE' },
    { id: 19, name: 'SANTA ROSA' },
    { id: 21, name: 'RELOCATION' },
    { id: 23, name: 'DirectHiring' },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    setIsAllSelected(checked);
    if (checked) {
      setSelectedMarket(locations.map(location => location.name));
      setMarketFilter(locations.map(location => location.name));
    } else {
      setSelectedMarket([]);
      setMarketFilter([]);
    }
  };

  const handleLocationChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedMarket(prevSelected => [...prevSelected, value]);
      setMarketFilter(prevFilter => [...prevFilter, value]);
    } else {
      setSelectedMarket(prevSelected => prevSelected.filter(market => market !== value));
      setMarketFilter(prevFilter => prevFilter.filter(market => market !== value));
    }
    setIsAllSelected(false);
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dropdown>
      <Dropdown.Toggle variant="transparent" className='bg-transparent text-secondary border-0' id="dropdown-basic">
       {text}
      </Dropdown.Toggle>

      <Dropdown.Menu   className="border-0 dropdown-menu"  style={{ ...smallerFormStyles, maxHeight: '300px', overflowY: 'auto',width: '20vw', padding:'2vw',zindex:1}}>
        <Form.Control
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '8px' }}
        />
        <Form.Check
          type="checkbox"
          label="Select All"
          checked={isAllSelected}
          onChange={handleSelectAllChange}
          style={{ marginBottom: '8px', fontWeight: 'bold' }}
        />
        {filteredLocations.map((location) => (
          <Form.Check
            key={location.id}
            type="checkbox"
            className="text-capitalize"
            label={location.name.toLowerCase()}
            value={location.name}
            checked={selectedMarket?.includes(location.name)}
            onChange={handleLocationChange}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MarketSelector;
