import React from 'react';
import { useNavigate } from 'react-router-dom';
import decodeToken from '../decodedDetails';

function HrNew() {
  
  const navigate = useNavigate();

  // Sample profile data
  const profiles = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', status: 'Pending' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', status: 'Approved' },
    // Add more profiles as needed
  ];

  const handleInterviewClick = () => {
    navigate(`/hrinterview`);
  };

  return (
    <div>
      <div className="col-12 container w-80">
    

        <table className="table table-striped" >
          <thead>
            <tr>
              <th>SI.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, index) => (
              <tr key={profile.id}>
                <td>{index + 1}</td>
                <td>{profile.name}</td>
                <td>{profile.email}</td>
                <td>{profile.phone}</td>
                <td>{profile.status}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleInterviewClick()}
                  >
                     Next
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HrNew;
