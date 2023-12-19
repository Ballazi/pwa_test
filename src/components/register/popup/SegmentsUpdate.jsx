import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Chip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  nameValidator,
  requiredValidatorOfArray,
} from "../../../validation/common-validator";
import Autocomplete from "@mui/material/Autocomplete";
import {
  updateSegment,
  getSegmentTransporter,
} from "../../../api/register/segment-details";
import BackdropComponent from "../../backdrop/Backdrop";
import { openSnackbar } from "../../../redux/slices/snackbar-slice";
import { useDispatch } from "react-redux";

const schema = yup.object().shape({
  name: nameValidator,
  transporter_list: requiredValidatorOfArray("Transporters"),
});

const SegmentsUpdate = ({
  rowObject,
  handleClose,
  saveUpdateHandler,
  shipper_id,
}) => {
  const {
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [open, setOpen] = useState(true);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [segmentOptions, setsegmentOptions] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchSegmentTransporterData = () => {
    setIsLoading(true);
    const payload = {
      shipper_id: shipper_id,
    };
    return getSegmentTransporter(payload)
      .then((res) => {
        console.log(res.data);
        if (res.data.success === true) {
          const updatedCountry = res.data.data.map((item) => {
            return {
              label: item.name,
              value: item.trnsp_id,
            };
          });
          setsegmentOptions(updatedCountry);
          const newArray = updatedCountry.filter((obj) =>
            rowObject.trans_list.includes(obj.value)
          );
          setValue("name", rowObject.name);
          setValue("transporter_list", newArray);
          setSelectedSegments(newArray);
        } else {
          dispatch(
            openSnackbar({ type: "error", message: res.data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchSegmentTransporterData();
    };

    fetchData();
  }, []);

  const handleTransportChipDelete = (data) => {
    const filteredData = selectedSegments.filter(
      (ele) => ele.label !== data.label
    );
    setSelectedSegments(filteredData);
    setValue("transporter_list", [...filteredData]);
  };

  const close = () => {
    setOpen(false);
    handleClose();
  };

  const handleSaveButtonClick = (form_data) => {
    const branchId = rowObject.seg_id;
    const transporterList = form_data.transporter_list.map((ele) => ele.value);
    const payload = {
      name: form_data.name.toUpperCase(),
      seg_shipper_id: shipper_id,
      transporter_list: transporterList,
    };
    return updateSegment(branchId, payload)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: "success", message: res.data.clientMessage })
          );
          saveUpdateHandler();
          reset();
        } else {
          dispatch(
            openSnackbar({ type: "error", message: res.data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const handleSelectedSegmentsChange = (newValue) => {
    setSelectedSegments(newValue);
  };

  return (
    <>
      <BackdropComponent loading={loading} />
      <Dialog open={open} onClose={close} maxWidth={"xs"}>
        <div className="customCardheader">
          <Typography variant="h4"> Update Segment</Typography>
        </div>
        <form onSubmit={handleSubmit(handleSaveButtonClick)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      {...field}
                      label="Segment Name*"
                      size="small"
                      variant="filled"
                      error={Boolean(errors.name)}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="transporter_list"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      limitTags={2}
                      id="regions-select"
                      getOptionLabel={(option) => option.label || ""}
                      options={segmentOptions}
                      popupIcon={<KeyboardArrowDownIcon />}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      size="small"
                      onChange={(_, newValue) => {
                        field.onChange(newValue);
                        handleSelectedSegmentsChange(newValue);
                      }}
                      value={selectedSegments}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Transporters to include in this segment*"
                          variant="filled"
                          fullWidth
                          size="small"
                          error={Boolean(errors.transporter_list)}
                          helperText={errors.transporter_list?.message}
                        />
                      )}
                      renderTags={(value) => (
                        <Box>{value.length} Transporters Selected</Box>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: { md: "none" } }}>
                <Box>
                  <Typography variant="h4">Transporters Selected</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ width: "100%" }}>
                  {selectedSegments.map((segment) => (
                    <Chip
                      key={segment.value}
                      label={segment.label}
                      onDelete={() => handleTransportChipDelete(segment)}
                      variant="outlined"
                      color="primary"
                      sx={{ mr: "8px", mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={close} variant="contained" color="error">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default SegmentsUpdate;
