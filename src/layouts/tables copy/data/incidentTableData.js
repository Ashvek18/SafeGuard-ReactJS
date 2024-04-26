/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// Material Dashboard 2 React components
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import Modal from "components/Modal";
import axios from "axios";
import MDButton from "components/MDButton";
import Grid from "@mui/material/Grid";

export default function EmployeeData() {
  const [employeeData, setEmployeeData] = useState({ columns: [], rows: [] });
  // Function to fetch incident data
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://safe-gaurd-backend.vercel.app/api/incident/`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzODgwODYzLCJpYXQiOjE3MTM4NTA4NjMsImp0aSI6IjBkNmQ1N2UxZTAwZTRlMjY5MDBhMjlkN2M4MGNjNjVhIiwidXNlcl9pZCI6MX0.HYxq5OqJS-Pi7L4FTfffLG4eO0bjPK-Og_TSGaQvTTY",
          "Content-Type": "application/json",
        },
      });
      // Axios automatically throws an error for non-2xx status codes, so no need to check response.ok
      const incidents = response.data; // Access the response data directly
      // Fetch camera data for each incident
      const incidentsWithCameras = await Promise.all(
        incidents.map(async (incident) => {
          try {
            const cameraResponse = await axios.get(
              `https://safe-gaurd-backend.vercel.app/api/camera/${incident.camera}`,
              {
                headers: {
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzODgwODYzLCJpYXQiOjE3MTM4NTA4NjMsImp0aSI6IjBkNmQ1N2UxZTAwZTRlMjY5MDBhMjlkN2M4MGNjNjVhIiwidXNlcl9pZCI6MX0.HYxq5OqJS-Pi7L4FTfffLG4eO0bjPK-Og_TSGaQvTTY",
                  "Content-Type": "application/json",
                },
              }
            );
            const cameraData = cameraResponse.data;
            return { incident, camera: cameraData };
          } catch (error) {
            console.error("Error fetching camera data:", error);
            // Return incident with null camera data if fetching camera data fails
            return { incident, camera: null };
          }
        })
      );

      // Format data for UI rendering
      const formattedData = {
        columns: [
          { Header: "ID", accessor: "ID", width: "3%", align: "left" },
          { Header: "Camera Name", accessor: "cameraName", align: "left" },
          { Header: "Camera Location", accessor: "cameraLocation", align: "left" },
          { Header: "Timestamp", accessor: "timestamps", align: "center" },
          { Header: "Action", accessor: "identify", align: "center" },
        ],
        rows: incidentsWithCameras.map(({ incident, camera }) => ({
          ID: <ID id={incident.id} incident={incident} camera={camera} />,
          cameraName: <Cname cname={camera.name} incident={incident} camera={camera} />,
          cameraLocation: (
            <Clocation clocation={camera.location} incident={incident} camera={camera} />
          ),
          timestamps: (
            <Timestamps timestamps={incident.timestamp} incident={incident} camera={camera} />
          ),
          identify: <Identify camera={camera} incident={incident} id={incident.id} />,
        })),
      };

      setEmployeeData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  function Identify({ id, camera, incident }) {
    const handleIdentifyClick = () => {
      postIncidentData(
        id,
        incident.video_path.split("/").pop().split(".").slice(0, -1).join("."),
        camera.email_alert
      );
      console.log("his");
    };

    function postIncidentData(id, video, email) {
      axios
        .get(`http://127.0.0.1:8000/api/identify/?id=${id}&video=${video}&email=${email}`, {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzODgwODYzLCJpYXQiOjE3MTM4NTA4NjMsImp0aSI6IjBkNmQ1N2UxZTAwZTRlMjY5MDBhMjlkN2M4MGNjNjVhIiwidXNlcl9pZCI6MX0.HYxq5OqJS-Pi7L4FTfffLG4eO0bjPK-Og_TSGaQvTTY",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Data posted successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error posting incident data:", error);
        });
    }

    return (
      <>
        <MDButton variant="gradient" onClick={handleIdentifyClick} color="secondary">
          <Icon>search</Icon>
          Identify
        </MDButton>
      </>
    );
  }

  useEffect(() => {
    // Call fetchData when component mounts
    fetchData();
  }, []);
  // UI Components
  const ID = ({ id, camera, incident }) => {
    const modalId = `incimodal${id}`; // Declare modalId here
    return (
      <div data-bs-toggle="modal" data-bs-target={`#${modalId}`} style={{ cursor: "pointer" }}>
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <MDBox lineHeight={1}>
            <MDTypography display="block" variant="outlined" fontWeight="medium">
              {id}
            </MDTypography>
            <Modal id={modalId} icon="table" icoColor="primary" title="Incident Details">
              {/* Modal content */}
              <Grid container spacing={2} m={1}>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Incident ID:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {incident.id}
                  </MDTypography>
                </Grid>

                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Camera Name:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {camera ? camera.name || "N/A" : "N/A"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Camera Location:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {camera ? camera.location || "N/A" : "N/A"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Timestamp:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {incident.timestamp}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Employee:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {incident.employee}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Video Path:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2">
                    {incident.video_path ? (
                      <a href={`http://127.0.0.1:8000/${incident.video_path}`}>
                        {incident.video_path}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </MDTypography>
                </Grid>
              </Grid>
            </Modal>
          </MDBox>
        </MDBox>
      </div>
    );
  };
  const Cname = ({ cname, camera, incident }) => {
    const modalId = `incimodal${incident.id}`; // Declare modalId here
    return (
      <div data-bs-toggle="modal" data-bs-target={`#${modalId}`} style={{ cursor: "pointer" }}>
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <MDBox lineHeight={1}>
            <MDTypography display="block" variant="outlined" fontWeight="medium">
              {cname}
            </MDTypography>
            <Modal id={modalId} icon="table" icoColor="primary" title="Incident Details">
              {/* Modal content */}
              <Grid container spacing={2} m={1}>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Incident ID:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {incident.id}
                  </MDTypography>
                </Grid>

                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Camera Name:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {camera ? camera.name || "N/A" : "N/A"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Camera Location:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {camera ? camera.location || "N/A" : "N/A"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Timestamp:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {incident.timestamp}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Employee:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {incident.employee}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Video Path:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2">
                    {incident.video_path ? (
                      <a href={incident.video_path}>{incident.video_path}</a>
                    ) : (
                      "N/A"
                    )}
                  </MDTypography>
                </Grid>
              </Grid>
            </Modal>
          </MDBox>
        </MDBox>
      </div>
    );
  };

  const Clocation = ({ clocation, camera, incident }) => {
    const modalId = `incimodal${incident.id}`; // Declare modalId here
    return (
      <div data-bs-toggle="modal" data-bs-target={`#${modalId}`} style={{ cursor: "pointer" }}>
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <MDBox lineHeight={1}>
            <MDTypography display="block" variant="outlined" fontWeight="medium">
              {clocation}
            </MDTypography>
            <Modal id={modalId} icon="table" icoColor="primary" title="Incident Details">
              {/* Modal content */}
              <Grid container spacing={2} m={1}>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Incident ID:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {incident.id}
                  </MDTypography>
                </Grid>

                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Camera Name:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {camera ? camera.name || "N/A" : "N/A"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Camera Location:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {camera ? camera.location || "N/A" : "N/A"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Timestamp:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {incident.timestamp}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Employee:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {incident.employee}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Video Path:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2">
                    {incident.video_path ? (
                      <a href={incident.video_path}>{incident.video_path}</a>
                    ) : (
                      "N/A"
                    )}
                  </MDTypography>
                </Grid>
              </Grid>
            </Modal>
          </MDBox>
        </MDBox>
      </div>
    );
  };

  const Timestamps = ({ timestamps, camera, incident }) => {
    const modalId = `incimodal${incident.id}`; // Declare modalId here
    return (
      <div data-bs-toggle="modal" data-bs-target={`#${modalId}`} style={{ cursor: "pointer" }}>
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <MDBox lineHeight={1}>
            <MDTypography display="block" variant="outlined" fontWeight="medium">
              {timestamps}
            </MDTypography>
            <Modal id={modalId} icon="table" icoColor="primary" title="Incident Details">
              {/* Modal content */}
              <Grid container spacing={2} m={1}>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Incident ID:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {incident.id}
                  </MDTypography>
                </Grid>

                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Camera Name:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {camera ? camera.name || "N/A" : "N/A"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Camera Location:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {camera ? camera.location || "N/A" : "N/A"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Timestamp:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {incident.timestamp}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Employee:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    {incident.employee}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
                  <MDTypography
                    variant="body2"
                    fontWeight="medium"
                    color="textSecondary"
                    style={{ marginRight: "10px" }}
                  >
                    Video Path:&nbsp;
                  </MDTypography>
                  <MDTypography variant="body2">
                    {incident.video_path ? (
                      <a href={incident.video_path}>{incident.video_path}</a>
                    ) : (
                      "N/A"
                    )}
                  </MDTypography>
                </Grid>
              </Grid>
            </Modal>
          </MDBox>
        </MDBox>
      </div>
    );
  };

  return employeeData;
}
