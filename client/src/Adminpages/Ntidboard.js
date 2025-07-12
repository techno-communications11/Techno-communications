import { useState, useEffect, useContext, useMemo } from "react";
import { MyContext } from "../pages/MyContext";
import { useNavigate } from "react-router-dom";
import MarketSelector from "../utils/MarketSelector";
import { Pie } from "react-chartjs-2";
import useFetchNtidDashCount from "../Hooks/useFetchNtidDashCount";
import Loader from "../utils/Loader";
import { Container } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../Styles/NtidDashboard.css";

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
  const markets = useMemo(() => {
    return data
      ? [...new Set(data.map((item) => (item.location_name || item.market || "").toLowerCase()))]
          .filter((location) => location && typeof location === "string")
          .map((location, index) => ({ id: index + 1, location_name: location || "Unknown" }))
      : [];
  }, [data]);

  const text = "Select Market";

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    if (endDate && new Date(newStartDate) > new Date(endDate)) {
      alert("Start date cannot be after end date.");
      return;
    }
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (startDate && new Date(newEndDate) < new Date(startDate)) {
      alert("End date cannot be before start date.");
      return;
    }
    setEndDate(newEndDate);
  };

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
  if (item.status?.toLowerCase() === "mark_assigned") counts.markAssigned += 1;
  if (item.status?.toLowerCase() === "selected at hr") counts.selectedAtHr += 1;
  if (item.contract_sined === 0) counts.contractSigned0 += 1;
  if (item.contract_sined === 1) counts.contractSigned1 += 1;
  if (
    item.status?.toLowerCase() !== "mark_assigned" &&
    item.status?.toLowerCase() !== "selected at hr" &&
    item.contract_sined !== 0 &&
    item.contract_sined !== 1
  ) {
    console.warn("Unexpected item:", item);
  }
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
    let captureStatus = "";
    if (title === "NTID Pending") {
      captureStatus = "selected at hr";
    } else if (title === "NTID Created") {
      captureStatus = "mark_assigned";
    } else if (title === "Contract Signed") {
      captureStatus = "contract_signed1";
    } else if (title === "Contract Unsigned") {
      captureStatus = "contract_signed0";
    }
    navigate(`/ntiddata/${captureStatus}`);
  };
   console.log(counts,'cccc');

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
                style={{ height: "50vh" }}
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