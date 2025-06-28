import { useState } from "react";
import { Dropdown, Form } from "react-bootstrap";

function MultiUserSelector({ selectedUsers, setSelectedUsers, users }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAllSelected, setIsAllSelected] = useState(false);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setIsAllSelected(checked);
    if (checked) {
      setSelectedUsers(users.map((user) => ({ value: user, label: user })));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleChange = (e) => {
    const { value, checked } = e.target;
    const userObj = { value, label: value };

    if (checked) {
      setSelectedUsers((prev) => [...prev, userObj]);
    } else {
      setSelectedUsers((prev) => prev.filter((u) => u.value !== value));
    }
    setIsAllSelected(false);
  };

  const filteredUsers = users?.filter((user) =>
    user?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <Dropdown className="mb-4 w-full">
      <Dropdown.Toggle
        variant="light"
        className="bg-white text-dark border border-gray-300 rounded-md px-5 py-2 w-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="dropdown-user-selector"
      >
        Select Users
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="border border-gray-200 rounded-md shadow-lg p-3 bg-white"
        style={{ maxHeight: "300px", overflowY: "auto", width: "250px", zIndex: 1000 }}
      >
        <Form.Control
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-sm"
        />

        <Form.Check
          type="checkbox"
          label="Select All"
          checked={isAllSelected}
          onChange={handleSelectAll}
          className="mb-3 font-semibold text-gray-800 cursor-pointer"
        />

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Form.Check
              key={user}
              type="checkbox"
              label={user}
              value={user}
              checked={selectedUsers.some((u) => u.value === user)}
              onChange={handleChange}
              className="text-gray-700 mb-2 cursor-pointer text-sm"
            />
          ))
        ) : (
          <div className="text-gray-500 text-sm text-center">No users found</div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default MultiUserSelector;
