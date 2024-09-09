import React, { useEffect, useState } from 'react';
import { Container, Modal, Button, TextField, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import '../pages/loader.css';
import decodeToken from '../decodedDetails';

function ScreeningHome() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const userData = decodeToken();

  // Fake numbers for the statuses
  const fakeStats = [
    { status: 'pending at Screening', count: 3, color: '#f0ad4e' },
    { status: 'no response at Screening', count: 5, color: '#d9534f' },
    { status: 'Not Interested at screening', count: 2, color: '#5bc0de' },
    { status: 'rejected at Screening', count: 5, color: '#d9534f' },
    { status: 'moved to Interview', count: 10, color: '#5cb85c' },
  ];

  const fakeTotalCount = fakeStats.reduce((total, stat) => total + stat.count, 0);

  useEffect(() => {
    if (searchQuery) {
      const filtered = profiles.filter(profile =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.profileStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.phone.toString().includes(searchQuery) ||
        profile.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.referBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.date && profile.date.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles(profiles);
    }
  }, [searchQuery, profiles]);

  const handleShow = async (status) => {
    setShowModal(true);
    const fakeProfiles = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', referBy: 'Jane', referedId: 'NT001', market: 'New York', profileStatus: status, createdAt: new Date(), comments: 'N/A' },
      // Add more fake profiles if needed
    ];
    setProfiles(fakeProfiles);
    setFilteredProfiles(fakeProfiles);
    setSelectedStatus(status);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProfiles([]);
    setFilteredProfiles([]);
    setSearchQuery('');
  };

  const formatTime = (date) => {
    return date ? format(parseISO(date), 'EEE dd MMM yyyy HH:mm') : 'N/A';
  };

  return (
    <Container style={{ minHeight: "80vh" }}>
      <div className='d-flex my-4'>
        <Typography variant="h4" className="fw-bold">Screening Dashboard</Typography>
        <Typography variant="h4" className='ms-auto fw-bold'>{userData.name}</Typography>
      </div>
      <Link to="/marketjobopenings" style={{ textDecoration: 'none' }}>
        <Typography variant="body1" className='text-end'>
          Click here to view Market Job Openings
        </Typography>
      </Link>

      <Grid container spacing={3} className='mt-2'>
        {/* Total Card */}
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card className="shadow-sm  h-100" style={{ backgroundColor: '#0275d8', cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h3" className="fw-bold" color="white">
                {fakeTotalCount}
              </Typography>
              <Typography variant="body2" className="fw-bold" color="white">
                Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Cards */}
        {fakeStats.map((stat, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={2}>
            <Card
              className="shadow-sm h-100"
              style={{ backgroundColor: stat.color, cursor: 'pointer', }}
              // onClick={() => handleShow(stat.status)}
            >
              <CardContent>
                <Typography variant="h3" className="fw-bold" color="white">
                  {stat.count}
                </Typography>
                <Typography variant="body2" className="fw-bold" color="white" style={{ textTransform: 'capitalize' }}>
            
                  {stat.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal open={showModal} onClose={handleCloseModal}>
        <Container style={{ marginTop: '7vh', padding: '2rem', backgroundColor: 'white' }}>
          <Typography variant="h5">{selectedStatus} Profiles</Typography>
          <TextField
            fullWidth
            label="Search profiles by name, status, market, date, referred by..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='mb-4'
          />
          {filteredProfiles.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SC.No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Referred By</TableCell>
                  <TableCell>Reference NTID</TableCell>
                  <TableCell>Market</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Comments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProfiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((profile, index) => (
                  <TableRow key={profile.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{profile.name}</TableCell>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>{profile.phone}</TableCell>
                    <TableCell>{profile.referBy}</TableCell>
                    <TableCell>{profile.referedId}</TableCell>
                    <TableCell>{profile.market}</TableCell>
                    <TableCell>{profile.profileStatus}</TableCell>
                    <TableCell>{formatTime(profile.createdAt)}</TableCell>
                    <TableCell>{profile.comments}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography variant="body1">No profiles available for this status.</Typography>
          )}
          <Button onClick={handleCloseModal} variant="contained" color="primary">
            Close
          </Button>
        </Container>
      </Modal>
    </Container>
  );
}

export default ScreeningHome;
