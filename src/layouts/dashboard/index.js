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
// import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Grid, Paper, Select, MenuItem } from "@mui/material";

// Dashboard components
import Chart from "chart.js/auto";
import React, { useEffect, useState } from "react";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import "font-awesome/css/font-awesome.min.css";

function Dashboard() {
  const [selectedValue, setSelectedValue] = useState("week");
  const [incidentChart, setIncidentChart] = useState(null);

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleUpdateButtonClick = () => {
    load_incident_over_time(selectedValue);
  };

  useEffect(() => {
    load_incident_over_time(selectedValue);
    fetchIncidentData("IDF");
    fetchIncidentData("RID");
    fetchIncidentData("IBC");
  }, [selectedValue]);

  function load_incident_over_time(time) {
    let incidentCanvas = document.getElementById("incidentChart");
    let url = `https://safe-gaurd-backend.vercel.app/api/incident_analytics/?unit=${time}&query_type=IOT`;

    let label, text, chartType, backgroundColor, borderColor;

    switch (time) {
      case "hour":
        label = "minutes";
        text = "minutes";
        chartType = "line";
        backgroundColor = "rgba(75, 192, 192, 0.2)";
        borderColor = "rgba(75, 192, 192, 1)";
        break;
      case "day":
        label = "hour";
        text = "hour";
        chartType = "line";
        backgroundColor = "rgba(255, 192, 203, 0.4)";
        borderColor = "rgba(255, 192, 203, 1)";
        break;
      case "week":
        label = "date";
        text = "date";
        chartType = "bar";
        backgroundColor = "rgba(178, 223, 138, 0.4)";
        borderColor = "rgba(178, 223, 138, 1)";
        break;
      case "month":
        label = "date";
        text = "date";
        chartType = "line";
        backgroundColor = "rgba(204, 153, 0, 0.4)";
        borderColor = "rgba(204, 153, 0, 1)";
        break;
      case "year":
        label = "month";
        text = "month";
        chartType = "bar";
        backgroundColor = "rgba(255, 192, 203, 0.4)";
        borderColor = "rgba(255, 192, 203, 1)";
        break;
    }

    if (incidentChart) {
      incidentChart.destroy();
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let labels = data.data.map((entry) => {
          if (time === "hour") {
            return entry.hour + ":" + entry.minute;
          } else if (time === "day") {
            return entry.hour;
          } else if (time === "week" || time === "month") {
            return entry.date;
          } else if (time === "year") {
            return entry.month + " " + entry.year;
          }
        });
        let counts = data.data.map((entry) => entry.count);
        incidentChart = new Chart(incidentCanvas, {
          type: chartType,
          data: {
            labels: labels,
            datasets: [
              {
                label: label,
                data: counts,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: text,
                },
              },
              y: {
                beginAtZero: true,
                stepSize: 10,
                precision: 0,
              },
            },
          },
        });
      })
      .catch((error) => {
        // console.error("Error retrieving incident data:", error);
      });
  }

  function fetchIncidentData(queryType) {
    fetch(`https://safe-gaurd-backend.vercel.app/api/incident_analytics/?query_type=${queryType}`)
      .then((response) => response.json())
      .then((data) => {
        switch (queryType) {
          case "IDF":
            const chartData = [data.undentified_incidents, data.identified_incidents];
            const ctx = document.getElementById("Identifiedvsunidentified").getContext("2d");
            new Chart(ctx, {
              type: "pie",
              data: {
                labels: ["Unidentified Incidents", "Identified Incidents"],
                datasets: [
                  {
                    data: chartData,
                    backgroundColor: ["#FF6384", "#36A2EB"],
                    hoverBackgroundColor: ["#FF6384", "#36A2EB"],
                  },
                ],
              },
              options: {
                responsive: true,
                legend: {
                  position: "top",
                },
                animation: {
                  animateScale: true,
                  animateRotate: true,
                },
              },
            });
            break;
          case "RID":
            const tbody = document
              .getElementById("incident-table")
              .getElementsByTagName("tbody")[0];
            for (let incident of data) {
              let row = tbody.insertRow();
              let idCell = row.insertCell();
              idCell.textContent = incident.id;
              let timestampCell = row.insertCell();
              let date = new Date(incident.timestamp);
              timestampCell.textContent =
                date.toLocaleDateString("en-GB") +
                " at " +
                date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
              let videoPathCell = row.insertCell();
              let link = document.createElement("a");
              link.href = `http://127.0.0.1:8000/${incident.video_path}`;
              link.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-eye"></i>';
              videoPathCell.appendChild(link);
            }
            break;
          case "IBC":
            document.getElementById("no-vest-count").innerText = data["No-Vest"];
            document.getElementById("no-helmet-count").innerText = data["No-Helmet"];
            document.getElementById("restricted-area-count").innerText = data["Restricted area"];
            break;
          default:
            break;
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3} mb={3}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={6} lg={6}>
            <Paper elevation={3} sx={{ padding: 6, height: "100%" }}>
              <MDTypography variant="h4" mb={4} ml="8rem" color="black">
                Incidents Over Time
              </MDTypography>
              <div
                className="d-flex align-items-center"
                style={{ marginTop: "8rem", marginLeft: "1rem" }}
              >
                <canvas id="incidentChart" height="150"></canvas>
              </div>
              <div
                className="d-flex align-items-center gap-2 w-50"
                style={{ marginTop: "5rem", marginLeft: "7rem" }}
              >
                {/* <Select
                  value={selectedValue}
                  onChange={handleSelectChange}
                  className="form-select"
                  id="unitSelect"
                  style={{ width: "100%", color: "blue" }}
                >
                  <MenuItem value="hour">Last One Hour</MenuItem>
                  <MenuItem value="day">Last 24 Hours</MenuItem>
                  <MenuItem value="week">Last 7 Days</MenuItem>
                  <MenuItem value="month">Last 30 Days</MenuItem>
                  <MenuItem value="year">Last 12 Months</MenuItem>
                </Select>
                <MDButton
                  id="update-incidents-over-time"
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateButtonClick}
                >
                  Update
                </MDButton> */}
              </div>
            </Paper>
          </Grid>
          {/* Identified vs Unidentified Incidents Chart */}
          <Grid item xs={12} md={6} lg={6}>
            <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
              <MDTypography variant="h4" mb="6rem" ml="2rem" mt="1rem" color="black">
                Identified Incidents vs Unidentified Incidents
              </MDTypography>
              <canvas id="Identifiedvsunidentified"></canvas>
            </Paper>
          </Grid>
          {/* Recent Incidents Table */}
          <Grid item xs={12} md={6} lg={6}>
            <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
              <MDTypography variant="h6" mb={4}>
                Recent Incidents
              </MDTypography>
              <table id="incident-table" className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Timestamp</th>
                    <th>Video URL</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </Paper>
          </Grid>
          {/* Incidents by Category */}
          <Grid item xs={12} md={6} lg={6}>
            <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
              <MDTypography variant="h6" mb={4}>
                Incidents by Category
              </MDTypography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Paper
                    elevation={3}
                    sx={{ p: 2, height: "100%" }}
                    style={{ background: "#FFE8CC" }}
                  >
                    <MDTypography variant="h6" mb={2} color="black">
                      Vest Incidents
                    </MDTypography>
                    <MDTypography
                      variant="h5"
                      id="no-vest-count"
                      className="counter"
                      color="black"
                    ></MDTypography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper
                    elevation={3}
                    sx={{ p: 2, height: "100%" }}
                    style={{ background: "#dfb5e3" }}
                  >
                    <MDTypography variant="h6" mb={2} color="black">
                      Helmet Incidents
                    </MDTypography>
                    <MDTypography
                      variant="h5"
                      id="no-helmet-count"
                      className="counter"
                      color="black"
                    ></MDTypography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper
                    elevation={3}
                    sx={{ p: 2, height: "100%" }}
                    style={{ background: "#DAD9FF" }}
                  >
                    <MDTypography variant="h6" mb={2} color="black">
                      Restricted Area Incidents
                    </MDTypography>
                    <MDTypography
                      variant="h5"
                      id="restricted-area-count"
                      className="counter"
                      color="black"
                    ></MDTypography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
