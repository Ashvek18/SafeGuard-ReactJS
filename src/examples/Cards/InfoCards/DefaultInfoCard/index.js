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

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function DefaultInfoCard({
  color,
  icon,
  title,
  description,
  value,
  image,
  ID,
  delIcon,
  height,
  width,
}) {
  return (
    <Card sx={{ width: "18rem", boxShadow: "8" }}>
      <MDBox width="18rem" mb={2} display="flex" justifyContent="center">
        {/* {delIcon && (
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
          >
            delete
          </Icon>
        )} */}
        <MDBox
          display="grid"
          justifyContent="center"
          alignItems="center"
          bgColor={color}
          sx={{
            backgroundImage: image ? `url(${image})` : { color },
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: height || "13rem", // Default height if not provided
            width: width || "18rem", // Default width if not provided
          }}
          color="white"
          shadow="md"
          borderRadius="md"
          variant="gradient"
        >
          <Icon fontSize="large">{icon}</Icon>
        </MDBox>
      </MDBox>
      <MDBox pb={2} px={2} textAlign="left" lineHeight={1.25}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {ID ? `ID: ${ID}` : null}
          {ID ? <br></br> : null}

          {title}
        </MDTypography>
        {description && (
          <MDTypography variant="body2" color="text" fontWeight="regular">
            {description}
          </MDTypography>
        )}
        {description && !value ? null : <Divider />}
        {value && (
          <MDTypography variant="h5" fontWeight="medium">
            {value}
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of DefaultInfoCard
DefaultInfoCard.defaultProps = {
  color: "info",
  value: "",
  description: "",
};

// Typechecking props for the DefaultInfoCard
DefaultInfoCard.propTypes = {
  color: PropTypes.string.isRequired,
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  value: PropTypes.string,
  image: PropTypes.string,
  ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  delIcon: PropTypes.bool,
  height: PropTypes.string,
  width: PropTypes.string,
};

export default DefaultInfoCard;
