import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Typography,
  IconButton,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  styled,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import {
  createRole,
  assignRoleByShipperId,
} from "../../../../api/shipper-role/shipper-role";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../../../redux/slices/snackbar-slice";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function NewAccessCreateModal({
  open,
  handleClose,
  generatedRow,
  handleReloadData,
  selecttedModule,
}) {
  const [payload, setPayload] = useState([]);
  const [roleName, setRoleName] = useState("");
  const SHIPPER_ID = localStorage.getItem("shipper_id");
  const dispatch = useDispatch();

  const handleChangePayload = (subitem) => {
    console.log(subitem);
    setPayload((prev) =>
      prev.includes(subitem.id)
        ? prev.filter((x) => x != subitem.id)
        : [...prev, subitem.id]
    );
  };

  const handleSave = () => {
    console.log(payload);

    if (!roleName.trim()) {
      dispatch(
        openSnackbar({
          type: "error",
          message: "Role name cannot be empty.",
        })
      );
    } else if (roleName.length < 2 || roleName.length > 50) {
      dispatch(
        openSnackbar({
          type: "error",
          message: "Name must be between 2 to 50 characters.",
        })
      );
    } else if (payload.length === 0) {
      dispatch(
        openSnackbar({
          type: "error",
          message: "Please select atleast one role!",
        })
      );
    } else {
      const roleCreatePayload = {
        role_name: roleName,
        shipper_id: SHIPPER_ID,
      };
      createRole(roleCreatePayload)
        .then((res) => {
          if (res.data.success) {
            console.log(res.data.data.id);

            assignRoleByShipperId({
              role_id: res.data.data.id,
              submodule_ids: payload,
              shipper_id: SHIPPER_ID,
            })
              .then(() => {
                if (res.data.success) {
                  handleReloadData();
                  handleClose();
                }
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const menus = generatedRow.map((x) => Object.keys(x)[0]);
  const accessMenuList =
    selecttedModule == "Bidding"
      ? menus.slice(0, 2)
      : selecttedModule == "Tracking"
      ? menus.slice(2, 4)
      : menus;
  console.log(accessMenuList);
  return (
    <BootstrapDialog
      // onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Create new role
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <TextField
          id="filled-basic"
          label="Role name"
          variant="filled"
          onChange={(e) => setRoleName(e.target.value)}
        />
        {generatedRow.map((item, index) => {
          const isBlockDisabled = !accessMenuList.includes(
            Object.keys(item)[0]
          );
          return (
            <Box
              key={index}
              container
              alignItems="center"
              sx={{
                border: "0.5px solid #BDCCD3",
                borderRadius: "4px",
                opacity: isBlockDisabled ? 0.5 : 1,
              }}
              p={3}
              my={3}
            >
              <Typography variant="h5">{Object.keys(item)} : </Typography>
              {Object.values(item)[0].map((subitem) => (
                <FormControlLabel
                  control={<Checkbox />}
                  label={subitem.name}
                  checked={payload.includes(subitem.id)}
                  // value={selectedRole}
                  // value={subitem.id}
                  key={subitem.id}
                  onChange={() => handleChangePayload(subitem)}
                  disabled={isBlockDisabled}
                />
              ))}
            </Box>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleSave}>
          Save changes
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
