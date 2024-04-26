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
// @mui material components
import Grid from "@mui/material/Grid";

import image1 from "assets/images/bg-sign-in-basic.jpg";
import { Icon } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Modal from "components/Modal";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function Profile() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="text-center">
        <MDTypography variant="h2" color="text" mb={4}>
          SAFEGUARD - Tackling Workplace Risks and Insurance Frauds
        </MDTypography>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={3}>
          <DefaultInfoCard
            title="Real-Time Safety Monitoring"
            description="
          The core function ensures
          continuous real-time monitoring
          for workplace safety, fostering a
          proactive approach to identify and
          address potential risks,
          contributing to a secure
          environment."
            color="primary"
            height="13rem"
            width="18rem"
            icon="monitor"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <DefaultInfoCard
            title="Recording And Face Recognition"
            description="
          Upon detecting safety breaches,
          the system initiates automatic
          recording, capturing incidents, and
          storing precise timestamps,
          enhancing documentation for
          analysis and effective response
          strategies."
            color="warning"
            height="13rem"
            width="18rem"
            icon="person"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <DefaultInfoCard
            title="Dynamic Rule Configuration"
            description="
          Empowering users, the rule-based
          configuration allows specific
          criteria for each camera. It detects
          items such as helmets, vests,
          gloves, glasses, tailoring
          surveillance to unique safety
          needs."
            color="info"
            icon="rule"
            height="13rem"
            width="18rem"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <DefaultInfoCard
            title="Incident Reporting And Logging"
            description="
          The system's incident reporting
          swiftly sends email notifications
          for safety violations, maintaining
          centralized logs with essential
          information and identifying
          individuals in safety breaches and Other Safety Issues."
            color="error"
            icon="warning"
            height="13rem"
            width="18rem"
          />
        </Grid>
      </Grid>
      <MDBox>
        <MDTypography variant="h3" color="text" mt={3}>
          ABOUT OUR PROJECT
        </MDTypography>
      </MDBox>
      <MDBox m={1}>
        <MDTypography variant="body" color="text">
          SAFEGUARD is a comprehensive solution designed to address workplace risks and combat
          insurance fraud effectively. By employing state-of-the-art technology, it offers
          continuous real-time monitoring to ensure workplace safety. This proactive approach allows
          for the early identification and mitigation of potential risks, fostering a secure
          environment for all stakeholders. One of SAFEGUARDs standout features is its recording and
          and face recognition capabilities. When safety breaches occur, the system automatically
          initiates recording, capturing incidents with precision timestamps. This data is
          invaluable for analysis and enables the development of effective response strategies to
          mitigate future incidents. Empowering users with dynamic rule configuration, SAFEGUARD
          allows for the customization of surveillance criteria for each camera. Whether its
          detecting items like helmets, vests, gloves, or glasses, the system can be tailored to
          meet the unique safety needs of any environment. Furthermore, SAFEGUARD streamlines
          incident reporting and logging processes. Through swift email notifications for safety
          violations, the system ensures that relevant parties are promptly informed. Centralized
          logs maintain essential information, aiding in the identification of individuals involved
          in safety breaches and other safety issues. Overall, SAFEGUARD stands at the forefront of
          workplace safety technology, providing a comprehensive solution to mitigate risks and
          enhance security in any workplace setting.
        </MDTypography>
      </MDBox>
    </DashboardLayout>
  );
}
export default Profile;
