import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { BarChart, TrendingUp, Assessment } from "@mui/icons-material";

const JVMPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          JVM Management
        </Typography>
      </Box>
    </Container>
  );
};

export default JVMPage;
