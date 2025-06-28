
import { Card, CardContent, Typography, Button } from '@mui/material';

const TokenExpiredCard = ({ onConfirm }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          p: 2,
          textAlign: 'center',
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography variant="h6" color="error" gutterBottom>
            Session Expired
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your session has expired. Please log out and log in again.
          </Typography>
        </CardContent>
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          sx={{ mt: 2 }}
        >
          OK
        </Button>
      </Card>
    </div>
  );
};

export default TokenExpiredCard;
