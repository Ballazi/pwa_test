import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Autocomplete,
  TextField,
  Grid,
} from "@mui/material";
import BackdropComponent from "../../backdrop/Backdrop";
import ContentWrapper from "../../form-warpper/ContentWrapper";
import TitleContainer from "../../card/TitleContainer";
import FooterWrapper from "../../form-warpper/FooterWrapper";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../../redux/slices/snackbar-slice";
import {
  fetchSubmodule,
  // viewRoleAccess,
  masterRoleAccess,
  assignRole,
} from "../../../api/master-data/role-access";
import { fetchSelectModule } from "../../../api/register/create-admin";
import RegisterCard from "../../card/RegisterCard";
import NewAccessCreateModal from "./new-access-modal/NewAccessModal";
import {
  getRoleByShipperId,
  viewRoleAccessByShipperId,
} from "../../../api/shipper-role/shipper-role";
import AddAccessTable from "./add-access-table/AddAccessTable";
import ConfirmationModal from "./confirmation-modal/ConfirmationModal";

const labels = {
  show_draft: "Show Draft Tab",
  allow_draft_view: "Allow Draft View",
  allow_draft_edit: "Allow Draft Edit",
  allow_draft_delete: "Allow Draft Delete",
  show_transporter_live_rates: "Show Transporter Live Rates",
  allow_view_assigned_transporters: "Allow View Assigned Transporters",
  show_assignment_transporter_name: "Show Assignment Transporter Name",
  show_assignment_transporter_rate: "Show Assignment Transporter Rate",
  allow_assignment: "Allow Assignment",
  allow_rebid: "Allow Rebid",
  allow_bid_match: "Allow Bid Match",
  allow_start_tracking: "Allow Start Tracking",
  allow_tracking_view: "Allow Tracking View",
  allow_tracking_edit: "Allow Tracking Edit",
  allow_tracking_delete: "Allow Tracking Delete",
};

export default function AddAccess({ handlePrevious, handleNext }) {
  const [loading, setIsLoading] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [payload, setPayload] = useState([]);
  const [generatedRow, setGeneratedRow] = useState([]);
  const [roleID, setRoleID] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [accessArray, setAccessArray] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selecttedModule, setSelectedModule] = useState();
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  // const [searchValue, setSearchValue] = useState([]);
  const [filteredRows, setFilteredRows] = useState(roleData);

  const dispatch = useDispatch();

  const SHIPPER_ID = localStorage.getItem("shipper_id");
  const shipperName = localStorage.getItem("shipper_name");

  useEffect(() => {
    fetchAllData();
  }, [reloadFlag]);

  const handleSearchChange = (value) => {
    // setSearchValue(value);
    const filteredRows = roleData.filter((row) =>
      Object.values(row).some((fieldValue) =>
        String(fieldValue).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredRows(filteredRows);
  };

  function handleRoleSubmit() {
    console.log("payload", payload);
    console.log("access roles", accessArray);
    const resultObject = accessArray.reduce((result, { key, value }) => {
      result[key] = value;
      return result;
    }, {});

    console.log("hoho", resultObject);

    if (payload.filter((x) => x != null).length === 0) {
      dispatch(
        openSnackbar({
          type: "error",
          message: "Please select atleast one menu!",
        })
      );
    } else {
      assignRole({
        ...resultObject,
        role_id: roleID,
        submodule_ids: payload.filter((x) => x != null),
        shipper_id: SHIPPER_ID,
      })
        .then((res) => {
          if (res.data.success) {
            console.log(res);
            setReloadFlag(true);
            ///handle route and redirect somewhere
            // setRoleList([]);
            // setPayload();
            dispatch(
              openSnackbar({
                type: "success",
                message: "Access updated successfully!",
              })
            );
          }
        })
        .catch((err) => console.log(err));
    }
  }

  const fetchAllData = async () => {
    const shipperId = SHIPPER_ID;
    setIsLoading(true);

    try {
      const [roleResponse, submoduleResponse, masterRoleResponse] =
        await Promise.all([
          getRoleByShipperId(shipperId),
          fetchSubmodule(shipperId),
          masterRoleAccess(shipperId),
        ]);
      if (roleResponse.data.success === true) {
        const roleData = roleResponse.data.data.map((item) => {
          return {
            label: item.role_name,
            id: item.id,
          };
        });
        setRoleList(roleData);
      } else {
        dispatch(
          openSnackbar({
            type: "error",
            message: roleResponse.data.clientMessage,
          })
        );
        setRoleList([]);
      }

      if (submoduleResponse.data.success === true) {
        // const filteredData = submoduleResponse.data.data.filter(
        //   (item) => !('Trip Management' in item)
        // );
        // console.log('wait', filteredData);
        setGeneratedRow(submoduleResponse.data.data);
      } else {
        dispatch(
          openSnackbar({
            type: "error",
            message: roleResponse.data.clientMessage,
          })
        );
      }

      if (masterRoleResponse.data.success === true) {
        setRoleData(masterRoleResponse.data.data);
        setFilteredRows(masterRoleResponse.data.data);
      } else {
        dispatch(
          openSnackbar({
            type: "error",
            message: roleResponse.data.clientMessage,
          })
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setReloadFlag(false);
    }
  };

  const handleChange = (subitem, e) => {
    console.log(subitem, e.target.checked, accessArray);

    setAccessArray((prevState) => {
      const newData = prevState.map((item) => {
        if (
          (item.key == "show_draft" || item.key == "allow_rebid") &&
          subitem.id == "efc402ea-e245-408f-ae85-a647e4e7393e"
        ) {
          item["value"] = e.target.checked;
        } else if (
          item.key == "allow_start_tracking" &&
          subitem.id == "9eb8a276-20fd-4d6b-b0f3-ba46f70f2253"
        ) {
          item["value"] = e.target.checked;
        }
        return item;
      });
      // console.log('>>>>>>>>>>>', newData);
      return newData;
    });

    setPayload((prev) =>
      prev.includes(subitem.id)
        ? prev.filter((x) => x != subitem.id)
        : [...prev, subitem.id]
    );
  };

  const handleChangeRole = (value) => {
    setAllSelected(false);
    setSelectedRole(value);
    if (value) {
      setRoleID(value.id);
      fetchAccess(value.id, SHIPPER_ID);
    } else {
      setRoleID(null);
      setPayload([]);
    }
  };

  const fetchAccess = (id, shipperId) => {
    console.log("id", id);
    viewRoleAccessByShipperId(id, shipperId)
      .then((res) => {
        if (res.data.success === true) {
          const accessList = res.data.data.submodules.map(
            (item) => item.submodule_id
          );

          setPayload(accessList);

          if (res.data.data.operational_access === null) {
            const arrayOfObjects = Object.entries(labels).map(
              ([key, value]) => {
                console.log("hello", key);
                return {
                  name: value,
                  key,
                  value:
                    key === "allow_draft_view" || key == "allow_tracking_view",
                };
              }
            );
            setAccessArray(arrayOfObjects);
          } else {
            const filteredObject = Object.keys(labels).reduce((result, key) => {
              if (Object.hasOwn(res.data.data.operational_access, key)) {
                result[key] = res.data.data.operational_access[key];
              }
              return result;
            }, {});
            const arrayOfObjects = Object.entries(filteredObject).map(
              ([key, value]) => ({
                name: labels[key],
                key,
                value,
              })
            );

            setAccessArray(arrayOfObjects);
          }
        } else {
          dispatch(
            openSnackbar({
              type: "error",
              message: res.data.clientMessage,
            })
          );
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleChangeAccess = (index) => {
    if (index >= 0 && index < accessArray.length) {
      const newArray = [...accessArray];
      newArray[index].value = !newArray[index].value;
      setAccessArray(newArray);
    }
  };

  const handleCloseConfirmation = (val) => {
    if (val === true) {
      setOpenConfirmationModal(false);
      handleNext();
    } else {
      setOpenConfirmationModal(false);
    }
  };

  const handleSelectAll = () => {
    setAllSelected(true);
    setAccessArray((prevState) => {
      const newArr = prevState.map((item) => {
        return {
          ...item,
          value: true,
        };
      });
      return newArr;
    });
    const values = generatedRow.map((item) =>
      Object.values(item)[0].map((item) => item.id)
    );
    let flatArray = [].concat(...values);
    console.log("values", flatArray);
    setPayload(flatArray);
  };

  const handleUnselectSelectAll = () => {
    setAllSelected(false);
    setPayload([]);
    setAccessArray((prevState) => {
      const newArr = prevState.map((item) => {
        return {
          ...item,
          value: false,
        };
      });
      return newArr;
    });
  };

  useEffect(() => {
    if (SHIPPER_ID) {
      fetchSelectModule(SHIPPER_ID).then((res) => {
        console.log("hey", res.data.data[0]?.module.name);
        if (res.data.data) {
          setSelectedModule(res.data.data[0]?.module.name);
        }

        // setValue("adminName",res.data.name)
      });
    }
  }, []);

  const menus = generatedRow.map((x) => Object.keys(x)[0]);
  const accessMenuList =
    selecttedModule == "Bidding"
      ? menus.slice(0, 2)
      : selecttedModule == "Tracking"
      ? menus.slice(2, 4)
      : menus;
  console.log(accessMenuList);

  return (
    <>
      <BackdropComponent loading={loading} />
      <ContentWrapper>
        <TitleContainer>
          <Typography variant="h3">Roles & Access</Typography>
          <Typography
            sx={{
              fontWeight: 400,
              marginTop: "8px",
              color: "#8A919D",
            }}
            variant="body1"
            mb={1}
          >
            Add / Update access for modules
          </Typography>
          {shipperName && (
            <Typography
              variant="h3"
              sx={{ color: "#122B47", fontSize: "12px", fontWeight: 500 }}
            >
              <Typography
                variant="span"
                sx={{ color: "#122B47", fontSize: "12px", fontWeight: 700 }}
              >
                Shipper Name:
              </Typography>
              {"  "}
              {shipperName}
            </Typography>
          )}
        </TitleContainer>
        <RegisterCard title="Select Access">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={roleList}
              sx={{ width: 300 }}
              getOptionLabel={(option) => option.label}
              value={selectedRole !== null ? selectedRole : null}
              onChange={(event, value) => handleChangeRole(value)}
              isOptionEqualToValue={(option, value) =>
                option.id === (value ? value.id : null)
              }
              renderInput={(params) => (
                <TextField {...params} variant="filled" label="Select Role" />
              )}
              clearIcon={false}
            />
            <Box display="block">
              <Button variant="contained" onClick={handleModalOpen}>
                Create Role
              </Button>
            </Box>
          </Box>
          <Box>
            {roleID && (
              <Box display="flex" justifyContent="right">
                {allSelected ? (
                  <Button variant="outlined" onClick={handleUnselectSelectAll}>
                    Unselect All
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleSelectAll}>
                    Select All
                  </Button>
                )}
              </Box>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                {roleID &&
                  generatedRow.map((item, index) => {
                    const isBlockDisabled = !accessMenuList.includes(
                      Object.keys(item)[0]
                    );

                    return (
                      <Box
                        key={index}
                        p={4}
                        my={3}
                        sx={{
                          border: "0.5px solid #BDCCD3",
                          borderRadius: "4px",
                          opacity: isBlockDisabled ? 0.5 : 1,
                        }}
                      >
                        <Typography variant="h5">
                          {Object.keys(item)} :{" "}
                        </Typography>

                        <Box container alignItems="center">
                          {Object.values(item)[0].map((subitem) => (
                            <FormControlLabel
                              control={<Checkbox />}
                              label={subitem.name}
                              checked={payload.includes(subitem.id)}
                              // value={selectedRole}
                              // value={subitem.id}
                              key={subitem.id}
                              onChange={(e) => handleChange(subitem, e)}
                              disabled={isBlockDisabled}
                            />
                          ))}
                        </Box>
                      </Box>
                    );
                  })}
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} my={3}>
                {roleID && (
                  <Grid
                    container
                    sx={{
                      border: "0.5px solid #BDCCD3",
                      borderRadius: "4px",
                    }}
                    py={2}
                  >
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography variant="h5" px={4} mt={3}>
                        Allow Access
                      </Typography>
                      <Grid container>
                        {accessArray.map((subitem, index) => {
                          // let val = subitem.value;
                          // if (subitem.key == 'show_draft') {
                          //   val = payload.includes(
                          //     'efc402ea-e245-408f-ae85-a647e4e7393e'
                          //   );
                          // } else if (subitem.key == 'allow_start_tracking') {
                          //   val = payload.includes(
                          //     '9eb8a276-20fd-4d6b-b0f3-ba46f70f2253'
                          //   );
                          // }

                          return (
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={6}
                              lg={6}
                              px={4}
                              key={index}
                              py={1}
                            >
                              <FormControlLabel
                                control={<Checkbox />}
                                label={subitem.name}
                                checked={subitem.value}
                                // value={selectedRole}
                                value={subitem.value}
                                onChange={() => handleChangeAccess(index)}
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Box>
          {roleID && (
            <Box justifyContent="right" display="flex">
              <Button variant="contained" onClick={handleRoleSubmit}>
                Submit
              </Button>
            </Box>
          )}
        </RegisterCard>
        <RegisterCard title="Role & Access table">
          <AddAccessTable
            roleData={filteredRows}
            handleSearchChangeProps={handleSearchChange}
          />
        </RegisterCard>
      </ContentWrapper>

      <FooterWrapper>
        <Button variant="outlined" onClick={handlePrevious}>
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={() => setOpenConfirmationModal(true)}
        >
          Continue
        </Button>
      </FooterWrapper>
      <NewAccessCreateModal
        open={openModal}
        handleClose={handleModalClose}
        handleReloadData={() => setReloadFlag(true)}
        generatedRow={generatedRow}
        selecttedModule={selecttedModule}
      />
      <ConfirmationModal
        openConfirmationModal={openConfirmationModal}
        handleCloseConfirmation={handleCloseConfirmation}
      />
    </>
  );
}
