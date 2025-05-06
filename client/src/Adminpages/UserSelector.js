import React, { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import users from '../Constants/Users'

function UserSelector({ selectedUsers, smallerFormStyles, setSelectedUsers, SetcardShow }) {
  

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
