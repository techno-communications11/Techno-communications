import React, { useState, useEffect, useContext } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import getStatusCounts from "../pages/getStatusCounts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MyContext } from "../pages/MyContext";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import FilteredStatusesinterviewer from "../Constants/FilteredStatusesinterviewer";
import Loader from "../utils/Loader";

ChartJS.register(ArcElement, Tooltip, Legend);

function InterviewerDashboard() {
  const [stats, setStats] = useState([]);
  const { userData } = useContext(MyContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatusCounts = async () => {
      setLoading(true);
      try {
        const data = await getStatusCounts();
        setStats(data);
      } catch (error) {
        console.error("Error fetching status counts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatusCounts();
  }, []);

  const handleData = (captureStatus) => {
    if (captureStatus && typeof captureStatus === "string") {
      navigate(`/detailview/${captureStatus}`);
    }
  };

  const TotalCount = stats
    .filter((stat) =>
      FilteredStatusesinterviewer.some((fStatus) => fStatus.status === stat.status)
    )
    .reduce((total, stat) => total + stat.count, 0);

  const pieData = {
    labels: FilteredStatusesinterviewer.map(({ status }) => status),
    datasets: [
      {
        label: "Interview Status Distribution",
        data: FilteredStatusesinterviewer.map(({ status }) => {
          const stat = stats.find((stat) => stat.status === status) || { count: 0 };
          return stat.count;
        }),
        backgroundColor: FilteredStatusesinterviewer.map(({ bgColor }) => bgColor),
      },
    ],
  };

  if (loading) return <Loader />;

  return (
    <Container>
      <div className="d-flex my-4">
        <h2 className="fw-bolder">Interviewer Dashboard</h2>
        <h2 className="ms-auto fw-bolder">{userData.name}</h2>
      </div>

      <Row className="mb-4">
        {/* Left Pie Chart */}
        <Col xs={12} sm={6} md={6} lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h5 className="text-center mb-4">Interview Status Distribution</h5>
              <Pie data={pieData} />
            </Card.Body>
          </Card>
        </Col>

        {/* Right Cards */}
        <Col xs={12} sm={6} md={6} lg={8}>
          <Row>
            <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card
                className="shadow-sm"
                style={{
                  cursor: "pointer",
                  backgroundColor: "#F0F0F0",
                  height: "150px",
                }}
                onClick={() => handleData("Total2")}
              >
                <Card.Body className="d-flex flex-column justify-content-center">
                  <Card.Title className="fw-bold">{TotalCount}</Card.Title>
                  <Card.Text className="fs-6 fw-bold">Total</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {FilteredStatusesinterviewer.map(({ status, bgColor }) => {
              const stat = stats.find((s) => s.status === status) || { count: 0 };
              return (
                <Col key={status} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card
                    className="shadow-sm"
                    style={{
                      cursor: "pointer",
                      backgroundColor: bgColor,
                      height: "150px",
                      color: "white", // optional: ensures contrast
                    }}
                    onClick={() => handleData(status)}
                  >
                    <Card.Body className="d-flex flex-column justify-content-center">
                      <Card.Title className="fw-bold">{stat.count}</Card.Title>
                      <Card.Text className="fs-6 fw-bold" style={{ textTransform: "capitalize" }}>
                        {status}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>

      <ToastContainer />
    </Container>
  );
}

export default InterviewerDashboard;
