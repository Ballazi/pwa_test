import { useState, useEffect, useRef } from 'react';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  LinearProgress,
  IconButton,
  InputLabel,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  nameValidator,
  emailValidator,
  contactPersonValidator,
  contactNumberValidator,
  addressLine1ValidatorBranch,
  addressLine2ValidatorBranch,
  cityValidator,
  pinCodeValidator,
  countryValidator,
  stateValidator,
  requiredValidator,
  nonRequiredValidator,
  alphaNumeric
} from '../../../validation/common-validator';
import {
  Autocomplete as GoogleAutoComplete,
  useLoadScript,
} from '@react-google-maps/api';
import Autocomplete from '@mui/material/Autocomplete';
import { getAllStateByCountry } from '../../../api/master-data/state';
import { updateBranch } from '../../../api/register/branch-details';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';
import { useDispatch } from 'react-redux';
import BackdropComponent from '../../backdrop/Backdrop';
import DownloadIcon from '@mui/icons-material/Download';
import pdficon from '../../../../public/PDF_svg.svg';
import jpgicon from '../../../../public/JPG_svg.svg';
import pngicon from '../../../../public/PNG_svg.svg';
import docIcon from '../../../assets/doc.svg';
import docxIcon from '../../../assets/docx.svg';
import jpegIcon from '../../../assets/jpeg.svg';
import xlsIcon from '../../../assets/xls.svg';
import xlsxIcon from '../../../assets/xlsx.svg';
import {
  StringSlice,
  getBase64SingleFile,
} from '../../../utility/utility-function';
import { Clear } from '@mui/icons-material';
import ErrorTypography from '../../typography/ErrorTypography';
const baseUrl = import.meta.env.VITE_TMS_APP_API_URL;

const schema = yup.object().shape({
  branchName: alphaNumeric("Branch name"),
  email: emailValidator,
  contactPerson: contactPersonValidator,
  contactNumber: contactNumberValidator,
  // gstin: gstValidator,
  gstin: requiredValidator('Gstin'),
  cluster: nonRequiredValidator('Cluster/Region'),
  branchAddressLine1: addressLine1ValidatorBranch,
  branchAddressLine2: addressLine2ValidatorBranch,
  branchCity: cityValidator,
  branchPinCode: pinCodeValidator,
  branchCountry: countryValidator,
  branchState: stateValidator,
});

const BranchUpdate = ({
  rowObject,
  handleClose,
  editClusterStates,
  editCountryStates,
}) => {
  const {
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [open, setOpen] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const [clusterStates, setClusterStates] = useState([]);
  const [countryStates, setCountryStates] = useState([]);
  const [docPath, setDocPath] = useState(null);
  const [states, setStates] = useState([]);
  const [isDocumentChange, setIsDocumentChange] = useState(false);
  const shipper_id = localStorage.getItem('shipper_id');
  const dispatch = useDispatch();
  const branchFullAdress = useRef();
  const gogapi = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
  const libs = ['places', 'drawing'];
  const { isLoaded, loadError, loadSuccess } = useLoadScript({
    googleMapsApiKey: gogapi,
    libraries: libs,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const iconList = {
    jpg: jpgicon,
    pdf: pdficon,
    png: pngicon,
    doc: docIcon,
    docx: docxIcon,
    jpeg: jpegIcon,
    xls: xlsIcon,
    xlsx: xlsxIcon,
  };
  let fileUploadProgress = {};

  const fetchStateData = (id) => {
    return getAllStateByCountry(id)
      .then((res) => {
        if (res.data.success === true) {
          const updatedState = res.data.data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setStates(updatedState);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
          setStates([]);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchStateData(rowObject.branchCountry);
      setClusterStates(editClusterStates);
      setCountryStates(editCountryStates);
      setValue('branchName', rowObject.branchName);
      setValue('email', rowObject.email);
      setValue('contactPerson', rowObject.contactPerson);
      setValue('contactNumber', rowObject.contactNumber);
      setValue('gstin', rowObject.gstin);
      setValue('cluster', rowObject.cluster ? rowObject.cluster : '');
      setValue('branchAddressLine1', rowObject.branchAddressLine1);
      setValue('branchAddressLine2', rowObject.branchAddressLine2);
      setValue('branchCity', rowObject.branchCity);
      setValue('branchPinCode', rowObject.branchPinCode);
      setValue('branchCountry', rowObject.branchCountry);
      setValue('branchState', rowObject.branchState);
      setDocPath(rowObject.documents);
      branchFullAdress.current.value = rowObject.branchFullAdress;
      console.log('is appeared', rowObject.branchFullAdress);
    };
    fetchData();
  }, []);

  const close = () => {
    setOpen(false);
    handleClose(false);
    reset();
  };

  const handleSaveButtonClick = async (form_data) => {
    const branchId = rowObject.branch_id;
    let uploadDocs;
    if (
      form_data.documents !== 'undefined' &&
      typeof form_data.documents !== 'undefined'
    ) {
      uploadDocs = await getBase64SingleFile(form_data.documents[0]);
    }
    const payload = {
      branch_id: rowObject.branch_id,
      name: form_data.branchName,
      branch_shipper_id: localStorage.getItem('shipper_id'),
      branch_region_cluster_id: form_data.cluster ? form_data.cluster : null,
      gstin: form_data.gstin,
      contact_person: form_data.contactPerson,
      contact_no: form_data.contactNumber,
      email: form_data.email,
      address:
        form_data.branchAddressLine1 + '||' + form_data.branchAddressLine2,
      city: form_data.branchCity,
      state: form_data.branchState,
      country: form_data.branchCountry,
      postal_code: form_data.branchPinCode,
      google_address: branchFullAdress.current.value,
      support_doc: uploadDocs,
      is_file_updated: isDocumentChange,
    };
    setIsLoading(true);
    updateBranch(branchId, payload)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: 'success', message: res.data.clientMessage })
          );
          window.scrollTo({ top: 0, behavior: 'smooth' });
          handleClose(true);
          reset();
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error('Error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  function parseAddress(address) {
    const parts = address.split(',').map((part) => part.trim());

    // Get country (last part)
    const country = parts.pop();

    const x = parts.pop();
    let containsNumber = /\d/.test(x);
    let pincode = '';
    let state = '';
    console.log('contains number', containsNumber);

    if (containsNumber) {
      pincode = x.match(/\S+$/)[0];
      // Get state and pincode (2nd last part)
      state = x.substring(0, x.match(/\S+$/)['index'] - 1);
    } else {
      state = x;
    }

    // Get address lines (3rd+4th parts and the rest)
    const [line3, line4, ...rest] = parts.reverse();

    // Combine address lines
    const addressLines = [line3, line4, ...rest.reverse()];

    return {
      addressLines,
      state,
      pincode,
      country,
    };
  }
  function handleBranchAddressChnage() {
    console.log('onplaceChnaged', branchFullAdress.current.value);
    var geocoder = new window.google.maps.Geocoder();
    let latLng = {};

    geocoder
      .geocode({ address: branchFullAdress.current.value })
      .then((res) => {
        latLng = {
          lat: parseFloat(res.results[0].geometry.location.lat()),
          lng: parseFloat(res.results[0].geometry.location.lng()),
        };
        geocoder.geocode({ location: latLng }).then((res) => {
          console.log('res in reverse', res);

          const branchDetailAddress = parseAddress(
            res.results[0].formatted_address
          );

          const maxLinesInAddressLine1 = 2;

          let addressLine1, addressLine2;

          if (branchDetailAddress.addressLines.length > 1) {
            addressLine1 = branchDetailAddress.addressLines
              .slice(1, 1 + maxLinesInAddressLine1)
              .join(', ');
            addressLine2 = branchDetailAddress.addressLines
              .slice(maxLinesInAddressLine1 + 1)
              .join(', ');
          } else {
            addressLine1 = '';
            addressLine2 = ''; // or set a default value
          }
          console.log('Address Line 1:', addressLine1);
          console.log('Address Line 2:', addressLine2);

          setValue('branchAddressLine1', addressLine1);
          setValue('branchAddressLine2', addressLine2);

          setValue('branchPinCode', branchDetailAddress.pincode);
          setValue('branchCity', branchDetailAddress.addressLines[0]);

          countryStates.map((item) => {
            if (item.label === branchDetailAddress.country) {
              fetchStateData(item.value);
              setValue('branchCountry', item.value);
            }
          });

          states.map((item) => {
            console.log('StateName', item.label);
            if (item.label === branchDetailAddress.state) {
              console.log('in state', item.label);
              setValue('branchState', item.value);
            }
          });

          console.log('parsed  Adddr', branchDetailAddress, states);
        });
      });
  }

  const handleFileDrop = (event) => {
    console.log(event);
    setError('documents', undefined);
    clearErrors('documents');
    event.preventDefault();
    event.stopPropagation();
    const files = Array.from(event.dataTransfer.files); // Convert FileList to an array
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
    const allowedFormats = [
      'doc',
      'png',
      'jpg',
      'jpeg',
      'pdf',
      'xls',
      'xlsx',
      'docx',
    ];

    const invalidSizeFiles = files.filter((file) => file.size > maxSize);
    const invalidFormatFiles = files.filter(
      (file) =>
        !allowedFormats.includes(file.name.split('.').pop().toLowerCase())
    );

    if (invalidSizeFiles.length > 0 || invalidFormatFiles.length > 0) {
      // setDocuments(() => []);
      // setSelectedFiles(() => []);
      // setValue('documents', []);

      let errorMessage = '';

      if (invalidSizeFiles.length > 0) {
        const exceedingFilesNames = invalidSizeFiles.map((file) => file.name);
        errorMessage = `Some files exceed the 10 MB limit: ${exceedingFilesNames.join(
          ', '
        )}.`;
      }

      if (invalidFormatFiles.length > 0) {
        const invalidFileNames = invalidFormatFiles.map((file) => file.name);
        errorMessage +=
          (errorMessage ? ' ' : '') +
          `Invalid file format for: ${invalidFileNames.join(
            ', '
          )}. Please upload files in the specified formats.`;
      }

      // Set separate error messages for 10 MB limit and file format errors
      setError('documents', {
        message: errorMessage,
        type: 'validate',
      });
    }
    const validFiles = files.filter((file) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      return file.size <= maxSize && allowedFormats.includes(fileExtension);
    });

    // if (validFiles.length > 0) {
    const newfiles = [...documents, ...validFiles];
    setDocuments(newfiles);
    setValue('documents', newfiles);
    setSelectedFiles(() => [
      // ...(prev || []),
      ...newfiles.map((file) => file.name),
    ]);
    setIsDocumentChange(true);
    // }
    // else {
    //   const validFiles = Array.from(files);

    //   setSelectedFiles((prev) => [
    //     // ...(prev || []),
    //     ...validFiles.map((file) => file.name),
    //   ]);
    //   setIsDocumentChange(true);
    //   setValue('documents', validFiles);
    // }
  };

  const handleRemoveFile = (index) => {
    clearErrors('documents');
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    const updatedDocuments = documents.filter((_, i) => i !== index);
    // Update the state with the new array
    setDocuments(updatedDocuments);
    setValue('documents', updatedDocuments);
    setSelectedFiles(updatedFiles);
  };

  const handleFileInputChange = (event) => {
    console.log('triggered');
    if (!event.target.files.length) {
      event.target.value = '';
      clearErrors('documents');
      return;
    }

    clearErrors('documents');
    const files = Array.from(event.target.files);
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
    const allowedFormats = [
      'doc',
      'png',
      'jpg',
      'jpeg',
      'pdf',
      'xls',
      'xlsx',
      'docx',
    ];

    const invalidFiles = files.filter((file) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      return file.size > maxSize || !allowedFormats.includes(fileExtension);
    });

    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles.map((file) => file.name);
      // setDocuments(() => []);
      // setSelectedFiles(() => []);
      // setValue('documents', []);

      let errorMessage = '';

      if (invalidFiles.some((file) => file.size > maxSize)) {
        const exceedingFilesNames = invalidFiles
          .filter((file) => file.size > maxSize)
          .map((file) => file.name);
        errorMessage = `Some files exceed the 10 MB limit: ${exceedingFilesNames.join(
          ', '
        )}.`;
      } else {
        errorMessage = `Invalid file format for: ${invalidFileNames.join(
          ', '
        )}. Please upload files in the specified formats.`;
      }

      // Throw an error if any file exceeds the size limit or has an invalid format
      setError('documents', {
        message: errorMessage,
      });
      // return; // Don't proceed if any file is invalid
    }

    const validFiles = files.filter((file) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      return file.size <= maxSize && allowedFormats.includes(fileExtension);
    });

    // if (validFiles.length > 0) {
    const newfiles = [...documents, ...validFiles];
    console.log('newfiles', documents, validFiles);
    setDocuments(newfiles);
    setValue('documents', newfiles);
    setSelectedFiles(() => [
      // ...(prev || []),
      ...newfiles.map((file) => file.name),
    ]);
    setIsDocumentChange(true);
    // } else {
    //   // Handle the case where no valid files were selected or show an error message.
    //   setError('documents', {
    //     message: 'No valid files selected or files exceed the 10 MB limit.',
    //   });
    // }
  };

  return (
    <>
      <BackdropComponent loading={loading} />
      {console.log('docPath', docPath)}
      <Dialog open={open} onClose={close} maxWidth={'md'}>
        <div className="customCardheader">
          <Typography variant="h4"> Update Branch</Typography>
        </div>
        <form onSubmit={handleSubmit(handleSaveButtonClick)}>
          <DialogContent>
            <Box>
              <Typography style={{ marginBottom: '20px' }} variant="h4">
                Branch Details
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="branchName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Branch Name*"
                      {...field}
                      size="small"
                      variant="filled"
                      fullWidth
                      error={Boolean(errors.branchName)}
                      helperText={errors.branchName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Email*"
                      {...field}
                      size="small"
                      variant="filled"
                      fullWidth
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="contactPerson"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contact person*"
                      size="small"
                      variant="filled"
                      fullWidth
                      error={Boolean(errors.contactPerson)}
                      helperText={errors.contactPerson?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="contactNumber"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Contact Number*"
                      {...field}
                      size="small"
                      variant="filled"
                      fullWidth
                      error={Boolean(errors.contactNumber)}
                      helperText={errors.contactNumber?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="gstin"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="GSTIN*"
                      {...field}
                      size="small"
                      variant="filled"
                      fullWidth
                      error={Boolean(errors.gstin)}
                      helperText={errors.gstin?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="cluster"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={clusterStates}
                      getOptionLabel={(option) => option.label || ''}
                      value={
                        clusterStates.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.value : '');
                      }}
                      popupIcon={<KeyboardArrowDownIcon />}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select cluster/region"
                          variant="filled"
                          fullWidth
                          size="small"
                          error={!!errors.cluster}
                          helperText={errors.cluster?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography style={{ marginBottom: '20px' }} variant="h4">
                  Branch address
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                {isLoaded ? (
                  <>
                    {/* <InputLabel shrink>Full Address*</InputLabel> */}
                    <GoogleAutoComplete
                      onPlaceChanged={() => handleBranchAddressChnage()}
                      restrictions={{ country: 'ind' }}
                    >
                      <TextField
                        label="Full Address*"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        variant="filled"
                        fullWidth
                        inputRef={branchFullAdress}
                        // error={Boolean(errors.branchAddressLine1)}
                        // helperText={errors.branchAddressLine1?.message}
                      />
                    </GoogleAutoComplete>
                  </>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="branchAddressLine1"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Address line 1*"
                      {...field}
                      size="small"
                      variant="filled"
                      fullWidth
                      error={Boolean(errors.branchAddressLine1)}
                      helperText={errors.branchAddressLine1?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="branchAddressLine2"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Address line 2"
                      {...field}
                      size="small"
                      variant="filled"
                      fullWidth
                      error={Boolean(errors.branchAddressLine2)}
                      helperText={errors.branchAddressLine2?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="branchCountry"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={countryStates}
                      getOptionLabel={(option) => option.label || ''}
                      value={
                        countryStates.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.value : '');
                        fetchStateData(newValue.value);
                      }}
                      popupIcon={<KeyboardArrowDownIcon />}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          disabled={true}
                          label="Country*"
                          variant="filled"
                          fullWidth
                          size="small"
                          error={!!errors.branchCountry}
                          helperText={errors.branchCountry?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="branchState"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      disabled={true}
                      options={states}
                      getOptionLabel={(option) => option.label || ''}
                      value={
                        states.find((option) => option.value === field.value) ||
                        null
                      }
                      onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.value : '');
                      }}
                      popupIcon={<KeyboardArrowDownIcon />}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="State*"
                          variant="filled"
                          fullWidth
                          size="small"
                          error={!!errors.branchState}
                          helperText={errors.branchState?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="branchCity"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="City*"
                      {...field}
                      size="small"
                      variant="filled"
                      fullWidth
                      error={!!errors.branchCity}
                      helperText={errors.branchCity?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="branchPinCode"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Pin code*"
                      {...field}
                      size="small"
                      variant="filled"
                      fullWidth
                      error={!!errors.branchPinCode}
                      helperText={errors.branchPinCode?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {docPath && (
              <Box sx={{ display: 'flex', mt: 2 }}>
                <Typography
                  style={{ marginBottom: '20px', marginRight: '20px' }}
                  variant="h4"
                >
                  Download GSTIN
                </Typography>
                <a
                  href={`${baseUrl}/service/file/download/all/${shipper_id}/${docPath}`}
                >
                  <DownloadIcon />
                  {/* {docPath} */}
                </a>
              </Box>
            )}

            <Grid item xs={12}>
              <Typography variant="h4">Upload GSTIN *</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={12}>
                  <div
                    id="file-drop"
                    style={{
                      border: '2px dashed rgba(171, 191, 201, 0.80)',
                      borderRadius: '10px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                    onDrop={handleFileDrop}
                    onDragOver={(event) => event.preventDefault()}
                  >
                    <svg
                      width="41"
                      height="39"
                      viewBox="0 0 41 39"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.4239 4.44867C21.3067 4.32699 21.1642 4.22981 21.0054 4.16332C20.8466 4.09684 20.6749 4.0625 20.5013 4.0625C20.3278 4.0625 20.1561 4.09684 19.9973 4.16332C19.8385 4.22981 19.696 4.32699 19.5788 4.44867L12.9122 11.3758C12.6925 11.609 12.5787 11.9151 12.5954 12.2277C12.612 12.5402 12.7579 12.8338 13.0012 13.0448C13.2445 13.2557 13.5657 13.3668 13.8948 13.3541C14.2239 13.3413 14.5345 13.2056 14.7588 12.9765L19.2522 8.30567V25.8332C19.2522 26.1481 19.3839 26.4502 19.6183 26.6729C19.8527 26.8956 20.1707 27.0207 20.5022 27.0207C20.8337 27.0207 21.1516 26.8956 21.3861 26.6729C21.6205 26.4502 21.7522 26.1481 21.7522 25.8332V8.30884L26.2472 12.9797C26.4711 13.2121 26.783 13.3505 27.1143 13.3645C27.4456 13.3784 27.7692 13.2668 28.0138 13.0541C28.2585 12.8414 28.4042 12.5451 28.4189 12.2303C28.4336 11.9156 28.3161 11.6082 28.0922 11.3758L21.4239 4.44867Z"
                        fill="#ABBFC9"
                      />
                      <path
                        d="M6.75 24.25C6.75 23.9351 6.6183 23.633 6.38388 23.4103C6.14946 23.1876 5.83152 23.0625 5.5 23.0625C5.16848 23.0625 4.85054 23.1876 4.61612 23.4103C4.3817 23.633 4.25 23.9351 4.25 24.25V24.3371C4.25 26.5015 4.25 28.2479 4.445 29.6207C4.645 31.0457 5.07833 32.2458 6.08 33.199C7.08333 34.1522 8.34667 34.5607 9.84667 34.7538C11.2917 34.9375 13.13 34.9375 15.4083 34.9375H25.5917C27.87 34.9375 29.7083 34.9375 31.1533 34.7538C32.6533 34.5607 33.9167 34.1522 34.92 33.199C35.9233 32.2458 36.3533 31.0457 36.5567 29.6207C36.75 28.2479 36.75 26.5015 36.75 24.3371V24.25C36.75 23.9351 36.6183 23.633 36.3839 23.4103C36.1495 23.1876 35.8315 23.0625 35.5 23.0625C35.1685 23.0625 34.8505 23.1876 34.6161 23.4103C34.3817 23.633 34.25 23.9351 34.25 24.25C34.25 26.5221 34.2467 28.107 34.0783 29.304C33.9133 30.4662 33.6117 31.0805 33.1517 31.5191C32.69 31.9577 32.0433 32.2427 30.8183 32.3994C29.56 32.5593 27.8917 32.5625 25.5 32.5625H15.5C13.1083 32.5625 11.4383 32.5593 10.18 32.3994C8.95667 32.2427 8.31 31.9561 7.84833 31.5191C7.38667 31.0805 7.08667 30.4662 6.92167 29.3024C6.75333 28.107 6.75 26.5221 6.75 24.25Z"
                        fill="#ABBFC9"
                      />
                    </svg>

                    <Typography sx={{ marginTop: '24px' }}>
                      Drag and drop file here
                    </Typography>
                    <Typography sx={{ color: 'rgba(0, 0, 0, 0.40)' }}>
                      doc, docx, png, jpg, jpeg, pdf, xls, xlsx are allowed
                      format and file size not more than 10MB for single file
                    </Typography>
                    <input
                      type="file"
                      id="fileInput"
                      style={{ display: 'none' }}
                      // multiple
                      // accept=".doc, .png, .jpg, .jpeg, .pdf, .xls, .xlsx, .docx"
                      onChange={handleFileInputChange}
                    />

                    <Button
                      variant="outlined"
                      sx={{ marginTop: '24px' }}
                      onClick={() =>
                        document.getElementById('fileInput').click()
                      }
                    >
                      {' '}
                      Choose a File
                    </Button>
                  </div>
                  {errors.documents && (
                    <ErrorTypography>
                      {errors.documents.message}
                    </ErrorTypography>
                  )}
                </Grid>
                <Grid item xs={12} md={12}>
                  {console.log('>>>>>>>', selectedFiles)}
                  {selectedFiles.map((file, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      marginBottom="16px"
                    >
                      <img
                        src={iconList[file.split('.').pop()]}
                        alt="extension"
                        style={{ marginRight: '10px' }}
                      />
                      <Typography>
                        {StringSlice(file.split('.')[0], 15)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={fileUploadProgress[file.name] || 0}
                        style={{ flex: 1, marginLeft: '16px' }}
                      />
                      <IconButton onClick={() => handleRemoveFile(index)}>
                        <Clear />
                      </IconButton>
                    </Box>
                  ))}
                </Grid>
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

export default BranchUpdate;
