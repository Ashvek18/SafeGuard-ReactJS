import React from "react";
import PropTypes from "prop-types";
import MDTypography from "./MDTypography";
import { Icon } from "@mui/material";

const Modal = ({ id, title, children, icon, icoColor }) => {
  return (
    <div
      className="modal fade"
      id={id}
      style={{ zindex: "9999" }}
      aria-hidden="true"
      aria-labelledby={`${id}Label`}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <MDTypography
              display="flex"
              variant="h5"
              className="modal-title text-dark"
              id={`${id}Label`}
            >
              <Icon fontSize="medium" color={icoColor}>
                {icon}
              </Icon>
              &nbsp;{title}
            </MDTypography>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};
Modal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
  icoColor: PropTypes.node.isRequired,
};
export default Modal;
