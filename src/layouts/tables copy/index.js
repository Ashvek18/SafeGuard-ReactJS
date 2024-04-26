import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables copy/DataTable"; // Assuming this is your reusable DataTable component
import MDAlert from "components/MDAlert";
import authorsTableData from "layouts/tables copy/data/incidentTableData"; // Import incidentTableData

function Tables() {
  const { columns: authorsColumns, rows: authorsRows } = authorsTableData();

  // const [isVisible, setIsVisible] = useState(false);
  // const [content, setContent] = useState("");
  // const [colors, setColors] = useState("");

  // const showalert = (content, colors) => {
  //   setIsVisible(true);
  //   setContent(content);
  //   setColors(colors);
  //   setTimeout(() => {
  //     setIsVisible(false);
  //   }, 2000);
  // };

  // const alertContent = (content) => (
  //   <MDTypography variant="body2" color="white">
  //     {content}
  //   </MDTypography>
  // );

  return (
    <DashboardLayout>
      {/* {isVisible && ( */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: -260,
          right: 20,
          zindex: 9999,
        }}
      >
        {/* <MDAlert color={colors} dismissible>
          {alertContent(`${content}`)}
        </MDAlert> */}
      </div>
      {/* )} */}
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h6" color="white">
              Incident Details
            </MDTypography>
          </MDBox>
          <MDBox pt={3}>
            <DataTable
              //showalert={showalert}
              table={{
                columns: Array.isArray(authorsColumns) ? authorsColumns : [],
                rows: Array.isArray(authorsRows) ? authorsRows : [],
              }}
              isSorted={true}
              showTotalEntries={true}
              noEndBorder
            />
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default Tables;
