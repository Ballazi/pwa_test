import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Container,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  Grid,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridPagination,
} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import TextField from "@mui/material/TextField"; // Import TextField
import {
  approveShipper,
  updateShipperStatus,
} from "../../../../api/register/shipper-details";
import { useNavigate } from "react-router";
import { getAllshiper } from "../../../../api/siperInformation/shipperInfo";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../../../redux/slices/snackbar-slice";
import BackdropComponent from "../../../../components/backdrop/Backdrop";

function CustomPagination(props) {
  const exportValue = [
    "name",
    "contact_person",
    "email",
    "contact",
    "cinNumber",
    "panNumber",
    "status",
    // 'colour_scheme',
    "corporate_city",
    // 'billing_country',
    "trade_license",
    // 'corporate_state',
    "billing_postal_code",
    // 'doc_path',
    "threshold_limit",
    // 'corporate_country',
    // 'logo',
    // 'has_region',
    // 'created_at',
    "corporate_postal_code",
    // 'has_cluster',
    // 'created_by',
    "billing_address",
    "tan",
    // 'updated_at',
    // 'updated_by',
    "gstin",
    // 'has_branch',
    // 'is_active'
  ];
  return (
    <>
      <GridToolbarContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",

            // padding: '8px',
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "25px",
              padding: "8px",
            }}
          >
            <GridToolbarExport
              csvOptions={{
                fields: exportValue,
              }}
            />
          </div>
          <div>
            <GridPagination {...props} />
          </div>
        </div>
      </GridToolbarContainer>
    </>
  );
}

const ShipperManagement = () => {
  const [selectedShipper, setSelectedShipper] = useState(null);
  const navigate = useNavigate();
  const [loading, setIsLoading] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [shipperToApprove, setShipperToApprove] = useState(null);
  const [blockingShipperId, setBlockingShipperId] = useState(null);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state
  const dispatch = useDispatch();

  const handleViewClick = (shipper) => {
    console.log("hoo", shipper);

    navigate("/acculead-secured/signup");
    localStorage.setItem("shipper_id", shipper.id);
    localStorage.setItem("shipper_name", shipper.name);
    localStorage.setItem(
      "type",
      shipper.registration_step === 10 ? "view" : "create"
    );
  };

  const handleApproveClick = (shipperId, status) => {
    setShipperToApprove(shipperId);
    setOpenConfirmationDialog(true);
    setStatus(status);
  };

  const handleConfirmApprove = () => {
    if (shipperToApprove) {
      approveShipper(shipperToApprove, [])
        .then((res) => {
          if (res.data.success === true) {
            dispatch(
              openSnackbar({
                type: "success",
                message: "status updated successfully!",
              })
            );
            getAllShiperList();
            setOpenConfirmationDialog(false);
            // setStatus('');
          } else {
            dispatch(
              openSnackbar({ type: "error", message: res.data.clientMessage })
            );
          }
        })
        .catch((err) => {
          console.error(err);
          setOpenConfirmationDialog(false);
        });
    }
  };

  const handleCancelApprove = () => {
    setOpenConfirmationDialog(false);
    // setStatus('');
  };

  const columns = [
    { field: "name", headerName: "Shipper Name", width: 200 },
    { field: "contact_person", headerName: "Contact Person", width: 200 },

    { field: "email", headerName: "Email", width: 150 },
    { field: "contact", headerName: "Contact Number", width: 150 },
    { field: "cinNumber", headerName: "CIN Number", width: 150 },
    { field: "panNumber", headerName: "PAN Number", width: 150 },
    { field: "colour_scheme", headerName: "colour_scheme", width: 150 },
    { field: "corporate_city", headerName: "corporate_city", width: 150 },
    { field: "billing_country", headerName: "billing_country", width: 150 },
    { field: "trade_license", headerName: "trade_license", width: 150 },
    { field: "corporate_state", headerName: "corporate_state", width: 150 },
    {
      field: "billing_postal_code",
      headerName: "billing_postal_code",
      width: 150,
    },
    { field: "doc_path", headerName: "doc_path", width: 150 },
    { field: "threshold_limit", headerName: "threshold_limit", width: 150 },
    { field: "corporate_country", headerName: "corporate_country", width: 150 },
    { field: "has_region", headerName: "has_region", width: 150 },
    { field: "logo", headerName: "logo", width: 150 },
    { field: "created_at", headerName: "created_at", width: 150 },
    {
      field: "corporate_postal_code",
      headerName: "corporate_postal_code",
      width: 150,
    },
    { field: "has_cluster", headerName: "has_cluster", width: 150 },
    { field: "created_by", headerName: "created_by", width: 150 },
    { field: "billing_address", headerName: "billing_address", width: 150 },
    { field: "tan", headerName: "tan", width: 150 },
    { field: "updated_at", headerName: "updated_at", width: 150 },
    { field: "updated_by", headerName: "updated_by", width: 150 },
    { field: "gstin", headerName: "GSTIN", width: 150 },
    { field: "has_branch", headerName: "has_branch", width: 150 },
    { field: "is_active", headerName: "is_active", width: 150 },

    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "VERIFIED"
              ? "success"
              : params.value === "APPROVED"
              ? "primary"
              : "error"
          }
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          <Tooltip title="View">
            <IconButton onClick={() => handleViewClick(params.row)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {console.log("status", params.row.status)}
          {params.row.status === "APPROVED" ||
          params.row.status === "VERIFIED" ? (
            <Tooltip title="Block">
              <IconButton onClick={() => handleBlockClick(params.row.id)}>
                <CancelIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip
              title={params.row.status !== "PENDING" ? "Unblock" : "Approved"}
            >
              <IconButton
                onClick={() =>
                  handleApproveClick(params.row.id, params.row.status)
                }
              >
                <CheckIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
  const [shippers, setShippers] = useState([]);

  const getAllShiperList = () => {
    return getAllshiper()
      .then((res) => {
        if (res.success === true) {
          const apiShiperList = res.data.map((item) => ({
            id: item.shpr_id,
            contact_person: item.contact_person,
            name: item.name,
            email: item.email,
            contact: item.contact_no,
            cinNumber: item.cin,
            panNumber: item.pan,
            status: item.status.toUpperCase(),
            billing_city: item.billing_city,
            inc_cert: item.inc_cert,
            registration_step: item.registration_step,
            corporate_address: item.corporate_address,
            billing_state: item.billing_state,
            colour_scheme: item.colour_scheme,
            corporate_city: item.corporate_city,
            billing_country: item.billing_country,
            trade_license: item.trade_license,
            corporate_state: item.corporate_state,
            billing_postal_code: item.billing_postal_code,
            doc_path: item.doc_path,
            threshold_limit: item.threshold_limit,
            corporate_country: item.corporate_country,
            logo: item.logo,
            has_region: item.has_region,
            created_at: item.created_at,
            corporate_postal_code: item.corporate_postal_code,
            has_cluster: item.has_cluster,
            created_by: item.created_by,
            billing_address: item.billing_address,
            tan: item.tan,
            updated_at: item.updated_at,
            updated_by: item.updated_by,
            gstin: item.gstin,
            has_branch: item.has_branch,
            is_active: item.is_active,
          }));
          console.log("shipper Data::::", res.data);
          // Filter the data based on the search query
          const filteredShippers = apiShiperList.filter(
            (shipper) =>
              shipper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              shipper.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
              shipper.contact
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              shipper.cinNumber
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              shipper.panNumber
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              shipper.status
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              shipper.contact_person
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              shipper.gstin.toLowerCase().includes(searchQuery.toLowerCase())
          );

          setShippers(filteredShippers);
        } else {
          // Handle error
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    getAllShiperList();
  }, [searchQuery]); // Add searchQuery as a dependency
  const [openBlockDialog, setOpenBlockDialog] = useState(false);

  const handleBlockClick = (shipperId) => {
    setOpenBlockDialog(true);
    console.log("shpr", shipperId);
    setBlockingShipperId(shipperId);
  };
  const handleConfirmBlock = () => {
    // Implement logic to block the shipper here
    setOpenBlockDialog(false);
    handleShipperStatus(blockingShipperId, { status: "blocked" });
  };

  const handleShipperStatus = (id, paylaod) => {
    updateShipperStatus(id, paylaod)
      .then((res) => {
        if (res.data.success) {
          console.log("check", res.data.data);
          dispatch(
            openSnackbar({
              type: "success",
              message: "Shipper blocked successfully!",
            })
          );
          getAllShiperList();
        } else {
          dispatch(
            openSnackbar({
              type: "error",
              message: "Something went wrong!Please try again later",
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          openSnackbar({
            type: "error",
            message: "Something went wrong!Please try again later",
          })
        );
      });
  };

  const handleCancelBlock = () => {
    setOpenBlockDialog(false);
    setBlockingShipperId(null);
  };
  return (
    <Container sx={{ mt: 2, mb: 2 }} maxWidth={false}>
      <BackdropComponent loading={loading} />
      <Card style={{ padding: "10px" }}>
        <div className="customCardheader">
          <Typography variant="h4">Shipper Management</Typography>
        </div>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <div
              style={{
                marginBottom: "20px",
                position: "relative",
                marginLeft: "auto",
                width: "40%",
              }}
            >
              <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Grid>
        </Grid>

        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            columnVisibilityModel={{
              colour_scheme: false,
              corporate_city: false,
              billing_country: false,
              trade_license: false,
              corporate_state: false,
              billing_postal_code: false,
              doc_path: false,
              threshold_limit: false,
              corporate_country: false,
              logo: false,
              has_region: false,
              created_at: false,
              corporate_postal_code: false,
              has_cluster: false,
              created_by: false,
              billing_address: false,
              tan: false,
              updated_at: false,
              updated_by: false,
              gstin: true,
              has_branch: false,
              is_active: false,
            }}
            components={{
              Pagination: CustomPagination,
            }}
            rows={shippers}
            columns={columns}
            pageSize={25}
            onRowClick={(params) => setSelectedShipper(params.row)}
            disableRowSelectionOnClick
          />
        </div>
      </Card>

      <Dialog
        open={openConfirmationDialog}
        onClose={handleCancelApprove}
        maxWidth="xs"
        fullWidth
      >
        <div className="customCardheader">
          <Typography variant="h4">
            {" "}
            Confirm {status === "BLOCKED" ? "Unblock" : "Approval"}
          </Typography>
        </div>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            <Typography component="span" sx={{ textTransform: "lowercase" }}>
              {status === "BLOCKED" ? "unblock" : "approve"}
            </Typography>{" "}
            this shipper?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelApprove}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmApprove}
            color="primary"
          >
            Yes, {status === "BLOCKED" ? "unblock" : "approve"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block Confirmation Dialog */}
      <Dialog
        open={openBlockDialog}
        onClose={handleCancelBlock}
        maxWidth="xs"
        fullWidth
      >
        <div className="customCardheader">
          <Typography variant="h4"> Confirm Block</Typography>
        </div>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to block this shipper?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleCancelBlock}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmBlock}
            color="primary"
          >
            Yes, Block
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ShipperManagement;
