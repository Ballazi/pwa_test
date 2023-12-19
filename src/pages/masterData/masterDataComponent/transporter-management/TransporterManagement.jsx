import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Chip,
  IconButton,
  Select,
  MenuItem,
  Container,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridPagination,
} from "@mui/x-data-grid";
import BlockIcon from "@mui/icons-material/Block";

import CheckIcon from "@mui/icons-material/Check";

import EditIcon from "@mui/icons-material/Edit";
import {
  DeleteOutline,
  KeyboardArrowDown,
  Lock,
  LockOpen,
} from "@mui/icons-material";

import {
  blockTranseporter,
  unblockTransporter,
} from "../../../../api/public-transporter/public-transporter";

import VisibilityIcon from "@mui/icons-material/Visibility";

import CancelIcon from "@mui/icons-material/Cancel";

import { getAlltransporters } from "../../../../api/register/transporter";
import { getAllshiper } from "../../../../api/siperInformation/shipperInfo";
import { openSnackbar } from "../../../../redux/slices/snackbar-slice";
import { useDispatch } from "react-redux";
import BlockedTransporter from "./BlockedTransporter";

function CustomPagination(props) {
  const exportValue = [
    "name",
    "email",
    "contact_no",
    "pan",
    "status",
    // 'corporate_state',
    // 'communicate_by',
    // "bank_guarantee_date",
    // 'created_by',
    // 'trnsp_id',
    "corporate_postal_code",
    // 'logo',
    // 'updated_at',
    // 'corporate_country',
    // 'tan',
    // 'updated_by',
    // 'is_active',
    "contact_person",
    "billing_address",
    "gstin",
    // 'doc_path',
    // 'billing_city',
    // 'gstin_file',
    // "working_states",
    "corporate_address",
    // 'billing_state',
    "roc_number",
    // 'onboarding_shipper_id',
    // "corporate_city",
    "billing_postal_code",
    "iba_approved",
    // 'billing_country',
    "carriage_act_cert",
    // 'created_at',
    // 'contact_person'
  ];
  return (
    <>
      <GridToolbarContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
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

          <div>
            <GridPagination {...props} />
          </div>
        </div>
      </GridToolbarContainer>
    </>
  );
}

const columnss = [
  // { field: 'id', headerName: 'ID', width: 50 },
  { field: "sl", headerName: "SL No.", width: 90 },
  { field: "KAM", headerName: "KAM", width: 110 },
  { field: "mobNo", headerName: "Mobile No.", width: 110 },
  { field: "branches", headerName: "Linked Branches", width: 110 },
  {
    field: "opt",
    headerName: "Options",
    width: 90,
    renderCell: (params) => (
      <div>
        <Tooltip title="Edit">
          <IconButton
            // onClick={() => handleEdit(params.row)}
            aria-label="shipper"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton aria-label="shipper">
            <DeleteOutline />
          </IconButton>
        </Tooltip>
      </div>
    ),
  },
];
const rows = [
  {
    id: "1",
    sl: 1,
    KAM: "Manager 1",
    mobNo: "8345037721",
    branches: "Kolkata",
  },
  {
    id: "2",
    sl: 1,
    KAM: "Manager 1",
    mobNo: "8345037721",
    branches: "Kolkata",
  },
];

const TransporterManagement = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [transporters, setTransporters] = useState([]);
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewBlock, setBlock] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState([]);
  const [rowId, setRowId] = useState([]);
  const shipper_id = localStorage.getItem("shipper_id");
  const dispatch = useDispatch();

  const getAllTransportersData = () => {
    getAlltransporters()
      .then((res) => {
        if (res.data.success) {
          const apiTranseporterList = res.data.data.map((item) => ({
            id: item.trnsp_id,
            trnsp_id: item.trnsp_id,
            name: item.name,
            email: item.email,
            contact_no: item.contact_no,
            pan: item.pan,
            status: item.status,
            iba_approved: item.iba_approved ? "Yes" : "No",
            gstin: item.gstin,
            corporate_state: item.corporate_state,
            communicate_by: item.communicate_by,
            bank_guarantee_date: item.bank_guarantee_date,
            created_by: item.created_by,
            // trnsp_id: item.trnsp_id,
            corporate_postal_code: item.corporate_postal_code,
            logo: item.logo,
            updated_at: item.updated_at,
            corporate_country: item.corporate_country,
            tan: item.tan,
            updated_by: item.updated_by,
            is_active: item.is_active,
            contact_person: item.contact_person,
            billing_address: item.billing_address,
            doc_path: item.doc_path,
            billing_city: item.billing_city,
            gstin_file: item.gstin_file,
            working_states: item.working_states,
            corporate_address: item.corporate_address,
            billing_state: item.billing_state,
            roc_number: item.roc_number,
            onboarding_shipper_id: item.onboarding_shipper_id,
            corporate_city: item.corporate_city,
            billing_postal_code: item.billing_postal_code,
            billing_country: item.billing_country,
            carriage_act_cert: item.carriage_act_cert,
            created_at: item.created_at,
          }));
          console.log("tranporter list data::", apiTranseporterList);
          const filteredTranseporter = apiTranseporterList.filter(
            (transeporter) =>
              transeporter.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              transeporter.email
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              transeporter.contact_no
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              transeporter.pan
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
                transeporter.tan
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              transeporter.status
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              transeporter.iba_approved
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              transeporter.gstin
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          );

          setTransporters(filteredTranseporter);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllTransportersData();
  }, [searchQuery]);

  const columns = [
    // { field: "id", headerName: "ID", width: 70 },

    { field: "name", headerName: "Transporter Name", width: 200 },
    { field: "email", headerName: "Email", width: 230 },
    { field: "contact_no", headerName: "Contact", width: 110 },
    { field: "pan", headerName: "PAN Number", width: 120 },
    { field: "tan", headerName: "TAN", width: 120 },
    { field: "gstin", headerName: "GSTIN", width: 150 },
    {
      field: "iba_approved",
      headerName: "IBA Approved",
      width: 100,
      renderCell: (params) => {
        return (
          <Typography sx={{ fontSize: "14px" }}>
            {params.row.iba_approved}
          </Typography>
        );
      },
    },

    { field: "corporate_state", headerName: "Corporate State", width: 150 },
    { field: "communicate_by", headerName: "Communicate By", width: 150 },
    {
      field: "bank_guarantee_date",
      headerName: "Bank Guarantee Date",
      width: 150,
    },
    { field: "created_by", headerName: "created_by", width: 150 },
    { field: "trnsp_id", headerName: "trnsp_id", width: 150 },
    {
      field: "corporate_postal_code",
      headerName: "corporate_postal_code",
      width: 150,
    },
    { field: "logo", headerName: "logo", width: 150 },
    { field: "updated_at", headerName: "updated_at", width: 150 },
    { field: "corporate_country", headerName: "corporate_country", width: 150 },

    { field: "updated_by", headerName: "updated_by", width: 150 },
    { field: "is_active", headerName: "is_active", width: 150 },
    { field: "contact_person", headerName: "contact_person", width: 150 },
    { field: "billing_address", headerName: "billing_address", width: 150 },
    { field: "doc_path", headerName: "doc_path", width: 150 },
    { field: "billing_city", headerName: "billing_city", width: 150 },
    { field: "gstin_file", headerName: "gstin_file", width: 150 },
    { field: "working_states", headerName: "working_states", width: 150 },
    { field: "corporate_address", headerName: "corporate_address", width: 150 },
    { field: "billing_state", headerName: "billing_state", width: 150 },
    { field: "roc_number", headerName: "roc_number", width: 150 },
    {
      field: "onboarding_shipper_id",
      headerName: "onboarding_shipper_id",
      width: 150,
    },
    { field: "corporate_city", headerName: "corporate_city", width: 150 },
    {
      field: "billing_postal_code",
      headerName: "billing_postal_code",
      width: 150,
    },
    { field: "billing_country", headerName: "billing_country", width: 150 },
    { field: "carriage_act_cert", headerName: "carriage_act_cert", width: 150 },
    { field: "created_at", headerName: "created_at", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const statusWithSpaces = params.row.status.replace(/_/g, " ");
        let style = {
          background: "#ECC600",
          color: "#fff",
          fontSize: "12px",
          textTransform: "capitalize",
        };
        if (params.row.status === "active") {
          style = {
            background: "#209342",
            color: "#fff",
            fontSize: "12px",
            textTransform: "capitalize",
          };
        } else if (params.row.status === "blocked") {
          style = {
            background: "#C83000",
            color: "#fff",
            fontSize: "12px",
            textTransform: "capitalize",
          };
        }
        return <Chip sx={style} label={statusWithSpaces} />;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          <Tooltip title="View">
            <IconButton
              onClick={() => {
                // console.log('param', params.row);
                // handleViewClick(params.row);
                localStorage.setItem("transp_id", params.row.trnsp_id);
                navigate("/acculead-secured/public-transporter");
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Blocked View">
            <IconButton onClick={() => handleBlockOpen(params.row.trnsp_id)}>
              <BlockIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleViewDialogClose = () => {
    setSelectedTransporter(null);
    setViewDialogOpen(false);
  };

  const handleBlockOpen = (transp_id) => {
    console.log("transporter id:::::::::", transp_id);
    setSelectedTransporter(transp_id);
    setBlock(true);
  };

  const handleBlockClose = () => {
    setSelectedTransporter(null);
    setBlock(false);
  };

  const viewDialogContent = (
    <div>
      {/* <Typography variant="h6">Transporter Details</Typography> */}
      {selectedTransporter && (
        <Grid container>
          <Grid item md={6}>
            <Grid container>
              <Grid item md={6}>
                <Box>
                  <List>
                    <ListItem>
                      <ListItemText>
                        <Typography variant="p">Name</Typography>
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>
                        <Typography variant="p">Email</Typography>
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>
                        <Typography variant="p">Contact No.</Typography>
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>
                        <Typography variant="p">PAN Number</Typography>
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>
                        <Typography variant="p">CIN Number</Typography>
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>
                        <Typography variant="p">
                          No. of Vehicles Owned
                        </Typography>
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>
                        <Typography variant="p">
                          No. of Vehicles Leased
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  </List>
                </Box>
              </Grid>
              <Grid item md={6}>
                <List>
                  <ListItem>
                    <ListItemText>
                      <Typography variant="h5">Ekart</Typography>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Typography variant="h5">ekart@gmail.com</Typography>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Typography variant="h5">9873128769</Typography>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Typography variant="h5">ITCVB6746K</Typography>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Typography variant="h5">CIN826816</Typography>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Typography variant="h5">100</Typography>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Typography variant="h5">50</Typography>
                    </ListItemText>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={6}>
            <Box
              sx={{
                textAlign: "center",
                padding: "10px",
              }}
            >
              <Typography variant="p">Logo Preview</Typography>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/ff/ITC_Limited_Logo.svg"
                style={{
                  display: "flex",
                  height: "70%",
                  width: "70%",
                  margin: "10px",
                }}
              />
            </Box>
          </Grid>
          <Grid item md={12}>
            <Typography variant="h4" sx={{ padding: "10px" }}>
              Key Account Manage List
            </Typography>
            <DataGrid
              components={{
                Pagination: CustomPagination,
              }}
              rows={rows}
              columns={columnss}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 25,
                  },
                },
              }}
              pageSizeOptions={[25, 50, 100]}
              disableRowSelectionOnClick
            />
            <DialogActions>
              <Button
                variant="contained"
                onClick={handleViewDialogClose}
                color="error"
                sx={{ mr: "16px" }}
              >
                Close
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      )}
    </div>
  );

  return (
    <Container sx={{ mt: 2, mb: 2 }} maxWidth={false}>
      <Card style={{ padding: "10px" }}>
        <div className="customCardheader">
          <Typography variant="h4">Transporter Management</Typography>
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
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Grid>
        </Grid>
        <div style={{ height: 400, width: "100%" }}>
          {console.log("iba", transporters)}
          <DataGrid
            columnVisibilityModel={{
              corporate_state: false,
              communicate_by: false,
              bank_guarantee_date: false,
              created_by: false,
              trnsp_id: false,
              corporate_postal_code: false,
              logo: false,
              updated_at: false,
              corporate_country: false,
              tan: true,
              updated_by: false,
              is_active: false,
              contact_person: false,
              billing_address: false,
              gstin: true,
              doc_path: false,
              billing_city: false,
              gstin_file: false,
              working_states: false,
              corporate_address: false,
              billing_state: false,
              roc_number: false,
              onboarding_shipper_id: false,
              corporate_city: false,
              billing_postal_code: false,
              iba_approved: true,
              billing_country: false,
              carriage_act_cert: false,
              created_at: false,
            }}
            // slotProps={{ toolbar: { csvOptions: { allColumns: true } } }}
            components={{
              Pagination: CustomPagination,
            }}
            rows={transporters}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                },
              },
            }}
            disableRowSelectionOnClick
            getRowId={(row) => row.trnsp_id}
          />
        </div>

        <Dialog
          open={viewDialogOpen}
          onClose={handleViewDialogClose}
          maxWidth="true"
        >
          <DialogTitle>
            <Box className="customCardheader">
              <Typography variant="h4">View Transporter Details</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>{viewDialogContent}</DialogContent>
        </Dialog>

        {/* block */}

        {viewBlock ? (
          <BlockedTransporter
            isOpen={viewBlock}
            transporterId={selectedTransporter}
            handleClose={handleBlockClose}
            getAllTransportersData={getAllTransportersData}
          />
        ) : null}
      </Card>
    </Container>
  );
};

export default TransporterManagement;
