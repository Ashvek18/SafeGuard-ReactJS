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
import MDAlert from "components/MDAlert";

export default function EmployeeData() {
  const [employeeData, setEmployeeData] = useState({ columns: [], rows: [] });

  // Function to fetch employee data
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://safe-gaurd-backend.vercel.app/api/employee/`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzODgwODYzLCJpYXQiOjE3MTM4NTA4NjMsImp0aSI6IjBkNmQ1N2UxZTAwZTRlMjY5MDBhMjlkN2M4MGNjNjVhIiwidXNlcl9pZCI6MX0.HYxq5OqJS-Pi7L4FTfffLG4eO0bjPK-Og_TSGaQvTTY",
          "Content-Type": "application/json",
        },
      });
      // Axios automatically throws an error for non-2xx status codes, so no need to check response.ok
      const data = response.data; // Access the response data directly
      const formattedData = {
        columns: [
          { Header: "ID", accessor: "ID", width: "1%", align: "left" },
          { Header: "first name", accessor: "fname", align: "left" },
          { Header: "last name", accessor: "lname", align: "left" },
          { Header: "phone number", accessor: "phone", align: "left" },
          { Header: "Edit employee", accessor: "edit", align: "center" },
          { Header: "Delete employee", accessor: "delete", align: "center" },
        ],
        rows: data.map((employee) => ({
          ID: <ID id={employee.emp_id} />,
          fname: <Fname fname={employee.first_name} />,
          lname: <Lname lname={employee.last_name} />,
          phone: <Phone phone={employee.phone} />,
          edit: <EditAction employeeData={employee} />,
          delete: <DeleteAction employeeId={employee.emp_id} />,
        })),
      };
      setEmployeeData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //edit
  function editEmployee(employeeId, updatedData) {
    axios
      .patch(`https://safe-gaurd-backend.vercel.app/api/employee/${employeeId}/`, updatedData, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzODgwODYzLCJpYXQiOjE3MTM4NTA4NjMsImp0aSI6IjBkNmQ1N2UxZTAwZTRlMjY5MDBhMjlkN2M4MGNjNjVhIiwidXNlcl9pZCI6MX0.HYxq5OqJS-Pi7L4FTfffLG4eO0bjPK-Og_TSGaQvTTY",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // Axios automatically throws an error for non-2xx status codes, so no need to check response.ok
        // Handle success
        // //showalert("Employee Edited Successfully", "success");
        const modalElement = document.getElementById(`exampleModalEdit${employeeId}`);
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide(); // Close the modal
        // Call fetchData again to update the UI
        fetchData();
      })
      .catch((error) => {
        // //showalert("Failed to Edit Employee: " + error, "error");
      });
  }
  //edit function
  function EditAction({ employeeData }) {
    const [formData, setFormData] = useState(employeeData);
    // Function to handle form submission
    const handleEdit = (event) => {
      event.preventDefault(); // Prevent default form submission behavior
      const { emp_id, ...updatedData } = formData; // Exclude emp_id from the updatedData

      // Call the editEmployee function with updatedData
      editEmployee(emp_id, updatedData);
    };

    // Function to handle updating form data when employee data changes
    useEffect(() => {
      setFormData(employeeData); // Update formData when employeeData changes
    }, [employeeData]);

    return (
      <>
        <Modal
          id={`exampleModalEdit${employeeData.emp_id}`}
          icon="edit"
          icoColor="primary"
          title="Edit Employee"
        >
          {/* Modal content */}
          <MDBox variant="gradient">
            <form onSubmit={handleEdit}>
              <MDBox mb={3}>
                <MDTypography
                  sx={{ textAlign: "left" }}
                  variant="h6"
                  color="inherit"
                  htmlFor={`editempid${employeeData.emp_id}`}
                >
                  Employee ID
                </MDTypography>
                <input
                  required
                  type="text"
                  className="form-control"
                  id={`editempid${employeeData.emp_id}`}
                  value={formData.emp_id}
                  readOnly
                />
              </MDBox>
              <MDBox mb={3}>
                <MDTypography
                  sx={{ textAlign: "left" }}
                  htmlFor={`editfname${employeeData.emp_id}`}
                  variant="h6"
                  color="inherit"
                >
                  First Name
                </MDTypography>
                <input
                  type="text"
                  className="form-control"
                  id={`editfname${employeeData.emp_id}`}
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </MDBox>
              <MDBox mb={3}>
                <MDTypography
                  sx={{ textAlign: "left" }}
                  htmlFor={`editlname${employeeData.emp_id}`}
                  variant="h6"
                  color="inherit"
                >
                  Last Name
                </MDTypography>
                <input
                  type="text"
                  className="form-control"
                  id={`editlname${employeeData.emp_id}`}
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </MDBox>
              <MDBox mb={3}>
                <MDTypography
                  sx={{ textAlign: "left" }}
                  htmlFor={`editphone${employeeData.emp_id}`}
                  variant="h6"
                  color="inherit"
                >
                  Phone Number
                </MDTypography>
                <input
                  className="form-control"
                  maxLength="10"
                  id={`editphone${employeeData.emp_id}`}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </MDBox>
              <MDBox className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
              </MDBox>
            </form>
          </MDBox>
        </Modal>
        <Icon
          sx={{ cursor: "pointer" }}
          fontSize="small"
          color="info"
          data-bs-toggle="modal"
          data-bs-target={`#exampleModalEdit${employeeData.emp_id}`}
        >
          edit
        </Icon>
      </>
    );
  }

  // Function to delete an employee
  function deleteEmployee(employeeId) {
    axios
      .delete(`https://safe-gaurd-backend.vercel.app/api/employee/${employeeId}/`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzODgwODYzLCJpYXQiOjE3MTM4NTA4NjMsImp0aSI6IjBkNmQ1N2UxZTAwZTRlMjY5MDBhMjlkN2M4MGNjNjVhIiwidXNlcl9pZCI6MX0.HYxq5OqJS-Pi7L4FTfffLG4eO0bjPK-Og_TSGaQvTTY",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // Axios automatically throws an error for non-2xx status codes, so no need to check response.ok
        // Handle success
        // //showalert("Employee deleted Successfully", "success");
        // Call fetchData again to update the UI
        fetchData();
      })
      .catch((error) => {
        // //showalert("Error deleting employee:", error);
      });
  }

  function DeleteAction({ employeeId }) {
    const handleDelete = () => {
      deleteEmployee(employeeId);
    };

    return (
      <Icon sx={{ cursor: "pointer" }} fontSize="small" color="primary" onClick={handleDelete}>
        delete
      </Icon>
    );
  }

  useEffect(() => {
    // Call fetchData when component mounts
    fetchData();
  }, []);

  // UI Components
  const ID = ({ id }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox lineHeight={1}>
        <MDTypography display="block" variant="outlined" fontWeight="medium">
          {id}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  const Fname = ({ fname }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox lineHeight={1}>
        <MDTypography display="block" variant="outlined">
          {fname}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  const Lname = ({ lname }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox lineHeight={1}>
        <MDTypography display="block" variant="outlined">
          {lname}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  const Phone = ({ phone }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="outlined" color="text" fontWeight="medium">
        {phone}
      </MDTypography>
    </MDBox>
  );

  return employeeData;
}
