import { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import getStatusCounts from "../pages/getStatusCounts";
import { MyContext } from "../pages/MyContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import filteredStatuses from "../Constants/FilteredStatuseshr";
import Loader from "../utils/Loader";

ChartJS.register(ArcElement, Tooltip, Legend);

function HrHome() {
  const [stats, setStats] = useState([]);
  const navigate = useNavigate();
  const { userData } = useContext(MyContext);
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
    try {
      navigate(`/detailview/${captureStatus}`);
    } catch (error) {
      console.error("Error in handleData:", error);
    }
  };
  if (loading) {
    return <Loader />;
  }

  const TotalCount = stats
    .filter((stat) =>
      filteredStatuses.some((fStatus) => fStatus.status === stat.status)
    ) 
    .reduce((total, stat) => total + stat.count, 0); // Sum the count for matching statuses

  const pieChartData = {
    labels: filteredStatuses.map(({ status }) => status),
    datasets: [
      {
        data: filteredStatuses.map(({ status }) => {
          const stat = stats.find((stat) => stat.status === status);
          return stat ? stat.count : 0;
        }),
        backgroundColor: filteredStatuses.map(({ bgColor }) => bgColor),
        borderColor: filteredStatuses.map(() => "#fff"),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div className="container w-80 my-4">
        <div className="d-flex my-4">
          <h2 className="text-start fw-bolder">HR Dashboard</h2>
          <h2 className="ms-auto fw-bolder">{userData.name}</h2>
        </div>

        <Row className="d-flex justify-content-between">
          <Col xs={12} sm={6} md={6}>
            <Row>
              <Col xs={12} sm={6} md={4} lg={3} className="mb-2">
                <Card
                  className="shadow-sm"
                  style={{ cursor: "pointer", width: "140px", height: "150px" }}
                >
                  <Card.Body
                    className="d-flex flex-column justify-content-center"
                    onClick={() => handleData("Total3")}
                  >
                    <Card.Title
                      className="fw-bold"
                      style={{
                        textTransform: "capitalize",
                        fontFamily: "Roboto, sans-serif",
                      }}
                    >
                      {TotalCount}
                    </Card.Title>
                    <Card.Text className="fs-6 fw-bold">Total</Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              {filteredStatuses.map(({ status, bgColor }) => {
                const stat = stats.find((stat) => stat.status === status);
                return (
                  <Col
                    key={status}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    className="mb-2 gap-2"
                  >
                    <Card
                      className="shadow-sm "
                      style={{
                        cursor: "pointer",
                        backgroundColor: bgColor,
                        width: "140px",
                        height: "150px",
                      }}
                    >
                      <Card.Body
                        className="d-flex flex-column justify-content-center"
                        onClick={() => handleData(status)}
                      >
                        <Card.Title
                          className="fw-bold"
                          style={{
                            textTransform: "capitalize",
                            fontFamily: "Roboto, sans-serif",
                            color: "white",
                          }}
                        >
                          {stat ? stat.count : 0}
                        </Card.Title>
                        <Card.Text
                          className="fs-6 fw-bold"
                          style={{
                            textTransform: "capitalize",
                            color: "white",
                          }}
                        >
                          {status !== "mark_assigned"
                            ? status
                            : "mark assigned"}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>

          <Col xs={12} sm={6} md={4}>
            <Card className="shadow-sm card-style h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <Card.Title className="fw-bold text-center">
                  Status Breakdown
                </Card.Title>
                <Pie data={pieChartData} options={{ responsive: true }} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default HrHome;
