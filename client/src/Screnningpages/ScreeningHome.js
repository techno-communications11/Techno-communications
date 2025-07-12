import { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import getStatusCounts from "../pages/getStatusCounts"; // Mock implementation
import { useContext } from "react";
import { MyContext } from "../pages/MyContext";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { IoIosArrowForward } from "react-icons/io";
import Loader from "../utils/Loader";
ChartJS.register(ArcElement, Tooltip, Legend);

const filteredStatuses = [
  { status: "pending at Screening", bgcolor: "#f0ad4e" },
  { status: "no show at Screening", bgcolor: "#d9534f" },
  { status: "Not Interested at screening", bgcolor: "#5bc0de" },
  { status: "rejected at Screening", bgcolor: "#d9534f" },
  { status: "moved to Interview", bgcolor: "#5cb85c" },
];

function ScreeningHome() {
  const [stats, setStats] = useState([]);
  const navigate = useNavigate();
  const { userData } = useContext(MyContext) || { name: "Guest" }; // Fallback
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

  const TotalCount = stats
    .filter((stat) =>
      filteredStatuses.some((fStatus) => fStatus.status === stat.status)
    )
    .reduce((total, stat) => total + stat.count, 0);

  const pieChartData = {
    labels: filteredStatuses.map((status) => status.status),
    datasets: [
      {
        data: filteredStatuses.map((status) => {
          const stat = stats.find((stat) => stat.status === status.status);
          return stat ? stat.count : 0;
        }),
        backgroundColor: filteredStatuses.map((status) => status.bgcolor),
        hoverOffset: 4,
      },
    ],
  };

  const handleShow = (captureStatus) => {
    try {
      if (captureStatus && typeof captureStatus === "string") {
        navigate(`/detailview/${encodeURIComponent(captureStatus)}`);
      } else {
        console.error("Invalid captureStatus:", captureStatus);
      }
    } catch (error) {
      console.error("Error in handleShow:", error);
    }
  };

  if (loading) {
    return (<Loader />);
  }

  return (
    <Container style={{ minHeight: "80vh" }}>
      <div className="d-flex my-4">
        <h2 className="text-start fw-bolder">{`Screening Dashboard`}</h2>
        <h2 className="ms-auto fw-bolder">{userData.name}</h2>
      </div>

      <Link
        to="/marketjobopenings"
        className="d-flex justify-content-end mb-2"
        style={{ textDecoration: "none" }}
      >
        <h5 className="mb-0">Market Job Openings </h5>
        <IoIosArrowForward size={24} style={{ marginLeft: "8px" }} />
      </Link>

      <Row className="mb-4">
        <Col xs={12} md={6} className="mb-4">
          <Row>
            <Col xs={12} sm={6} md={4} lg={4} className="mb-4">
              <Card
                className="shadow-sm h-100"
                style={{
                  backgroundColor: "#0275d8",
                  cursor: "pointer",
                  color: "white",
                  border: "none", // Remove default border
                }}
                onClick={() => handleShow("Total1")}
              >
                <Card.Body className="d-flex flex-column justify-content-center">
                  <Card.Title className="fw-bold" style={{ fontSize: "2rem" }}>
                    {TotalCount}
                  </Card.Title>
                  <Card.Text className="fs-6 fw-bold">Total</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {filteredStatuses.map(({ status, bgcolor }) => {
              const stat = stats.find((stat) => stat.status === status);
              return (
                <Col key={status} xs={12} sm={6} md={4} lg={4} className="mb-4">
                  <Card
                    className="shadow-sm h-100 custom-card" // Added custom class
                    style={{
                      backgroundColor: bgcolor,
                      cursor: "pointer",
                      color: "white",
                      border: "none", // Remove default border
                    }}
                    onClick={() => handleShow(status)}
                  >
                    <Card.Body className="d-flex flex-column justify-content-center">
                      <Card.Title
                        className="fw-bold"
                        style={{ fontSize: "2rem" }}
                      >
                        {stat ? stat.count : 0}
                      </Card.Title>
                      <Card.Text
                        className="fs-6 fw-bold"
                        style={{ textTransform: "capitalize" }}
                      >
                        {status}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Col>

        <Col xs={12} md={4} className="mb-4 ms-auto">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold" style={{ fontSize: "1.5rem" }}>
                Status Distribution
              </Card.Title>
              <Pie data={pieChartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ScreeningHome;