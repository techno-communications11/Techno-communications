import { useState, useEffect, useContext } from "react";
import { MyContext } from "../pages/MyContext";
import { useNavigate } from "react-router-dom";
import MarketSelector from "../utils/MarketSelector";
import { Pie } from "react-chartjs-2";
import useFetchNtidDashCount from "../Hooks/useFetchNtidDashCount";
import Loader from "../utils/Loader";
import { Container } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function Ntidboard() {
  const [selectedMarket, setSelectedMarket] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(true); // Select all by default
  const [startDate, setStartDate] = useState(
    () =>
      new Date(new Date().setDate(new Date().getDate() - 7))
        .toISOString()
        .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const { data, loading, error } = useFetchNtidDashCount();

  const navigate = useNavigate();
  const { setStartDateForContext, setEndDateForContext, setMarkets } = useContext(MyContext);

  const [counts, setCounts] = useState({
    markAssigned: 0,
    selectedAtHr: 0,
    contractSigned0: 0,
    contractSigned1: 0,
  });

  // Derive unique markets, handling both location_name and market
  const markets = data
    ? [...new Set(data.map((item) => item.location_name?.toLowerCase() || item.market?.toLowerCase()))] // Use location_name first, fallback to market
        .filter((location) => location && typeof location === "string") // Ensure valid strings
        .map((location, index) => ({ id: index + 1, location_name: location || "Unknown" })) // Standardize to location_name
    : [];

  console.log("Raw Data:", data); // Debug raw data
  console.log("Derived Markets:", markets); // Debug derived markets

  const text = "Select Market";
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const applyFilters = (dataToFilter) => {
    let filtered = dataToFilter || [];
    setMarkets(selectedMarket);
    setStartDateForContext(startDate);
    setEndDateForContext(endDate);
    if (!isAllSelected && selectedMarket.length > 0) {
      filtered = filtered.filter((item) =>
        selectedMarket.some((market) =>
          (item.location_name || item.market || "").toLowerCase().includes(market.toLowerCase())
        )
      );
    }

    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      if (startDateObj && endDateObj) {
        const adjustedStartDateUTC = new Date(
          Date.UTC(
            startDateObj.getUTCFullYear(),
            startDateObj.getUTCMonth(),
            startDateObj.getUTCDate(),
            0,
            0,
            0,
            0
          )
        );

        const adjustedEndDateUTC = new Date(
          Date.UTC(
            endDateObj.getUTCFullYear(),
            endDateObj.getUTCMonth(),
            endDateObj.getUTCDate(),
            23,
            59,
            59,
            999
          )
        );

        filtered = filtered.filter((item) => {
          const joiningDate = new Date(item.joining_date);
          return (
            joiningDate >= adjustedStartDateUTC &&
            joiningDate <= adjustedEndDateUTC
          );
        });
      }
    }
    calculateCounts(filtered);
  };

  const calculateCounts = (filteredData) => {
    const counts = {
      markAssigned: 0,
      selectedAtHr: 0,
      contractSigned0: 0,
      contractSigned1: 0,
    };

    filteredData.forEach((item) => {
      if (item.status === "mark_assigned") counts.markAssigned += 1;
      if (item.status === "selected at Hr") counts.selectedAtHr += 1;
      if (item.contract_sined === 0) counts.contractSigned0 += 1;
      if (item.contract_sined === 1) counts.contractSigned1 += 1;
    });

    setCounts(counts);
  };

  useEffect(() => {
    applyFilters(data);
  }, [selectedMarket, startDate, endDate, isAllSelected, data]);

  const pieData = {
    labels: [
      "NTID Created",
      "NTID Pending",
      "Contract Signed",
      "Contract Unsigned",
    ],
    datasets: [
      {
        data: [
          counts.markAssigned,
          counts.selectedAtHr,
          counts.contractSigned1,
          counts.contractSigned0,
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#F44336"],
        hoverBackgroundColor: ["#45A049", "#1E88E5", "#FFB300", "#E53935"],
      },
    ],
  };

  const handleClick = (title) => {
    var captureStatus = "";
    if (title === "NTID Pending") {
      captureStatus = "selected at Hr";
    }
    if (title === "NTID Created") {
      captureStatus = "mark_assigned";
    }
    if (title === "Contract Signed") {
      captureStatus = "contract_signed1";
    }
    if (title === "Contract Unsigned") {
      captureStatus = "contract_signed0";
    }
    navigate(`/ntiddata/${captureStatus}`);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <h5 style={{ color: "#F44336" }}>{error}</h5>
      </div>
    );
  }

  return (
    <Container fluid style={{ backgroundColor: "#F4F5F7", minHeight: "100vh", padding: "16px" }}>
      <style>
        {`
          .jira-container {
            background-color: #FFFFFF;
            border-radius: 3px;
            box-shadow: 0 1px 2px rgba(9, 30, 66, 0.25);
            border: 1px solid #DFE1E6;
          }
          
          .jira-header {
            background-color: #FAFBFC;
            border-bottom: 1px solid #DFE1E6;
            padding: 16px 24px;
          }
          
          .jira-sidebar {
            background-color: #FFFFFF;
            border-right: 1px solid #DFE1E6;
            box-shadow: 0 1px 2px rgba(9, 30, 66, 0.25);
          }
          
          .jira-table {
            background-color: #FFFFFF;
          }
          
          .jira-table-header {
            background-color: #F4F5F7;
            border-bottom: 2px solid #DFE1E6;
            font-weight: 600;
            color: #5E6C84;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .jira-table-row {
            border-bottom: 1px solid #DFE1E6;
            transition: background-color 0.2s;
          }
          
          .jira-table-row:hover {
            background-color: #F4F5F7;
          }
          
          .jira-table-cell {
            padding: 8px 12px;
            font-size: 14px;
            color: #172B4D;
            vertical-align: middle;
          }
          
          .jira-status-badge {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          
          .jira-button {
            background-color: #0052CC;
            color: #FFFFFF;
            border: none;
            border-radius: 3px;
            padding: 6px 12px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .jira-button:hover {
            background-color: #0747A6;
          }
          
          .jira-button-secondary {
            background-color: #FAFBFC;
            color: #42526E;
            border: 1px solid #DFE1E6;
          }
          
          .jira-button-secondary:hover {
            background-color: #EBECF0;
          }
          
          .jira-action-button {
            background: none;
            border: none;
            color: #5E6C84;
            cursor: pointer;
            padding: 4px;
            border-radius: 3px;
            transition: all 0.2s;
          }
          
          .jira-action-button:hover {
            background-color: #F4F5F7;
            color: #0052CC;
          }
          
          .jira-modal {
            background-color: #FFFFFF;
            border-radius: 3px;
            box-shadow: 0 10px 50px rgba(9, 30, 66, 0.54);
          }
          
          .jira-modal-header {
            background-color: #FAFBFC;
            border-bottom: 1px solid #DFE1E6;
            padding: 16px 24px;
            border-radius: 3px 3px 0 0;
          }
          
          .jira-input {
            border: 2px solid #DFE1E6;
            border-radius: 3px;
            padding: 8px 12px;
            font-size: 14px;
            transition: border-color 0.2s;
            background-color: #FAFBFC;
            width: 100%;
            margin-bottom: 8px;
          }
          
          .jira-input:focus {
            border-color: #4C9AFF;
            background-color: #FFFFFF;
            outline: none;
          }
          
          .jira-count-badge {
            background-color: #0052CC;
            color: #FFFFFF;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }
        `}
      </style>

      <div style={{ display: "flex", gap: "16px" }}>
        {/* Sidebar */}
        <div className="jira-sidebar jira-container" style={{ width: "280px", height: "fit-content" }}>
          <div className="jira-header">
            <h5 style={{ margin: 0, color: "#172B4D", fontSize: "16px", fontWeight: "600" }}>Filters</h5>
            <div style={{ marginTop: "16px" }}>
              <label style={{ color: "#5E6C84", fontSize: "12px", marginBottom: "4px", display: "block" }}>Market</label>
              <MarketSelector
                selectedMarket={selectedMarket}
                setSelectedMarket={setSelectedMarket}
                isAllSelected={isAllSelected}
                setIsAllSelected={setIsAllSelected}
                markets={markets}
                text={text}
                className="jira-input"
              />
              <label style={{ color: "#5E6C84", fontSize: "12px", marginBottom: "4px", display: "block", marginTop: "8px" }}>Start Date</label>
              <input
                type="date"
                className="jira-input"
                value={startDate}
                onChange={handleStartDateChange}
              />
              <label style={{ color: "#5E6C84", fontSize: "12px", marginBottom: "4px", display: "block", marginTop: "8px" }}>End Date</label>
              <input
                type="date"
                className="jira-input"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="jira-container" style={{ flex: 1 }}>
          <div className="jira-header">
            <h4 className="mt-0" style={{ color: "#E10174" }}>NTID's Dashboard</h4>
          </div>

          <div className="row">
            <div className="col-12 col-lg-8">
              {/* Cards Section */}
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {[
                  "NTID Pending",
                  "NTID Created",
                  "Contract Signed",
                  "Contract Unsigned",
                ].map((title, index) => (
                  <div className="col" key={index}>
                    <div
                      className="card shadow-lg h-100 border-0"
                      onClick={() => handleClick(title)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="card-body text-center">
                        <h6
                          className="card-title fs-5 mt-4"
                          style={{ color: "#E10174" }}
                        >
                          {title}
                        </h6>
                        <p className="card-text fs-1">
                          {
                            [
                              counts.selectedAtHr,
                              counts.markAssigned,
                              counts.contractSigned1,
                              counts.contractSigned0,
                            ][index]
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie Chart Section */}
            <div className="col-12 col-lg-4 mt-5 mt-lg-0">
              <h5 className="text-primary text-center">Status Distribution</h5>
              <div
                style={{ height: "30rem" }}
                className="d-flex justify-content-center align-items-center w-100"
              >
                <Pie data={pieData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Ntidboard;