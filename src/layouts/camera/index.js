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
import "font-awesome/css/font-awesome.min.css";

function Billing() {
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [cardsData, setCardsData] = useState([]);
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  const backgroundImageRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    source: "",
    email_alert: "",
  });
  const [selectedCamera, setSelectedCamera] = useState(null);

  const canvasRef = useRef(null);
  const infoPointsRef = useRef(null);
  let clickPoints = [];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const infoPoints = infoPointsRef.current;

    const loadBackgroundImage = () => {
      const image = new Image();
      image.onload = () => handleCanvasLoad(image); // Pass image as an argument

      // Fetch the image from the API endpoint
      fetch("http://127.0.0.1:8000/api/camera/")
        .then((response) => response.json())
        .then((data) => {
          // Check if data.rtsp_frame is available
          const imageUrl = data.rtsp_frame ? data.rtsp_frame : image1; // Fall back to static image1 if data.rtsp_frame is not available

          // Set the background image source
          image.src = imageUrl;
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    };

    // Callback function for when the image is loaded
    const handleCanvasLoad = (image) => {
      setCanvasLoaded(true);

      // Calculate the aspect ratio of the image
      const aspectRatio = image.width / image.height;

      // Determine the maximum width and height that fit inside the canvas container
      const canvasContainer = document.getElementById("myCanvas");
      const containerStyle = window.getComputedStyle(canvasContainer);
      const maxWidth =
        canvasContainer.offsetWidth -
        parseFloat(containerStyle.paddingLeft) -
        parseFloat(containerStyle.paddingRight); // Subtract padding from the container width
      const maxHeight =
        canvasContainer.offsetHeight -
        parseFloat(containerStyle.paddingTop) -
        parseFloat(containerStyle.paddingBottom); // Subtract padding from the container height

      // Calculate the scaled width and height based on the aspect ratio
      let scaledWidth = maxWidth;
      let scaledHeight = scaledWidth / aspectRatio;

      // If the scaled height exceeds the maximum height, scale based on height instead
      if (scaledHeight > maxHeight) {
        scaledHeight = maxHeight;
        scaledWidth = scaledHeight * aspectRatio;

        // Recalculate the aspect ratio using the new scaled dimensions
        // This ensures that images with short heights are displayed properly
        aspectRatio = scaledWidth / scaledHeight;
      }

      // Set the canvas dimensions to match the scaled size
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;

      // Center the image within the canvas
      const offsetX = (maxWidth - scaledWidth) / 2;
      const offsetY = (maxHeight - scaledHeight) / 2;

      // Clear the canvas
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the image onto the canvas with the calculated dimensions and position
      ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight);
    };

    // Call the loadBackgroundImage function to start loading the image
    loadBackgroundImage();

    const handleCanvasClick = (evt) => {
      // console.log("Canvas clicked at:", evt.offsetX, evt.offsetY);
      setSelectedPoints((prevPoints) => [...prevPoints, [evt.offsetX, evt.offsetY]]);
      clickPoints.push([evt.offsetX, evt.offsetY]); // For drawing
      // console.log("clickPoints:", clickPoints);
      drawDot(evt.offsetX, evt.offsetY);
      infoPoints.textContent = clickPoints.join(" : ");
      if (clickPoints.length === 4) {
        // console.log("Four points selected. Drawing polygon.");
        drawPoly(clickPoints);
        // logPointsAndCheckboxes();
        clickPoints = []; // Clear clickPoints after drawing
      }
    };

    const drawDot = (x, y) => {
      // ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing new point
      for (let i = 0; i < clickPoints.length; i++) {
        ctx.beginPath();
        ctx.arc(clickPoints[i][0], clickPoints[i][1], 3, 0, 2 * Math.PI);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
      }
    };

    const drawPoly = (points) => {
      // ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing polygon
      ctx.lineWidth = 2;
      let split = points.splice(0, 4);

      ctx.beginPath();
      ctx.moveTo(split[0][0], split[0][1]);
      for (let i of split.reverse()) ctx.lineTo(i[0], i[1]);
      ctx.strokeStyle = "#FF0000";
      ctx.stroke();
    };

    canvas.addEventListener("click", handleCanvasClick);

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
      setCanvasLoaded(false);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetform = () => {
    setFormData({
      name: "",
      location: "",
      description: "",
      source: "",
      email_alert: "",
    });
    setSelectedPoints([]);
  };

  const deleteCamera = async (id) => {
    try {
      await axios.delete(`https://safe-gaurd-backend.vercel.app/api/camera/${id}/`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzODgwODYzLCJpYXQiOjE3MTM4NTA4NjMsImp0aSI6IjBkNmQ1N2UxZTAwZTRlMjY5MDBhMjlkN2M4MGNjNjVhIiwidXNlcl9pZCI6MX0.HYxq5OqJS-Pi7L4FTfffLG4eO0bjPK-Og_TSGaQvTTY",
          "Content-Type": "application/json",
        },
      });

      // Close the modal
      const modalElement = document.getElementById(`confirmDeleteModal${id}`);
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();

      // Reload the page
      // window.location.reload();
      fetchDataForCards();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if exactly 4 points are selected
    if (selectedPoints.length !== 4) {
      console.log("Exactly 4 points must be selected. Cannot submit.");
      return;
    }

    // Get checkbox values
    const helmetChecked = document.getElementById("helmet").checked;
    const vestChecked = document.getElementById("vest").checked;

    // Construct payload object with form data, checkbox values, and selected points
    const payload = {
      name: formData.name,
      location: formData.location,
      description: formData.description,
      source: formData.source,
      helmet: helmetChecked,
      vest: vestChecked,
      polygons: selectedPoints.map((point) => point.join(",")).join(" : "),
      email_alert: formData.email_alert,
    };

    // Send payload to the API using Axios
    axios
      .post("https://safe-gaurd-backend.vercel.app/api/camera/", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzODgwODYzLCJpYXQiOjE3MTM4NTA4NjMsImp0aSI6IjBkNmQ1N2UxZTAwZTRlMjY5MDBhMjlkN2M4MGNjNjVhIiwidXNlcl9pZCI6MX0.HYxq5OqJS-Pi7L4FTfffLG4eO0bjPK-Og_TSGaQvTTY",
        },
      })
      .then((response) => {
        console.log("Response from API:", response.data);
        // Optionally handle success response
        fetchDataForCards();
      })
      .catch((error) => {
        console.error("Error sending form data:", error);
        // Optionally handle error
      });

    // Clear form after submission
    setFormData({
      name: "",
      location: "",
      description: "",
      source: "",
      email_alert: "",
    });

    // Clear selected points
    setSelectedPoints([]);

    // Clear checkbox values
    document.getElementById("helmet").checked = false;
    document.getElementById("vest").checked = false;

    // Clear canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const infoPoints = infoPointsRef.current;
    infoPoints.textContent = "";
  };

  useEffect(() => {
    fetchDataForCards();
  }, []);
  function fetchDataForCards() {
    axios
      .get("https://safe-gaurd-backend.vercel.app/api/camera/", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzODgwODYzLCJpYXQiOjE3MTM4NTA4NjMsImp0aSI6IjBkNmQ1N2UxZTAwZTRlMjY5MDBhMjlkN2M4MGNjNjVhIiwidXNlcl9pZCI6MX0.HYxq5OqJS-Pi7L4FTfffLG4eO0bjPK-Og_TSGaQvTTY",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCardsData(data);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data for cards:", error);
      });
  }
  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="info"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="3rem"
      bottom="2rem"
      zindex={99}
      color="white"
      sx={{ cursor: "pointer" }}
      data-bs-toggle="modal"
      data-bs-target="#exampleModalAddCam"
    >
      <Icon fontSize="small" color="inherit">
        add
      </Icon>
    </MDBox>
  );

  const handleStream = (item) => {
    setSelectedCamera(item);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <form onSubmit={handleSubmit}>
        <Modal id="exampleModalAddCam" icon="camera" icoColor="info" title="Add Camera">
          {/* Modal content */}
          <MDBox className="form-group mb-3">
            <MDTypography variant="h6" color="inherit" htmlFor="name">
              Name
            </MDTypography>
            <input
              type="text"
              required
              className="form-control"
              name="name"
              id="name"
              placeholder="Enter camera name"
              value={formData.name}
              onChange={handleChange}
            />
          </MDBox>
          <MDBox className="form-group mb-3">
            <MDTypography variant="h6" color="inherit" htmlFor="location">
              Location
            </MDTypography>
            <input
              type="text"
              required
              className="form-control"
              name="location"
              id="location"
              placeholder="Enter camera location"
              value={formData.location}
              onChange={handleChange}
            />
          </MDBox>
          <MDBox className="form-group mb-3">
            <MDTypography variant="h6" color="inherit" htmlFor="description">
              Description
            </MDTypography>
            <input
              type="text"
              required
              className="form-control"
              name="description"
              id="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
            />
          </MDBox>
          <MDBox className="form-group mb-3">
            <MDTypography variant="h6" color="inherit" htmlFor="source">
              Source
            </MDTypography>
            <input
              type="text"
              required
              className="form-control"
              name="source"
              id="source"
              placeholder="Enter source"
              value={formData.source}
              onChange={handleChange}
            />
          </MDBox>
          <MDBox className="form-group mb-3">
            <MDTypography variant="h6" color="inherit" htmlFor="email_alert">
              Email Alert
            </MDTypography>
            <input
              type="email"
              required
              className="form-control"
              name="email_alert"
              id="email_alert"
              placeholder="Enter email for alert"
              value={formData.email_alert}
              onChange={handleChange}
            />
          </MDBox>
          <MDBox className="modal-footer">
            <button
              type="button"
              id="employee-form"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalAddPolygon"
            >
              Next
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={resetform}
            >
              Close
            </button>
          </MDBox>
        </Modal>
        <Modal
          id="exampleModalAddPolygon"
          icon="add"
          icoColor="primary"
          title="Add Restricted Area"
        >
          {/* Response tab content */}
          <div className="container-fluid d-flex mt-2">
            <div className="container-fluid">
              <div className="container-fluid d-flex justify-content-center align-items-center">
                <div className="form-group form-check m-3">
                  <input type="checkbox" className="form-check-input" name="helmet" id="helmet" />
                  <label className="form-check-label" htmlFor="helmet">
                    <h6>HELMET</h6>
                  </label>
                </div>
                <div className="form-group form-check m-3">
                  <input type="checkbox" className="form-check-input" name="vest" id="vest" />
                  <label className="form-check-label" htmlFor="vest">
                    <h6>VEST</h6>
                  </label>
                </div>
              </div>
              <br />
              <div className="container-fluid d-flex justify-content-evenly align-items-center">
                <span>
                  <strong>Polygon : </strong>
                </span>
                <div className="points-info" ref={infoPointsRef}></div>
              </div>
              <br />
              <br />
              <div className="button text-center">
                <button
                  type="submit"
                  className="w-25 top-50 mb-3 btn btn-primary"
                  id="sendPolygonBtn"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Done
                </button>
              </div>
            </div>
            {/* Response content */}
            <canvas
              ref={canvasRef}
              id="myCanvas"
              className="w-75 border border-1 rounded mb-3"
            ></canvas>
          </div>
        </Modal>
      </form>
      <MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            {cardsData.map((item) => (
              <Grid item key={item.id} xs={12} md={6} xl={3}>
                <MDBox sx={{ position: "relative", cursor: "pointer" }}>
                  <div
                    onClick={() => handleStream(item)}
                    data-bs-toggle="modal"
                    data-bs-target="#streamModal"
                  >
                    <DefaultInfoCard
                      height="16rem"
                      width="18rem"
                      image={item.rtsp_frame ? item.rtsp_frame : image1}
                      delIcon={true}
                      ID={item.id}
                      title={item.name}
                      description={item.location}
                    />
                  </div>
                  <Icon
                    color="primary"
                    fontSize="md"
                    sx={{
                      cursor: "pointer",
                      position: "absolute",
                      left: "92%",
                      top: "5%",
                      transform: "translate(-50%, -50%)",
                    }}
                    zindex={99}
                    data-bs-toggle="modal"
                    data-bs-target={`#confirmDeleteModal${item.id}`}
                  >
                    delete
                  </Icon>
                  <Modal
                    id={`confirmDeleteModal${item.id}`}
                    title="WARNING"
                    icon="warning"
                    icoColor="warning"
                  >
                    <div className="modal-body">
                      <MDTypography
                        variant="h6"
                        color="inherit"
                      >{`Are you sure you want to remove ${item.name}?`}</MDTypography>
                    </div>
                    <MDBox className="modal-footer">
                      <button
                        onClick={() => deleteCamera(item.id)}
                        type="button"
                        className="btn btn-danger"
                      >
                        Yes
                      </button>
                      <button data-bs-dismiss="modal" type="button" className="btn btn-success">
                        Close
                      </button>
                    </MDBox>
                  </Modal>
                  <Modal
                    id="streamModal"
                    icon="camera"
                    icoColor="info"
                    title={
                      selectedCamera
                        ? `${selectedCamera.id}: ${selectedCamera.name}, ${selectedCamera.location}`
                        : "Camera Stream"
                    }
                  >
                    {" "}
                    <button
                      type="button"
                      className="btn position-absolute fa fa-arrows-alt btn-lg text-light bottom-0 end-0 bg-secondary"
                      aria-label="Fullscreen"
                    ></button>
                    {selectedCamera && (
                      <iframe
                        id="cameraStream"
                        src={`http://127.0.0.1:8000/camera_stream/${selectedCamera.id}/`}
                        style={{ width: "100%", height: "500px" }}
                        frameBorder="0"
                      ></iframe>
                    )}
                  </Modal>
                </MDBox>
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </MDBox>
      {configsButton}
    </DashboardLayout>
  );
}
export default Billing;
