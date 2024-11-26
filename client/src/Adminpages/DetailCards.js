import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Form, Card, Spinner, Container } from "react-bootstrap";
import { Alert, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import axios from "axios";
import dayjs from "dayjs";
import { CanvasJSChart } from "canvasjs-react-charts";
import { MyContext } from "../pages/MyContext";
import { useNavigate } from "react-router-dom";

const DetailCards = () => {
  const [statusCounts, setStatusCounts] = useState({});
  const [selectedMarket, setSelectedMarket] = useState([]); // Holds multiple markets
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(7, 'days'),
    dayjs(),
  ]); 
  const [loading, setLoading] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false); // State to track Select All
  const { setCaptureStatus, setCaptureDate, setMarkets } =
    useContext(MyContext);
  const navigate = useNavigate();

  const locations = [
    { id: 4, name: "ARIZONA" },
    { id: 5, name: "Bay Area" },
    { id: 6, name: "COLORADO" },
    { id: 7, name: "DALLAS" },
    { id: 8, name: "El Paso" },
    { id: 9, name: "FLORIDA" },
    { id: 10, name: "HOUSTON" },
    { id: 11, name: "LOS ANGELES" },
    { id: 12, name: "MEMPHIS" },
    { id: 13, name: "NASHVILLE" },
    { id: 14, name: "NORTH CAROL" },
    { id: 15, name: "SACRAMENTO" },
    { id: 16, name: "SAN DEIGIO" },
    { id: 17, name: "SAN FRANCISCO" },
    { id: 18, name: "SAN JOSE" },
    { id: 19, name: "SANTA ROSA" },
    { id: 21, name: "relocation" },
    { id: 23, name: "DirectHiring" },
  ];
 
  useEffect(() => {
    fetchStatusCounts();
    
  }, []);
  // Fetch data when filters change
  useEffect(() => {
    if (selectedMarket.length > 0 || dateRange) {
      fetchStatusCounts();
    }
  }, [selectedMarket, dateRange]);

  const fetchStatusCounts = async () => {
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_API}/getStatusCountsByLocation`;
      
      const response = await axios.get(url);
      if (response.status === 200) {
        const details = response.data.status_counts;
        console.log(details,'dts')
        setStatusCounts(deriveProfileStats(details));
      } else {
        console.error("Error fetching profiles:", response);
      }
    } catch (error) {
      console.error("API Error:", error.message);
    } finally {
      setLoading(false);
    }
  };


// Handle "Select All" and individual market selections
const handleSelectAllChange = (event) => {
  const { checked } = event.target;
  setIsAllSelected(checked);
  setMarkets(locations.map((location) => location.name));
  setSelectedMarket(locations.map((location) => location.name));
  if (checked) {
    setMarkets(locations.map((location) => location.name));
    setSelectedMarket(locations.map((location) => location.name));
  } else {
    setSelectedMarket([]); // Clear selected markets when "Select All" is unchecked
    setMarkets([]); // Clear markets
  }
};
// console.log(dateRange[0].format('YYYY-MM-DD'),dateRange[1].format('YYYY-MM-DD'),"dtrange")

// Set initial state for "Select All" and default selected markets on mount
useEffect(() => {
  setIsAllSelected(true);
  setMarkets(locations.map((location) => location.name));
  setSelectedMarket(locations.map((location) => location.name));
}, []); // Run when 'locations' data is available


  const handleLocationChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedMarket((prevSelected) => {
        const updatedMarkets = [...prevSelected, value];
        setMarkets(updatedMarkets); // Update setMarkets here
        return updatedMarkets;
      });
    } else {
      setSelectedMarket((prevSelected) => {
        const updatedMarkets = prevSelected.filter(
          (market) => market !== value
        );
        setMarkets(updatedMarkets); // Update setMarkets here
        return updatedMarkets;
      });
    }
    setIsAllSelected(false); // Uncheck "Select All" when individual changes happen
  };

  const flattenProfiles = (profiles) => {
    return profiles
        .flatMap((profile) => {
            return profile.applicant_names.map((name, index) => ({
                applicant_name: name,
                applicant_phone: profile.phone[index],
                applicant_email: profile.applicant_emails[index],
                applicant_uuid: profile.applicant_uuids[index],
                work_location_name: profile.work_location_names[index],
                created_at_date: profile.created_at_dates[index],
                status: profile.status,
            }));
        })
        .filter((profile) => {
            // Filter by market
            const inMarket = selectedMarket?.length > 0
                ? selectedMarket.includes(profile.work_location_name)
                : true;

            // Parse created_at_date into a Date object
            const createdDate = new Date(profile.created_at_date);

            // Parse dateRange
            const [startDate, endDate] = dateRange;
            
            // Convert start and end dates to Date objects, if they exist
            const startDateObj = startDate ? new Date(startDate) : null;
            const endDateObj = endDate ? new Date(endDate) : null;
            
            if (startDateObj && endDateObj) {
                if (startDateObj.toDateString() === endDateObj.toDateString()) {
                    // For the same day: Adjust time to cover the entire day in local time
                    startDateObj.setHours(0, 0, 0, 0); // Local start of the day
                    endDateObj.setHours(23, 59, 59, 999); // Local end of the day
                } else {
                    // For different days: Adjust to cover entire day ranges in UTC
                    startDateObj.setHours(0, 0, 0, 0); // UTC start of the start day
                    endDateObj.setHours(23, 59, 59, 999); // UTC end of the end day
                }
            }
            
            // Convert to timestamps for comparison
            const startTimestamp = startDateObj ? startDateObj.getTime() : null;
            const endTimestamp = endDateObj ? endDateObj.getTime() : null;
            const createdTimestamp = createdDate.getTime();
            
            // Filter by date range (inclusive)
            const inDateRange =
                startTimestamp && endTimestamp
                    ? createdTimestamp >= startTimestamp && createdTimestamp <= endTimestamp
                    : true; // Default to true if no date range is provided
            
            // Debugging output
            console.log("Created Date:", createdDate.toISOString());
            console.log("Start Date Obj:", startDateObj?.toISOString());
            console.log("End Date Obj:", endDateObj?.toISOString());
            console.log("In Date Range:", inDateRange);
            

            // Return profiles matching both filters
            return inMarket && inDateRange;
        });
};


  
  
  
  
  
  

  // Derive profile statistics based on the flattened profiles
  const deriveProfileStats = (profiles) => {
    const flattenedProfiles = flattenProfiles(profiles);
    const uniqueProfiles = flattenedProfiles.filter(
      (profile, index, self) =>
        index ===
        self.findIndex((p) => p.applicant_uuid === profile.applicant_uuid)
    );
    const profileStats = uniqueProfiles.reduce((acc, profile) => {
      acc[profile.status] = (acc[profile.status] || 0) + 1;
      return acc;
    }, {});

    return calculateFinalStatusCounts(profileStats);
  };

  // Calculate the final counts for each status based on the profile statistics
  const calculateFinalStatusCounts = (profileStats) => {
    const pendingTotal =
      (profileStats["pending at Screening"] || 0) +
      (profileStats["moved to Interview"] || 0) +
      (profileStats["put on hold at Interview"] || 0) +
      (profileStats["selected at Interview"] || 0) +
      (profileStats["Sent for Evaluation"] || 0) +
      (profileStats["need second opinion at Interview"] || 0) +
      (profileStats["Applicant will think about It"] || 0) +
      (profileStats["Moved to HR"] || 0) +
      (profileStats["Recommended For Hiring"] || 0) +
      (profileStats["selected at Hr"] || 0) +
      (profileStats["Spanish Evaluation"] || 0) +
      (profileStats["Store Evaluation"] || 0);

    const rejectedTotal =
      (profileStats["rejected at Screening"] || 0) +
      (profileStats["no show at Screening"] || 0) +
      (profileStats["Not Interested at screening"] || 0) +
      (profileStats["rejected at Interview"] || 0) +
      (profileStats["no show at Interview"] || 0) +
      (profileStats["no show at Hr"] || 0) +
      (profileStats["Not Recommended For Hiring"] || 0) +
      (profileStats["backOut"] || 0) +
      (profileStats["rejected at Hr"] || 0);
    const pendingAtScreening = profileStats["pending at Screening"] || 0;

    const firstRoundPendingTotal =
      (profileStats["moved to Interview"] || 0) +
      (profileStats["put on hold at Interview"] || 0);

    const hrRoundPendingTotal =
      (profileStats["Recommended For Hiring"] || 0) +
      (profileStats["selected at Interview"] || 0) +
      (profileStats["Sent for Evaluation"] || 0) +
      (profileStats["need second opinion at Interview"] || 0) +
      (profileStats["Applicant will think about It"] || 0) +
      (profileStats["Moved to HR"] || 0) +
      (profileStats["Spanish Evaluation"] || 0) +
      (profileStats["Store Evaluation"] || 0);

    const pendingAtNITDSTotal = profileStats["selected at Hr"] || 0;

    const ntidCreatedTotal = profileStats["mark_assigned"] || 0;

    return {
      Total: Object.values(profileStats).reduce((acc, val) => acc + val, 0),
      Rejected: rejectedTotal,
      Pending: pendingTotal,
      "Pending At Screening": pendingAtScreening,
      "1st Round - Pending": firstRoundPendingTotal,
      "HR Round - Pending": hrRoundPendingTotal,
      "Pending at NTID": pendingAtNITDSTotal,
      "NTID Created": ntidCreatedTotal,
    };
  };

  const handleDataView = (status) => {
    setCaptureStatus(status);
    setCaptureDate(dateRange);
    navigate("/statusticketview");
  };

  return (
    <div className="mt-4">
      {loading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed", // Makes the spinner overlay fixed to the screen
            top: 0,
            left: 0,
            right: 0,
            bottom: 0, // Ensures it covers the whole screen
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark background
            zIndex: 9999, // Places the spinner above other content
          }}
        >
          <Spinner
            animation="border"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* First Row: Date Range Filter */}
      <Row className="d-flex justify-content-between align-items-center mb-4">
        <Col md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              startText="Start Date"
              endText="End Date"
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} fullWidth variant="outlined" />
                  <TextField {...endProps} fullWidth variant="outlined" />
                </>
              )}
            />
          </LocalizationProvider>
        </Col>
      </Row>

      <Row className="d-flex align-items-start gap-2">
        <Col md={2}>
          <Form.Group controlId="marketSelector">
            <div
              style={{
                borderRadius: "10px",
                padding: "15px",
                maxHeight: "350px",
                overflowY: "auto",
                border: "1px solid #ddd",
              }}
            >
              <Form.Label style={{ fontWeight: "bold" }}>
                Select Markets
              </Form.Label>
              <Form.Check
                type="checkbox"
                label="Select All"
                checked={isAllSelected}
                onChange={handleSelectAllChange}
              />
              {locations.map((location) => (
                <Form.Check
                  key={location.id}
                  type="checkbox"
                  label={location.name}
                  value={location.name}
                  checked={selectedMarket?.includes(location.name)}
                  onChange={handleLocationChange}
                />
              ))}
            </div>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Row>
            {Object.keys(statusCounts)?.length > 0 &&
              Object.keys(statusCounts).map((status) => (
                <Col key={status} md={4} className="mb-3">
                  <Card
                    onClick={() => handleDataView(status)}
                    style={{ cursor: "pointer" }}
                  >
                    <Card.Body>
                      <Card.Title
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          color: "#E10174",
                        }}
                      >
                        {status}
                      </Card.Title>
                      <Card.Text
                        style={{
                          fontSize: "1.6rem",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {statusCounts[status]}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Col>

        <Col md={3}>
          {Object.keys(statusCounts).length > 0 && (
            <CanvasJSChart
              options={{
                animationEnabled: true,
                theme: "light1",
                title: { text: "Status Distribution" },
                data: [
                  {
                    type: "pie",
                    indexLabel: "{label}: {y}",
                    dataPoints: Object.keys(statusCounts)
                      .filter((status) => status !== "Total")
                      .map((status) => ({
                        label: status,
                        y: statusCounts[status] || 0,
                      })),
                  },
                ],
              }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DetailCards;
