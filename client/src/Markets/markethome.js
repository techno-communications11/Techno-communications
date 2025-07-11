import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Loader from "../utils/Loader";
import { useContext } from "react";
import { MyContext } from "../pages/MyContext";
import API_URL from "../Constants/ApiUrl";

 const userMarket = {
    "Ali Khan": "ARIZONA",
    "Rahim Nasir Khan": "BAY AREA",
    "Shah Noor Butt": "COLORADO",
    "Nazim Sundrani": "DALLAS",
    "Afzal Muhammad": "El Paso",
    "Adnan Barri": "HOUSTON",
    "Maaz Khan": "LOS ANGELES",
    "Mohamad Elayan": "MEMPHIS/NASHVILLE / FLORIDA",
    "Uzair Uddin": "NORTH CAROL",
    "Faizan Jiwani": "SACRAMENTO",
    "Hassan Saleem": "SAN DIEGO",
    "Kamaran Mohammed": "SAN FRANCISCO",
    "EL Paso Market ":"EL Paso"
  };

const Markethome = () => {

  const {userData} = useContext(MyContext);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true); // Default to loading true
  const userMarketLocation = userMarket[userData.name];

  const [jobDetails, setJobDetails] = useState({
    location: userMarketLocation,
    openings: "",
    deadline: "",
    posted_by: userData.name,
  });

  const handleChange = (e) => {
    setJobDetails({
      ...jobDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  

    try {
      // console.log(jobDetails, "jbs");
      const response = await axios.post(`${API_URL}/post-job`, jobDetails,{withCredentials:true});
      if (response.status === 200) {
        toast.success(response.data.message);
        setJobDetails({
          location: userMarketLocation,
          openings: "",
          // commentss: "",
          deadline: "",
          posted_by: userData.name,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1300);
      }
    } catch (err) {
      console.error("Error posting job:", err);
      toast.error("Failed to post job");
    }
  };

  useEffect(() => {
    const fetchMarketJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/getmarketjobs`,{withCredentials:true});
        const data = response.data;
        const filteredData = data.filter((val) => val.name === userMarketLocation);
        setMarkets(filteredData);

       
        // setIsMonthlyLimitReached(isPostedThisMonth);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching market job openings:", error);
        setLoading(false); // Ensure loading is stopped even if there's an error
      }
    };

    fetchMarketJobs();
  }, [userMarketLocation]);

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f7f9fc", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 1, textAlign: "center", fontWeight: 600 }}>
        Market Job Listings
      </Typography>

      <Alert severity="info" sx={{ mb: 1 }}>
        You can post only once in a month. Ensure all details are accurate.
      </Alert>

      <Grid container spacing={1}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Post a Job
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Market"
                  name="location"
                  value={jobDetails.location}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Number of Openings"
                  name="openings"
                  type="number"
                  value={jobDetails.openings}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                />
               
                <TextField
                  label="Application Deadline"
                  name="deadline"
                  type="date"
                  value={jobDetails.deadline}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontWeight: "bold",
                    // backgroundColor: isMonthlyLimitReached ? "grey" : "#1976d2",
                  }}
                  // disabled={isMonthlyLimitReached}
                >
                  Post Job
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Table Section */}
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper} elevation={4}>
            <h4 className="p-2 text-capitalize">Previously Listed Jobs</h4>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#E10174" }}>
                  {["Market", "Openings", "Posted By", "Comments", "Created At", "Deadline"].map((head) => (
                    <TableCell key={head} sx={{ color: "#fff", fontWeight: "bold" }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {markets.length > 0 ? (
                  markets.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).map((market) => (
                    <TableRow key={market.id} hover>
                      <TableCell>{market.name}</TableCell>
                      <TableCell>{market.openings}</TableCell>
                      <TableCell>{market.posted_by}</TableCell>
                      {/* <TableCell className="text-center">{market.comments ? market.comments : '-'}</TableCell> */}
                      <TableCell>{new Date(market.created_at).toLocaleDateString("en-US")}</TableCell>
                      <TableCell>{new Date(market.deadline).toLocaleDateString("en-US")}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      {loading ? (
                        <Loader/>
                      ) : (
                        "No jobs available"
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default Markethome;
