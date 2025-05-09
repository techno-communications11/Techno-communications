import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Container, Row } from "react-bootstrap";
import EvalutionResult from "./EvalutionResult";
import AdminInterviewd from "./AdminInterviewd";
import AdminHrEdit from "./AdminHrEdit";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function AdminTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Tabs value={value} onChange={handleChange} aria-label="centered tabs">
          <Tab label="Interview Profiles" {...a11yProps(0)} />
          <Tab label="Interviewed Profiles" {...a11yProps(1)} />
          <Tab label="  HR Pending Updates" {...a11yProps(2)} />
        </Tabs>
      </Row>

      <TabPanel value={value} index={0}>
        <AdminInterviewd />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AdminHrEdit />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <EvalutionResult />
      </TabPanel>
    </Container>
  );
}
