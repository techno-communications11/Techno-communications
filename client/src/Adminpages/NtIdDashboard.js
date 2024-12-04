import React, { useState, useEffect,useContext } from "react";
import { MyContext } from "../pages/MyContext";
import { Input } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MarketSelector from "./MarketSelector";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function NtidDashboard() {
  const [selectedMarket, setSelectedMarket] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(true); // Select all by default
  const [MarketFilter, setMarketFilter] = useState([]);
  const [startDate, setStartDate] = useState(() =>
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // const { setMarket, setCaptureDate } = MyContext();
  const navigate = useNavigate();
  const { setStartDateForContext,setEndDateForContext, setMarkets,setCaptureStatus } =
    useContext(MyContext);
  const [counts, setCounts] = useState({
    markAssigned: 0,
    selectedAtHr: 0,
    contractSigned0: 0,
    contractSigned1: 0,
  });

  const apiurl = process.env.REACT_APP_API;

  const smallerFormStyles = {
    width: "200px",
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  const text = "Select Market";

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const fetchApplicantsData = async () => {
    try {
      const response = await axios.get(`${apiurl}/applicants/ntidDashboardCount`);
      if (response.status === 200) {
        const fetchedData = response.data.data;
        setData(fetchedData);

        // Extract all unique markets
        const allMarkets = [...new Set(fetchedData.map((item) => item.market))];
        setMarketFilter(allMarkets);

        if (isAllSelected) {
          setSelectedMarket(allMarkets); // Select all markets by default
        }

        applyFilters(fetchedData);
      } else {
        console.error("Error fetching applicants data");
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  const applyFilters = (dataToFilter) => {
    let filtered = dataToFilter;
    setMarkets(selectedMarket)
    setStartDateForContext(startDate);
    setEndDateForContext(endDate);
    // Filter by market
    if (!isAllSelected && selectedMarket.length > 0) {
      filtered = filtered.filter((item) => selectedMarket.includes(item.market));
    }

    // Filter by date
    if (startDate && endDate) {
      // Convert startDate and endDate to Date objects
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
    
      if (startDateObj && endDateObj) {
        // Adjust to UTC for the start and end of the day
        const adjustedStartDateUTC = new Date(Date.UTC(
          startDateObj.getUTCFullYear(),
          startDateObj.getUTCMonth(),
          startDateObj.getUTCDate(),
          0, 0, 0, 0 // Start of the day
        ));
    
        const adjustedEndDateUTC = new Date(Date.UTC(
          endDateObj.getUTCFullYear(),
          endDateObj.getUTCMonth(),
          endDateObj.getUTCDate(),
          23, 59, 59, 999 // End of the day
        ));
    
        // Filter rows by checking if the joining date (in UTC) is within the range
        filtered = filtered.filter((item) => {
          const joiningDate = new Date(item.joining_date); // The row's joining_date should be in UTC format
    
          return joiningDate >= adjustedStartDateUTC && joiningDate <= adjustedEndDateUTC;
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
    fetchApplicantsData();
  }, []);

  useEffect(() => {
    applyFilters(data);
  }, [selectedMarket, startDate, endDate, isAllSelected]);

  const pieData = {
    labels: ["NTID Created", "NTID Pending", "Contract Signed", "Contract Unsigned"],
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

  const handleClick= (title) => {
    var status="";
    if(title==='NTID Pending'){
      status='selected at Hr'
    }
    if(title==='NTID Created'){
      status='mark_assigned'
    }
    if(title==='Contract Signed'){
      status='contract_signed1'
    }
    if(title==='Contract Unsigned'){
      status='contract_signed0'
    }
    setCaptureStatus(status);
    // console.log(status,'sss')
 navigate("/ntiddata");
  };

  return (
    <div className="container">
      <h4 className="mt-5" style={{ color: "#E10174" }}>
        NTID's Dashboard
      </h4>
      <div className="d-flex justify-content-start mt-5 gap-5">
        <div>
          <span className="text-primary fw-bolder">Start Date:</span>
          <Input
            className="ms-2"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            style={{ color: "#E10174" }}
            placeholder="Enter Start Date"
          />
        </div>
        <div>
          <span className="text-primary fw-bolder">End Date:</span>
          <Input
            className="ms-2"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            style={{ color: "#E10174" }}
            placeholder="Enter End Date"
          />
        </div>
        <div>
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

      <div className="mt-5 d-flex gap-5">
        <div className="row row-cols-1 col-md-8 row-cols-md-2 g-4">
          {["NTID Pending", "NTID Created", "Contract Signed", "Contract Unsigned"].map(
            (title, index) => (
              <div className="col" key={index}>
                <div
                  className="card shadow-sm h-100"
                  onClick={()=>handleClick(title)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body text-center">
                    <h6 className="card-title fs-5 mt-4" style={{ color: "#E10174" }}>
                      {title}
                    </h6>
                    <p className="card-text fs-1">
                      {[
                        counts.selectedAtHr,
                        counts.markAssigned,
                        counts.contractSigned1,
                        counts.contractSigned0,
                      ][index]}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <div className="ms-5 col-md-3">
          <h5 className="text-primary">Status Distribution</h5>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}

export default NtidDashboard;
