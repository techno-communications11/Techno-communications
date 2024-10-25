import React, { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';

function UserSelector({ selectedUsers, smallerFormStyles, setSelectedUsers, SetcardShow }) {
  const users = [
    { id: 1, name: "Alishba Ahmed" },
    { id: 2, name: "Alisha Padaniya" },
    { id: 3, name: "Roshan Interview" },
    { id: 4, name: "Roshan Screening" },
    { id: 5, name: "Roshan Shaikh" },
    { id: 6, name: "Bilal Interview" },
    { id: 7, name: "EL Paso Market" },
    { id: 8, name: "Qamar Shahzad" },
    { id: 9, name: "Shafaque Qureshi" },
    { id: 10, name: "Sultan Interview" },
    { id: 11, name: "Shah Noor Butt" },
    { id: 12, name: "Shoaib" },
    { id: 13, name: "Kamaran Mohammed" },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [isUsersAllSelected, setIsUsersAllSelected] = useState(false);

  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    setIsUsersAllSelected(checked);
    if (checked) {
      setSelectedUsers(users.map(user => user.name));
      SetcardShow(false);
    } else {
      setSelectedUsers([]);
      SetcardShow(true);
    }
  };

  const handleIndividualUserChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedUsers(prevSelected => [...prevSelected, value]);
      SetcardShow(true); 
    } else {
      setSelectedUsers(prevSelected => prevSelected.filter(userName => userName !== value));
      SetcardShow(true);
    }
    setIsUsersAllSelected(false);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  return (
    <Dropdown>
      <Dropdown.Toggle variant="transparent" className='bg-transparent text-secondary border-0' id="dropdown-basic">
        Select Users
      </Dropdown.Toggle>

      <Dropdown.Menu className="border-0 dropdown-menu" style={{ ...smallerFormStyles, maxHeight: '300px', overflowY: 'auto', width: '20vw' }}>
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
          checked={isUsersAllSelected}
          onChange={handleSelectAllChange}
          style={{ marginBottom: '8px', fontWeight: 'bold' }}
        />
        {filteredUsers.map((user) => (
          <Form.Check
            key={user.id}
            type="checkbox"
            className="text-capitalize"
            label={user.name}
            value={user.name}
            checked={selectedUsers?.includes(user.name)} 
            onChange={handleIndividualUserChange}
            style={{ marginBottom: '4px', whiteSpace: 'nowrap' }} // Prevent line break
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default UserSelector;
