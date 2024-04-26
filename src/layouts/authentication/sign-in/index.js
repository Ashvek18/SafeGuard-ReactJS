/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
// import bgImage from "assets/images/bg-sign-in-basic.jpg";

function Basic() {
  // const [rememberMe, setRememberMe] = useState(false);

  // const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleSignIn = (event) => {
    event.preventDefault(); // Prevent the form from submitting normally

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    const data = {
      email: email,
      password: password,
    };

    fetch("https://safe-gaurd-backend.vercel.app/api/signin/", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzODgwODYzLCJpYXQiOjE3MTM4NTA4NjMsImp0aSI6IjBkNmQ1N2UxZTAwZTRlMjY5MDBhMjlkN2M4MGNjNjVhIiwidXNlcl9pZCI6MX0.HYxq5OqJS-Pi7L4FTfffLG4eO0bjPK-Og_TSGaQvTTY",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        let accessToken = data.access;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("email", email);
        // Redirect the user to the desired page after successful sign-in
        window.location.href = "../app.js";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <BasicLayout>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput id="email" type="email" label="Email" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput id="password" type="password" label="Password" fullWidth />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="secondary" fullWidth onClick={handleSignIn}>
                Sign In
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
