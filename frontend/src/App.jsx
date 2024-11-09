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
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Link as ScrollLink, Element, scroller } from "react-scroll";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
          Medicost
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

import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#E91E63", // Magenta
      light: "#F48FB1",
      dark: "#C2185B",
    },
    secondary: {
      main: "#212121", // Dark gray/black
      light: "#484848",
      dark: "#000000",
    },
    background: {
      default: "#1a1a1a",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
});

const App = () => {
  const [selectedTest, setSelectedTest] = useState("MRI");
  const [selectedInsurance, setSelectedInsurance] = useState("Life Insurance");
  const [insuranceHospitals, setInsuranceHospitals] = useState([]);

  const handleTestChange = (event) => {
    setSelectedTest(event.target.value);
  };

  useEffect(() => {
    const randomHospitals = getRandomHospitals(preprocessedHospitalData, 5);
    setInsuranceHospitals(randomHospitals);
  }, []);

  const handleInsuranceChange = (event) => {
    setSelectedInsurance(event.target.value);
    const randomHospitals = getRandomHospitals(preprocessedHospitalData, 5);
    setInsuranceHospitals(randomHospitals);
  };

  const sortedHospitals = sortHospitals(preprocessedHospitalData, selectedTest);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ background: "rgba(33, 33, 33, 0.95)" }}>
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                color: theme.palette.primary.main,
                fontWeight: "bold",
              }}
            >
              MEDICOST
            </Typography>
            <Button
              color="inherit"
              component={ScrollLink}
              to="home"
              smooth={true}
              duration={500}
              sx={{ mx: 1 }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={ScrollLink}
              to="price"
              smooth={true}
              duration={500}
              sx={{ mx: 1 }}
            >
              Prices
            </Button>
            <Button
              color="inherit"
              component={ScrollLink}
              to="insurance"
              smooth={true}
              duration={500}
              sx={{ mx: 1 }}
            >
              Insurance
            </Button>
            <Button
              color="inherit"
              component={ScrollLink}
              to="about-us"
              smooth={true}
              duration={500}
              sx={{ mx: 1 }}
            >
              About Us
            </Button>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Element name="home">
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              background: `linear-gradient(to right, ${theme.palette.secondary.main} 50%, ${theme.palette.primary.main} 50%)`,
              pt: 8,
            }}
          >
            <Container
              maxWidth="lg"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ color: "white", pr: 4 }}>
                    <Typography variant="h2" gutterBottom>
                      Smart Healthcare
                      <Typography
                        component="span"
                        variant="h2"
                        sx={{ color: theme.palette.primary.main }}
                      >
                        {" "}
                        Decisions
                      </Typography>
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ mb: 4, color: "rgba(255,255,255,0.9)" }}
                    >
                      Compare prices, find insurance coverage, and make informed
                      healthcare choices
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ mr: 2 }}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        color: "white",
                        borderColor: "white",
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: "rgba(233, 30, 99, 0.1)",
                        },
                      }}
                      size="large"
                    >
                      Learn More
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src="/homepage_photo.jpg" // Replace with your image path
                    alt="Healthcare Professional"
                    sx={{
                      width: "100%",
                      maxWidth: 600,
                      height: "auto",
                      borderRadius: 2,
                      // boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                      padding: 11,
                    }}
                  />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Element>

        {/* Price Comparison Section */}
        <Element name="price">
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              background: `linear-gradient(to right, ${theme.palette.secondary.main} 100%, ${theme.palette.primary.main} 0%)`,
              pt: 8,
            }}
          >
            <Container maxWidth="lg">
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Hospital Price Comparison
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography
                    variant="h3"
                    sx={{
                      textAlign: "center",
                      mb: 6,
                      color: theme.palette.primary.main,
                      fontWeight: theme.typography.h2.fontWeight,
                    }}
                  >
                    Hospital Price Comparison
                  </Typography>

                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      borderRadius: 2,
                      backgroundColor: "#ADD9F4",
                    }}
                  >
                    <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
                      <InputLabel>Select Test</InputLabel>
                      <Select
                        value={selectedTest}
                        onChange={handleTestChange}
                        label="Select Test"
                        sx={{ bgcolor: "background.paper" }}
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

                    <TableContainer
                      component={Paper}
                      sx={{
                        borderRadius: 1,
                        boxShadow: 2,
                        backgroundColor: "#CDC5B4",
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: "grey.50" }}>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Hospital
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              Min Price (₹)
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              Max Price (₹)
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              Rating
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              Website
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              Score
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sortedHospitals.map((hospital) => (
                            <TableRow
                              key={hospital.Hospital}
                              sx={{ "&:hover": { bgcolor: "grey.50" } }}
                            >
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
                                  sx={{
                                    color: "primary.main",
                                    textDecoration: "none",
                                    "&:hover": {
                                      color: "primary.dark",
                                      textDecoration: "underline",
                                    },
                                  }}
                                >
                                  Visit Site
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
                </AccordionDetails>
              </Accordion>
            </Container>
          </Box>
        </Element>

        {/* Insurance Section */}
        <Element name="insurance">
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              background: `linear-gradient(to right, ${theme.palette.secondary.main} 100%, ${theme.palette.primary.main} 0%)`,
              pt: 8,
            }}
          >
            <Container maxWidth="lg">
              <Typography
                variant="h3"
                sx={{
                  textAlign: "center",
                  mb: 6,
                  color: theme.palette.primary.main,
                  fontWeight: theme.typography.h2.fontWeight,
                }}
              >
                Insurance Providers
              </Typography>

              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  backgroundColor: "#ADD9F4",
                }}
              >
                <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
                  <InputLabel>Select Insurance Type</InputLabel>
                  <Select
                    value={selectedInsurance}
                    onChange={handleInsuranceChange}
                    label="Select Insurance Type"
                    sx={{ bgcolor: "background.paper" }}
                  >
                    <MenuItem value="Life Insurance">Life Insurance</MenuItem>
                    <MenuItem value="Health Insurance">
                      Health Insurance
                    </MenuItem>
                  </Select>
                </FormControl>

                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 1,
                    boxShadow: 2,
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "grey.50" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Hospital</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Location
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Insurance Type
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Website
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {insuranceHospitals.map((hospital) => (
                        <TableRow
                          key={hospital.Hospital}
                          sx={{ "&:hover": { bgcolor: "grey.50" } }}
                        >
                          <TableCell>{hospital.Hospital}</TableCell>
                          <TableCell align="right">
                            {hospital.Location}
                          </TableCell>
                          <TableCell align="right">
                            {selectedInsurance}
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
                              sx={{
                                color: "primary.main",
                                textDecoration: "none",
                                "&:hover": {
                                  color: "primary.dark",
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              Visit Site
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Container>
          </Box>
        </Element>

        {/* Reviews Section */}
        <Element name="reviews">
          <Box
            sx={{
              minHeight: "100vh",
              py: 10,
              bgcolor: "background.paper",
            }}
          >
            <Container maxWidth="lg">
              <Typography
                variant="h3"
                sx={{
                  textAlign: "center",
                  mb: 6,
                  color: "text.primary",
                  fontWeight: theme.typography.h2.fontWeight,
                }}
              >
                Customer Reviews
              </Typography>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Leave a Review
                </Typography>
                <TextField
                  fullWidth
                  label="Your Review"
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{ mb: 4 }}
                />
                <Button variant="contained" color="primary" size="large">
                  Submit Review
                </Button>
              </Paper>
              <Box mt={6}>
                <Typography variant="h6" gutterBottom>
                  Recent Reviews
                </Typography>
                {/* Example review */}
                <Paper sx={{ p: 3, mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    User 1
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Great service, very helpful in comparing prices.
                  </Typography>
                </Paper>
                {/* More reviews can be mapped here */}
              </Box>
            </Container>
          </Box>
        </Element>

        {/* Upload Bills Section */}
        <Element name="upload-bills">
          <Box
            sx={{
              minHeight: "100vh",
              py: 10,
              bgcolor: "background.paper",
            }}
          >
            <Container maxWidth="lg">
              <Typography
                variant="h3"
                sx={{
                  textAlign: "center",
                  mb: 6,
                  color: "text.primary",
                  fontWeight: theme.typography.h2.fontWeight,
                }}
              >
                Upload Hospital Bills
              </Typography>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Upload your bill for analysis
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                  sx={{ mb: 4 }}
                >
                  Upload File
                  <input type="file" hidden />
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Accepted file formats: PDF, JPEG, PNG
                </Typography>
              </Paper>
              <Box mt={6}>
                <Typography variant="h6" gutterBottom>
                  Analysis Dashboard
                </Typography>
                <iframe
                  width="1080"
                  height="760"
                  src="https://community.fabric.microsoft.com/t5/Data-Stories-Gallery/Crypto-Tracker-Dashboard/td-p/4274216"
                  frameborder="0"
                  allowFullScreen="true"
                ></iframe>
              </Box>
            </Container>
          </Box>
        </Element>

        {/* Enhanced About Us Section */}
        <Element name="about-us">
          <Box
            sx={{
              minHeight: "100vh",
              py: 8,
              bgcolor: theme.palette.secondary.main,
              color: "white",
            }}
          >
            <Container maxWidth="lg">
              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h3" gutterBottom>
                    About MediCost
                  </Typography>
                  <Typography
                    variant="h6"
                    paragraph
                    sx={{ color: "rgba(255,255,255,0.9)" }}
                  >
                    Revolutionizing Healthcare Decision Making
                  </Typography>
                  <Typography paragraph sx={{ color: "rgba(255,255,255,0.7)" }}>
                    Founded in 2023, Medcost emerged from a simple yet powerful
                    idea: healthcare decisions shouldn't be complicated. We
                    believe in transparency, accessibility, and empowering
                    patients with the information they need.
                  </Typography>
                  <Typography paragraph sx={{ color: "rgba(255,255,255,0.7)" }}>
                    Our platform combines cutting-edge technology with
                    comprehensive healthcare data to provide you with accurate,
                    real-time price comparisons and insurance information from
                    top healthcare providers across the country.
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Typography variant="h4" color="primary" gutterBottom>
                          500+
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "rgba(255,255,255,0.7)" }}
                        >
                          Partner Hospitals
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h4" color="primary" gutterBottom>
                          50K+
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "rgba(255,255,255,0.7)" }}
                        >
                          Happy Patients
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Card
                        sx={{
                          bgcolor: "rgba(255,255,255,0.05)",
                          color: "white",
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" color="primary" gutterBottom>
                            Our Mission
                          </Typography>
                          <Typography>
                            To make healthcare pricing transparent and
                            accessible to everyone, enabling informed decisions
                            for better health outcomes.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Card
                        sx={{
                          bgcolor: "rgba(255,255,255,0.05)",
                          color: "white",
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" color="primary" gutterBottom>
                            Our Values
                          </Typography>
                          <Typography paragraph>
                            • Transparency in healthcare pricing
                          </Typography>
                          <Typography paragraph>
                            • Patient-centered decision making
                          </Typography>
                          <Typography paragraph>
                            • Innovation in healthcare technology
                          </Typography>
                          <Typography>• Commitment to data accuracy</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Element>
      </Box>
    </ThemeProvider>
  );
};

export default App;
