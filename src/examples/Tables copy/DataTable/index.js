/* eslint-disable react/no-unknown-property */
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
/* eslint react/prop-types: 0 */

// This comment disables prop-types validation for the entire component
// You can place it at the top of the file to avoid prop-types validation errors

// Your component code here
import { useMemo, useEffect, useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-table components
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce, useSortBy } from "react-table";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import MDPagination from "components/MDPagination";

// Material Dashboard 2 React example components
import DataTableHeadCell from "examples/Tables copy/DataTable/DataTableHeadCell";
import DataTableBodyCell from "examples/Tables copy/DataTable/DataTableBodyCell";

import Modal from "components/Modal";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import axios from "axios";

function DataTable({
  entriesPerPage,
  showTotalEntries,
  table,
  pagination,
  noEndBorder,
  //showalert,
}) {
  const defaultValue = entriesPerPage.defaultValue ? entriesPerPage.defaultValue : 10;
  const entries = entriesPerPage.entries
    ? entriesPerPage.entries.map((el) => el.toString())
    : ["5", "10", "15", "20", "25", "50", "100"];
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = tableInstance;

  // Set the default value for the entries per page when component mounts
  useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);

  // Set the entries per page value based on the select value
  const setEntriesPerPage = (value) => setPageSize(value);

  // Render the paginations
  const renderPagination = pageOptions.map((option) => (
    <MDPagination
      item
      key={option}
      onClick={() => gotoPage(Number(option))}
      active={pageIndex === option}
    >
      {option + 1}
    </MDPagination>
  ));

  // Handler for the input to set the pagination index
  const handleInputPagination = ({ target: { value } }) =>
    value > pageOptions.length || value < 0 ? gotoPage(0) : gotoPage(Number(value));

  // Customized page options starting from 1
  const customizedPageOptions = pageOptions.map((option) => option + 1);

  // Setting value for the pagination input
  const handleInputPaginationValue = ({ target: value }) => gotoPage(Number(value.value - 1));

  //hook to store form data
  const [formData, setFormData] = useState({
    emp_id: "",
    first_name: "",
    last_name: "",
    phone: "",
  });

  const resetform = () => {
    setFormData({
      emp_id: "",
      first_name: "",
      last_name: "",
      phone: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the form from submitting normally
    if (!formData.emp_id || !formData.first_name || !formData.last_name || !formData.phone) {
      //showalert("Please Fill All The Details Before Submission", "error");
      return;
    }

    axios
      .post("https://safe-gaurd-backend.vercel.app/api/employee/", formData, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzODgwODYzLCJpYXQiOjE3MTM4NTA4NjMsImp0aSI6IjBkNmQ1N2UxZTAwZTRlMjY5MDBhMjlkN2M4MGNjNjVhIiwidXNlcl9pZCI6MX0.HYxq5OqJS-Pi7L4FTfffLG4eO0bjPK-Og_TSGaQvTTY",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        //showalert("Employee added Successfully", "success");
        setFormData({
          emp_id: "",
          first_name: "",
          last_name: "",
          phone: "",
        });
        // Optionally, close the modal
        const modalElement = document.getElementById("exampleModalToggle2");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        // window.location.reload();
      })
      .catch((error) => {
        //showalert("Error posting data: " + error, "error");
      });
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  // Setting the entries starting point
  const entriesStart = pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;

  // Setting the entries ending point
  let entriesEnd;

  if (pageIndex === 0) {
    entriesEnd = pageSize;
  } else if (pageIndex === pageOptions.length - 1) {
    entriesEnd = rows.length;
  } else {
    entriesEnd = pageSize * (pageIndex + 1);
  }

  return (
    <>
      <Modal id="exampleModalToggle" icon="person" icoColor="info" title="Add Employees">
        {/* Modal content */}
        <MDBox display="flex" justifyContent="space-between">
          <MDBox
            width="40%"
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <div className="card-body m-5">
              <MDTypography variant="h5" color="white" className="card-title mb-2">
                Add Manually
              </MDTypography>
              <div className="card-text">
                <MDButton
                  variant="gradient"
                  color="dark"
                  data-bs-target="#exampleModalToggle2"
                  data-bs-toggle="modal"
                >
                  Add
                </MDButton>
              </div>
            </div>
          </MDBox>
          <MDBox
            width="50%"
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <div className="card-body m-5">
              <MDTypography variant="h5" color="white" className="card-title mb-2">
                Upload CSV/XLSX File
              </MDTypography>
              <div className="card-text ">
                <input
                  type="file"
                  id="csvFileInput"
                  accept=".csv, .xlsx"
                  className="my-1 btn btn-sm btn-outline-light mb-3"
                />
                <MDButton variant="gradient" color="dark">
                  Add
                </MDButton>
              </div>
            </div>
          </MDBox>
        </MDBox>
      </Modal>
      <Modal id="exampleModalToggle2" icon="person" icoColor="info" title="Add Employee Manually">
        {/* Modal content */}
        <MDBox variant="gradient">
          <form onSubmit={handleSubmit}>
            <MDBox mb={3}>
              <MDTypography variant="h6" color="inherit" htmlFor="exampleInputempid">
                Employee ID
              </MDTypography>
              <input
                required
                type="text"
                className="form-control"
                id="emp_id"
                value={formData.emp_id}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDTypography htmlFor="exampleInputfname" variant="h6" color="inherit">
                First Name
              </MDTypography>
              <input
                type="text"
                className="form-control"
                id="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDTypography htmlFor="exampleInputlname" variant="h6" color="inherit">
                Last Name
              </MDTypography>
              <input
                type="text"
                className="form-control"
                id="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDTypography htmlFor="exampleInputphone" variant="h6" color="inherit">
                Phone Number
              </MDTypography>
              <input
                className="form-control"
                maxLength="10"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox className="modal-footer">
              <button type="submit" id="employee-form" className="btn btn-primary">
                Submit
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
          </form>
        </MDBox>
      </Modal>
      <TableContainer sx={{ boxShadow: "none" }}>
        {entriesPerPage ? (
          <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            {entriesPerPage && (
              <MDBox display="flex" alignItems="center">
                <Autocomplete
                  disableClearable
                  value={pageSize.toString()}
                  options={entries}
                  onChange={(event, newValue) => {
                    setEntriesPerPage(parseInt(newValue, 10));
                  }}
                  size="small"
                  sx={{ width: "5rem" }}
                  renderInput={(params) => <MDInput {...params} />}
                />
                <MDTypography variant="caption" color="secondary">
                  &nbsp;&nbsp;entries per page
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
        ) : null}
        <Table {...getTableProps()}>
          <MDBox component="thead">
            {headerGroups.map((headerGroup, key) => (
              <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, idx) => (
                  <DataTableHeadCell
                    key={idx}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    width={column.width ? column.width : "auto"}
                    align={column.align ? column.align : "left"}
                  >
                    {column.render("Header")}
                  </DataTableHeadCell>
                ))}
              </TableRow>
            ))}
          </MDBox>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, key) => {
              prepareRow(row);
              return (
                <TableRow key={key} {...row.getRowProps()}>
                  {row.cells.map((cell, idx) => (
                    <DataTableBodyCell
                      key={idx}
                      noBorder={noEndBorder && rows.length - 1 === key}
                      align={cell.column.align ? cell.column.align : "left"}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </DataTableBodyCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <MDBox
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
        >
          {showTotalEntries && (
            <MDBox mb={{ xs: 3, sm: 0 }}>
              <MDTypography variant="button" color="secondary" fontWeight="regular">
                Showing {entriesStart} to {entriesEnd} of {rows.length} entries
              </MDTypography>
            </MDBox>
          )}
          {pageOptions.length > 1 && (
            <MDPagination
              variant={pagination.variant ? pagination.variant : "gradient"}
              color={pagination.color ? pagination.color : "info"}
            >
              {canPreviousPage && (
                <MDPagination item onClick={() => previousPage()}>
                  <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
                </MDPagination>
              )}
              {renderPagination.length > 6 ? (
                <MDBox width="5rem" mx={1}>
                  <MDInput
                    inputProps={{ type: "number", min: 1, max: customizedPageOptions.length }}
                    value={customizedPageOptions[pageIndex]}
                    onChange={(handleInputPagination, handleInputPaginationValue)}
                  />
                </MDBox>
              ) : (
                renderPagination
              )}
              {canNextPage && (
                <MDPagination item onClick={() => nextPage()}>
                  <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
                </MDPagination>
              )}
            </MDPagination>
          )}
        </MDBox>
      </TableContainer>
      {/* <TableContainer>
        <profilesListData></profilesListData>
      </TableContainer> */}
    </>
  );
}

// Setting default values for the props of DataTable
DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25, 50, 100] },
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  noEndBorder: false,
};

// Typechecking props for the DataTable
DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  noEndBorder: PropTypes.bool,
  //showalert: PropTypes.node.isRequired,
};
export default DataTable;
