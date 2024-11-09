import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
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
  Box,
  Container,
  TextField,
} from "@mui/material";
import { Link as ScrollLink, Element, scroller } from "react-scroll";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import hospitalData from "../healthcare_hospital_data.json";

// Preprocess the data: convert price strings into arrays of [lower, upper]
const preprocessData = (data) => {
  return data.map((hospital) => {
    Object.keys(hospital).forEach((key) => {
      if (key.includes("Price") && typeof hospital[key] === "string") {
        const priceRange = hospital[key]
          .split(" - ")
          .map((price) => parseInt(price.replace(/,/g, ""), 10) || 0);
        hospital[key] =
          priceRange.length === 2 ? priceRange : [priceRange[0], priceRange[0]];
      }
    });
    return hospital;
  });
};

const preprocessedHospitalData = preprocessData(hospitalData);

function calculateScore(
  hospital,
  testType,
  maxPrice,
  maxRating,
  priceWeight = 0.7,
  ratingWeight = 0.3
) {
  const price = hospital[`${testType} Price`][0];
  const rating = hospital["Rating (Out of 5)"];
  const score =
    (1 - price / maxPrice) * priceWeight + (rating / maxRating) * ratingWeight;
  return score;
}

function getRandomHospitals(hospitals, count) {
  const shuffled = [...hospitals].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function sortHospitals(hospitals, testType) {
  const maxPrice = Math.max(
    ...hospitals.map((hospital) => hospital[`${testType} Price`][0])
  );
  const maxRating = 5;

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

function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#003366" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "700" }}>
          Medcodt
        </Typography>
        {["Home", "Price", "Reviews", "Insurance", "About Us", "Dashboard"].map(
          (section) => (
            <ScrollLink
              key={section}
              to={section.toLowerCase().replace(" ", "-")}
              smooth={true}
              duration={500}
            >
              <Button color="inherit">{section}</Button>
            </ScrollLink>
          )
        )}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const [selectedTest, setSelectedTest] = useState("MRI");
  const [selectedInsurance, setSelectedInsurance] = useState("Life Insurance");
  const [insuranceHospitals, setInsuranceHospitals] = useState([]);

  const handleTestChange = (event) => {
    setSelectedTest(event.target.value);
  };

  useEffect(() => {
    // Load default data for Life Insurance when the page loads
    const randomHospitals = getRandomHospitals(preprocessedHospitalData, 5);
    setInsuranceHospitals(randomHospitals);
  }, []);

  const handleInsuranceChange = (event) => {
    setSelectedInsurance(event.target.value);
    const randomHospitals = getRandomHospitals(preprocessedHospitalData, 5); // Display 5 random hospitals for selected insurance
    setInsuranceHospitals(randomHospitals);
  };

  const sortedHospitals = sortHospitals(preprocessedHospitalData, selectedTest);

  return (
    <>
      <Navbar />
      <Container>
        <Box
          id="home"
          sx={{
            p: 4,
            textAlign: "center",
            backgroundImage: "url(src/assets/home_icon.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
          }}
        >
          <Typography variant="h3" gutterBottom>
            Welcome to Medcodt
          </Typography>
          <Typography variant="body1">
            Medcodt offers reliable and transparent hospital price comparisons
            to help you find the best care at an affordable price. We aim to
            empower patients with information for informed healthcare decisions.
          </Typography>
        </Box>

        <Element id="price" name="price">
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h4">Hospital Price Comparison</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{ p: 4, backgroundColor: "#f3f6fb", textAlign: "center" }}
              >
                <Paper
                  elevation={3}
                  sx={{ p: 4, maxWidth: "800px", margin: "auto" }}
                >
                  <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
                    <InputLabel>Select Test</InputLabel>
                    <Select
                      value={selectedTest}
                      onChange={handleTestChange}
                      label="Select Test"
                    >
                      {[
                        "MRI",
                        "Blood Test",
                        "Urine Test",
                        "CT",
                        "X-ray",
                        "USG",
                        "Surgery",
                      ].map((test) => (
                        <MenuItem key={test} value={test}>
                          {test}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
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
                            <TableCell align="right">
                              ₹{hospital.minPrice}
                            </TableCell>
                            <TableCell align="right">
                              ₹{hospital.maxPrice}
                            </TableCell>
                            <TableCell align="right">
                              {hospital["Rating (Out of 5)"]}
                            </TableCell>
                            <TableCell align="right">
                              <Link
                                href={
                                  hospital.Website.startsWith("http")
                                    ? hospital.Website
                                    : `https://${hospital.Website}`
                                }
                                target="_blank"
                                rel="noopener"
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
            </AccordionDetails>
          </Accordion>
        </Element>

        <Element id="insurance" name="insurance">
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              Insurance Providers
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
              <InputLabel>Select Insurance Type</InputLabel>
              <Select
                value={selectedInsurance}
                onChange={handleInsuranceChange}
                label="Select Insurance Type"
                defaultValue="Life Insurance"
              >
                <MenuItem value="Life Insurance">Life Insurance</MenuItem>
                <MenuItem value="Health Insurance">Health Insurance</MenuItem>
              </Select>
            </FormControl>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Hospital</TableCell>
                    <TableCell align="right">Location</TableCell>
                    <TableCell align="right">Insurance Type</TableCell>
                    <TableCell align="right">Website</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {insuranceHospitals.map((hospital) => (
                    <TableRow key={hospital.Hospital}>
                      <TableCell>{hospital.Hospital}</TableCell>
                      <TableCell align="right">{hospital.Location}</TableCell>
                      <TableCell align="right">{selectedInsurance}</TableCell>
                      <TableCell align="right">
                        <Link
                          href={
                            hospital.Website.startsWith("http")
                              ? hospital.Website
                              : `https://${hospital.Website}`
                          }
                          target="_blank"
                          rel="noopener"
                        >
                          {hospital.Website}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Element>

        <Element id="about-us" name="about-us">
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body1">
              Medcodt is dedicated to providing transparent healthcare data and
              accessible pricing comparisons. We strive to improve healthcare
              decision-making by connecting patients with reliable information.
            </Typography>
          </Box>
        </Element>
      </Container>
    </>
  );
}

export default App;
