import { useContext, useEffect, useState } from "react";
import { Row, Col, Form, Card } from "react-bootstrap";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import axios from "axios";
import dayjs from "dayjs";
import { CanvasJSChart } from "canvasjs-react-charts";
import { MyContext } from "../pages/MyContext";
import { useNavigate } from "react-router-dom";
import useFetchMarkets from "../Hooks/useFetchMarkets";
import Loader from "../utils/Loader";
import API_URL from "../Constants/ApiUrl";

const DetailCards = () => {
  const [statusCounts, setStatusCounts] = useState({});
  const [selectedMarket, setSelectedMarket] = useState([]); // Holds multiple markets
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(7, "days"),
    dayjs(),
  ]);
  const [loading, setLoading] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false); // State to track Select All
  const { setMarkets, setCaptureDate } = useContext(MyContext);
  const navigate = useNavigate();
  const { markets } = useFetchMarkets();

  useEffect(() => {
    fetchStatusCounts();
  }, []);

  useEffect(() => {
    if (selectedMarket.length > 0 || dateRange) {
      fetchStatusCounts();
    }
  }, [selectedMarket, dateRange]);

  const fetchStatusCounts = async () => {
    setLoading(true);
    try {
      const url = `${API_URL}/getStatusCountsByLocation`;
      const response = await axios.get(url, { withCredentials: true });
      if (response.status === 200) {
        const details = response.data.status_counts;
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

  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    setIsAllSelected(checked);
    if (checked) {
      const allMarkets = markets.map((location) => location.location_name);
      setMarkets(allMarkets);
      setSelectedMarket(allMarkets);
    } else {
      setSelectedMarket([]); // Clear selected markets when "Select All" is unchecked
      setMarkets([]); // Clear markets
    }
  };

  // Set all markets as selected by default when markets are fetched
  useEffect(() => {
    if (markets.length > 0) {
      const allMarkets = markets.map((location) => location.location_name);
      setSelectedMarket(allMarkets); // Preselect all markets
      setMarkets(allMarkets); // Update context with all markets
      setIsAllSelected(true); // Set "Select All" checkbox to checked to reflect UI state
    }
  }, [markets, setMarkets]);

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
        const inMarket =
          selectedMarket?.length > 0
            ? selectedMarket.includes(profile.work_location_name)
            : true;
        const createdDate = new Date(profile.created_at_date);
        const [startDate, endDate] = dateRange;
        const startDateObj = startDate ? new Date(startDate) : null;
        const endDateObj = endDate ? new Date(endDate) : null;
        if (startDateObj && endDateObj) {
          if (startDateObj.toDateString() === endDateObj.toDateString()) {
            startDateObj.setHours(0, 0, 0, 0); // Local start of the day
            endDateObj.setHours(23, 59, 59, 999); // Local end of the day
          } else {
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
            ? createdTimestamp >= startTimestamp &&
              createdTimestamp <= endTimestamp
            : true; // Default to true if no date range is provided
        return inMarket && inDateRange;
      });
  };

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
      (profileStats["Not A: Not Recommended For Hiring"] || 0) +
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

  const handleDataView = (captureStatus) => {
    setCaptureDate(dateRange);
    navigate(`/statusticketview/${captureStatus}`);
  };

  return (
    <div className="mt-4">
      {loading && <Loader />}
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
              {markets.map((location) => (
                <Form.Check
                  key={location.id}
                  type="checkbox"
                  label={location.location_name?.toLowerCase()}
                  className="text-capitalize "
                  value={location.location_name}
                  checked={selectedMarket?.includes(location.location_name)}
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
