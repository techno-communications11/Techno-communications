import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../pages/MyContext";
import { useNavigate } from "react-router-dom";
import MarketSelector from "./MarketSelector";
import { Pie } from "react-chartjs-2";
import useFetchNtidDashCount from "../Hooks/useFetchNtidDashCount";
import Loader from "../utils/Loader";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function Ntidboard() {
  const [selectedMarket, setSelectedMarket] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(true); // Select all by default
  const [MarketFilter, setMarketFilter] = useState([]);
  const [startDate, setStartDate] = useState(
    () =>
      new Date(new Date().setDate(new Date().getDate() - 7))
        .toISOString()
        .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [filteredData, setFilteredData] = useState([]);
  const {data,loading,error}=useFetchNtidDashCount();
  const navigate = useNavigate();
  const {
    setStartDateForContext,
    setEndDateForContext,
    setMarkets,
    setCaptureStatus,
  } = useContext(MyContext);
  const [counts, setCounts] = useState({
    markAssigned: 0,
    selectedAtHr: 0,
    contractSigned0: 0,
    contractSigned1: 0,
  });


  const smallerFormStyles = {
    width: "200px",
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  const text = "Select Market";

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

 

  const applyFilters = (dataToFilter) => {
    let filtered = dataToFilter;
    setMarkets(selectedMarket);
    setStartDateForContext(startDate);
    setEndDateForContext(endDate);
    // Filter by market
    if (!isAllSelected && selectedMarket.length > 0) {
      filtered = filtered.filter((item) =>
        selectedMarket.includes(item.market)
      );
    }

    // Filter by date
    if (startDate && endDate) {
      // Convert startDate and endDate to Date objects
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      if (startDateObj && endDateObj) {
        // Adjust to UTC for the start and end of the day
        const adjustedStartDateUTC = new Date(
          Date.UTC(
            startDateObj.getUTCFullYear(),
            startDateObj.getUTCMonth(),
            startDateObj.getUTCDate(),
            0,
            0,
            0,
            0 // Start of the day
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
            999 // End of the day
          )
        );

        // Filter rows by checking if the joining date (in UTC) is within the range
        filtered = filtered.filter((item) => {
          const joiningDate = new Date(item.joining_date); // The row's joining_date should be in UTC format

          return (
            joiningDate >= adjustedStartDateUTC &&
            joiningDate <= adjustedEndDateUTC
          );
        });

        // console.log("After Date Filter:", filtered);
      }
    }

    setFilteredData(filtered);
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
  }, [selectedMarket, startDate, endDate, isAllSelected,data]);

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
    var status = "";
    if (title === "NTID Pending") {
      status = "selected at Hr";
    }
    if (title === "NTID Created") {
      status = "mark_assigned";
    }
    if (title === "Contract Signed") {
      status = "contract_signed1";
    }
    if (title === "Contract Unsigned") {
      status = "contract_signed0";
    }
    setCaptureStatus(status);
    // console.log(status,'sss')
    navigate("/ntiddata");
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
    <div className="container">
      <h4 className="mt-5 text-center" style={{ color: "#E10174" }}>
        NTID's Dashboard
      </h4>
      <div className="row">
        <div className="col-12 col-lg-8">
          <div className="d-flex flex-wrap justify-content-between align-items-center my-5 gap-1">
            {/* Date Selection Section */}
            <div className="col-12 col-lg-3 d-flex flex-column align-items-start">
              <span className="text-primary fw-bolder ms-3 text-start">
                Start Date:
              </span>
              <input
                className="form-control ms-2"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                style={{ color: "#E10174" }}
                placeholder="Enter Start Date"
              />
            </div>

            <div className="col-12 col-lg-3 d-flex flex-column align-items-start">
              <span className="text-primary fw-bolder ms-3 text-start">
                End Date:
              </span>
              <input
                className="form-control ms-2"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                style={{ color: "#E10174" }}
                placeholder="Enter End Date"
              />
            </div>

            <div className="col-12 col-lg-3 d-flex flex-column align-items-start">
              <span className="text-primary fw-bolder ms-3 text-start">
                Market:
              </span>
              <div className="border rounded-2 mt-3">
                <MarketSelector
                  selectedMarket={selectedMarket}
                  smallerFormStyles={smallerFormStyles}
                  text={text}
                  setSelectedMarket={setSelectedMarket}
                  isAllSelected={isAllSelected}
                  setIsAllSelected={setIsAllSelected}
                  setMarketFilter={setMarketFilter}
                />
              </div>
            </div>
          </div>

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
  );
}

export default Ntidboard;
