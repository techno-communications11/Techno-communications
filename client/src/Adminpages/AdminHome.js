import { Button, Grid, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import DetailCards from './DetailCards';

function AdminHome() {
    return (
        <div sx={{ mt: 3 }} className='m-4'>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container justifyContent="start" spacing={2}>
                        <Grid item>
                            <Button
                                variant="contained"
                                component={Link}
                                to="/detail"
                                sx={{ backgroundColor: "#E10174", color: "white" }}
                            >
                                Detailed View
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                component={Link}
                                to="/selectedathr"
                                sx={{ backgroundColor: "#E10174", color: "white" }}
                            >
                                HIRED APPLICANTS
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                component={Link}
                                to="/jobinfo"
                                sx={{ backgroundColor: "#E10174", color: "white" }}
                            >
                                JOB Openings
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                
                <Grid item xs={12}>
                    <DetailCards />
                </Grid>
            </Grid>
        </div>
    );
}

export default AdminHome;
