import React, { useState, useEffect } from 'react';
import { Dropdown, Form } from 'react-bootstrap';

function StatusFilter({ 
    selectedGroupStatus, 
    setSelectedGroupStatus, 
    statusMap, 
    setSelectedStatus, 
    smallerFormStyles, 
    groupstatus 
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState([]);

    useEffect(() => {
        const relatedStatuses = selectedStatuses.map(status => statusMap[status] || []);
        setSelectedStatus(relatedStatuses.flat());
        const newGroupStatus = selectedStatuses.join(', ');
        if (newGroupStatus !== selectedGroupStatus) {
            setSelectedGroupStatus(newGroupStatus);
        }
    }, [selectedStatuses]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredStatuses = groupstatus.filter(status => 
        status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatusChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedStatuses(prevSelected => [...prevSelected, value]);
        } else {
            setSelectedStatuses(prevSelected => prevSelected.filter(status => status !== value));
        }
    };

    const handleSelectAll = () => {
        if (selectedStatuses.length === filteredStatuses.length) {
            setSelectedStatuses([]);
        } else {
            setSelectedStatuses(filteredStatuses);
        }
    };

    return (
        <Dropdown className='bg-transparent text-secondary border-secondary' >
            <Dropdown.Toggle variant="transparent" id="statusSelector">
                Select Status
            </Dropdown.Toggle>

            <Dropdown.Menu  className="border-0" style={{ ...smallerFormStyles, maxHeight: '300px', overflowY: 'auto', width: '20vw'  }}>
                <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ marginBottom: '8px' }}
                />

                <Form.Check
                    type="checkbox"
                    label="Select All"
                    checked={selectedStatuses.length === filteredStatuses.length && filteredStatuses.length > 0}
                    onChange={handleSelectAll}
                    style={{ marginBottom: '8px', fontWeight: 'bold' }}
                />

                {filteredStatuses.map((status, index) => (
                    <Form.Check
                        key={index}
                        type="checkbox"
                        label={status.toUpperCase()}
                        value={status}
                        checked={selectedStatuses.includes(status)}
                        onChange={handleStatusChange}
                        style={{ marginBottom: '4px', width: 'auto' }} // Maintain auto width
                    />
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default StatusFilter;
