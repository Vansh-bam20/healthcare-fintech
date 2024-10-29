import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Typography,
  Box,
} from "@mui/material";
import hospitalData from "../healthcare_hospital_data.json";

// Preprocess the data: convert price strings into arrays of [lower, upper]
const preprocessData = (data) => {
  return data.map((hospital) => {
    Object.keys(hospital).forEach((key) => {
      if (key.includes("Price") && typeof hospital[key] === "string") {
        const priceRange = hospital[key]
          .split(" - ")
          .map((price) => parseInt(price.replace(/,/g, ""), 10) || 0); // Parse and handle commas
        hospital[key] =
          priceRange.length === 2 ? priceRange : [priceRange[0], priceRange[0]]; // Set lower-upper price range
      }
    });
    return hospital;
  });
};

// Preprocess the hospital data
const preprocessedHospitalData = preprocessData(hospitalData);

// Calculate score based on price and rating
function calculateScore(
  hospital,
  testType,
  maxPrice,
  maxRating,
  priceWeight = 0.7,
  ratingWeight = 0.3
) {
  const price = hospital[`${testType} Price`][0]; // Lower bound price
  const rating = hospital["Rating (Out of 5)"];
  const score =
    (1 - price / maxPrice) * priceWeight + (rating / maxRating) * ratingWeight;
  return score;
}

// Sort hospitals based on the selected test and score
function sortHospitals(hospitals, testType) {
  const maxPrice = Math.max(
    ...hospitals.map((hospital) => hospital[`${testType} Price`][0])
  );
  const maxRating = 5; // Maximum rating is 5

  const hospitalsWithScore = hospitals.map((hospital) => ({
    ...hospital,
    score: calculateScore(hospital, testType, maxPrice, maxRating),
    minPrice: hospital[`${testType} Price`][0],
    maxPrice: hospital[`${testType} Price`][1],
  }));

  hospitalsWithScore.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.minPrice - b.minPrice;
  });

  return hospitalsWithScore;
}

function App() {
  const [selectedTest, setSelectedTest] = useState("MRI");

  const handleTestChange = (event) => {
    setSelectedTest(event.target.value);
  };

  const sortedHospitals = sortHospitals(preprocessedHospitalData, selectedTest);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Hospital Price Comparison
      </Typography>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: "800px",
          margin: "0 auto",
          borderRadius: 3,
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
          <InputLabel>Select Test</InputLabel>
          <Select
            value={selectedTest}
            onChange={handleTestChange}
            label="Select Test"
          >
            <MenuItem value="MRI">MRI</MenuItem>
            <MenuItem value="Blood Test">Blood Test</MenuItem>
            <MenuItem value="Urine Test">Urine Test</MenuItem>
            <MenuItem value="CT">CT</MenuItem>
            <MenuItem value="X-ray">X-ray</MenuItem>
            <MenuItem value="USG">USG</MenuItem>
            <MenuItem value="Surgery">Surgery</MenuItem>
          </Select>
        </FormControl>

        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell>Hospital</TableCell>
                <TableCell align="right">Min Price (₹)</TableCell>
                <TableCell align="right">Max Price (₹)</TableCell>
                <TableCell align="right">Rating</TableCell>
                <TableCell align="right">Website</TableCell>
                <TableCell align="right">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedHospitals.map((hospital) => (
                <TableRow key={hospital.Hospital}>
                  <TableCell>{hospital.Hospital}</TableCell>
                  <TableCell align="right">₹{hospital.minPrice}</TableCell>
                  <TableCell align="right">₹{hospital.maxPrice}</TableCell>
                  <TableCell align="right">
                    {hospital["Rating (Out of 5)"]}
                  </TableCell>
                  <TableCell align="right">
                  <Link
    href={
      hospital.Website.startsWith("http://") || hospital.Website.startsWith("https://")
        ? hospital.Website
        : `https://${hospital.Website}`
    }
    target="_blank"
    rel="noopener"
    underline="hover"
  >
                      {hospital.Website}
                    </Link>
                  </TableCell>
                  <TableCell align="right">
                    {hospital.score.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default App;
