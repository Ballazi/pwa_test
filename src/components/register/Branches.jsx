import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Radio,
  Button,
  TextField,
  TableContainer,
  TableBody,
  TableCell,
  IconButton,
  TableHead,
  TableRow,
  Table,
  LinearProgress,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import InfoIcon from '@mui/icons-material/Info';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import pdficon from '../../../public/PDF_svg.svg';
import jpgicon from '../../../public/JPG_svg.svg';
import pngicon from '../../../public/PNG_svg.svg';
import docIcon from '../../assets/doc.svg';
import docxIcon from '../../assets/docx.svg';
import jpegIcon from '../../assets/jpeg.svg';
import xlsIcon from '../../assets/xls.svg';
import xlsxIcon from '../../assets/xlsx.svg';
import TitleContainer from '../card/TitleContainer';
import RegisterCard from '../card/RegisterCard';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ContentWrapper from '../form-warpper/ContentWrapper';
import FooterWrapper from '../form-warpper/FooterWrapper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Autocomplete as GoogleAutoComplete,
  useLoadScript,
} from '@react-google-maps/api';
import {
  nameValidator,
  emailValidator,
  contactPersonValidator,
  contactNumberValidator,
  nonRequiredValidator,
  cityValidator,
  pinCodeValidator,
  gstinValidator,
  countryValidator,
  stateValidator,
  requiredValidatorOfArrayNew,
  addressLine1ValidatorBranch,
  addressLine2ValidatorBranch,
  alphaNumeric
} from '../../validation/common-validator';
import Autocomplete from '@mui/material/Autocomplete';
import BranchUpdate from './popup/BranchUpdate';
import ErrorTypography from '../typography/ErrorTypography';
import { StringSlice } from '../../utility/utility-function';
import { Clear } from '@mui/icons-material';
import {
  createBranch,
  viewBranch,
  getRegion,
  deleteBranch,
} from '../../api/register/branch-details';
import { viewState, getAllStateByCountry } from '../../api/master-data/state';
import { viewCountry } from '../../api/master-data/country';
import BackdropComponent from '../backdrop/Backdrop';
import { openSnackbar } from '../../redux/slices/snackbar-slice';
import { useDispatch } from 'react-redux';
import { getBase64SingleFile } from '../../utility/utility-function';

const schema = yup.object().shape({
  branchName: alphaNumeric("Branch name"),
  email: emailValidator,
  contactPerson: contactPersonValidator,
  contactNumber: contactNumberValidator,
  // gstin: gstValidator,
  gstin: gstinValidator('Gstin'),
  cluster: nonRequiredValidator('Cluster/Region'),
  branchAddressLine1: addressLine1ValidatorBranch,
  branchAddressLine2: addressLine2ValidatorBranch,
  branchCity: cityValidator,
  branchPinCode: pinCodeValidator,
  branchCountry: countryValidator,
  branchState: stateValidator,
  documents: requiredValidatorOfArrayNew('Atleast one document'),
});

export default function Branches({
  // value,
  currentStep,
  stepsContent,
  handleNext,
  handlePrevious,
}) {
  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    control,
    trigger,
    reset,
    // getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      documents: [],
    },
  });

  const [selectedBranchOption, setSelectedBranchOption] = useState('');
  const [isAddingBranch, setIsAddingBranch] = useState(true);
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [showTable, setShowTable] = useState(false);
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
  const KamColumns = [
    'Sl no.',
    'Branch Name',
    'Region/Cluster',
    'State',
    'options',
  ];
  const [kamRows, setKamRows] = useState([]);
  const [clusterStates, setClusterStates] = useState([]);
  const [countryStates, setCountryStates] = useState([]);
  const [states, setStates] = useState([]);
  const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const [rowObject, setRowObject] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateIndex, setUpdateIndex] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [allStates, setAllStates] = useState([]);
  const [isDocumentChange, setIsDocumentChange] = useState(false);
  const shipperName = localStorage.getItem('shipper_name');
  const myDivRef = useRef(null);
  const dispatch = useDispatch();
  const branchFullAdress = useRef();
  const gogapi = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
  const libs = ['places', 'drawing'];
  const { isLoaded, loadError, loadSuccess } = useLoadScript({
    googleMapsApiKey: gogapi,
    libraries: libs,
  });

  const fetchRegionData = () => {
    setIsLoading(true);
    const payload = {
      shipper_id: localStorage.getItem('shipper_id'),
      isRegion: true,
    };
    return getRegion(payload)
      .then((res) => {
        if (res.data.success === true) {
          const updatedCountry = res.data.data.map((item) => {
            return {
              label: item.is_region ? item.region_name : item.cluster_name,
              value: item.msrc_region_cluster_id,
              is_region: item.is_region,
            };
          });
          setClusterStates(updatedCountry);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
          setClusterStates([]);
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
          trigger('branchAddressLine1');
          trigger('branchAddressLine2');
          trigger('branchPinCode');
          trigger('branchCity');

          countryStates.map((item) => {
            if (item.label === branchDetailAddress.country) {
              fetchStateData(item.value);
              setValue('branchCountry', item.value);
              trigger('branchCountry');
            }
          });

          states.map((item) => {
            console.log('StateName', item.label);
            if (item.label === branchDetailAddress.state) {
              console.log('in state', item.label);
              setValue('branchState', item.value);
              trigger('branchState');
            }
          });

          console.log('parsed  Adddr', branchDetailAddress, states);
        });
      });
  }

  const fetchCuntryData = () => {
    setIsLoading(true);
    return viewCountry()
      .then((data) => {
        if (data.success === true) {
          const updatedCountry = data.data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setCountryStates(updatedCountry);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          );
          setCountryStates([]);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchAllStateData = () => {
    setIsLoading(true);
    return viewState()
      .then((data) => {
        if (data.success === true) {
          const updatedState = data.data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setAllStates(updatedState);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: data.clientMessage })
          );
          setStates([]);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchStateData = (id) => {
    setIsLoading(true);
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchBranchData = () => {
    setIsLoading(true);
    const payload = { shipper_id: localStorage.getItem('shipper_id') };
    return viewBranch(payload)
      .then((res) => {
        if (res.data.success === true) {
          if (res.data.data.length === 0) {
            setSelectedBranchOption("Don't Have Branch");
          } else {
            setSelectedBranchOption('I Have Branch');
          }
          const payload = res.data.data.map((ele) => ({
            branch_id: ele.branch_id,
            branchName: ele.name,
            email: ele.email,
            contactPerson: ele.contact_person,
            contactNumber: ele.contact_no,
            gstin: ele.gstin,
            cluster: ele.branch_region_cluster_id
              ? ele.branch_region_cluster_id
              : null,
            branchAddressLine1: ele.address.split('||')[0],
            branchAddressLine2: ele.address.split('||')[1],
            branchCity: ele.city,
            branchPinCode: ele.postal_code,
            branchCountry: ele.country,
            branchState: ele.state,
            documents: ele.doc_path,
            branchFullAdress: ele.google_address,
          }));
          setKamRows(payload);
          setShowTable(true);
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
          setKamRows([]);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchRegionData();
      await fetchCuntryData();
      await fetchAllStateData();
      fetchBranchData();
    };

    fetchData();
  }, []);

  const updateRow = (data, index) => {
    setUpdateIndex(index);
    setRowObject(data);
    setIsCreatingBranch(false);
    setOpenUpdateModel(true);
  };

  const handleClose = (flag) => {
    if (flag) {
      setOpenUpdateModel(false);
      fetchBranchData();
    } else {
      setOpenUpdateModel(false);
    }
  };

  const deleteRow = (data, index) => {
    setUpdateIndex(index);
    if (data.branch_id !== null) {
      setDeleteId(data.branch_id);
    }
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteId === '') {
      kamRows.splice(updateIndex, 1);
      setUpdateIndex('');
      closeDeleteDialog();
    } else {
      setIsLoading(true);
      return deleteBranch(deleteId)
        .then((res) => {
          if (res.data.success === true) {
            dispatch(
              openSnackbar({ type: 'success', message: res.data.clientMessage })
            );
            closeDeleteDialog();
            setDeleteId('');
            setUpdateIndex('');
            fetchBranchData();
          } else {
            dispatch(
              openSnackbar({ type: 'error', message: res.data.clientMessage })
            );
            setClusterStates([]);
          }
        })
        .catch((error) => {
          console.error('Error', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  // Handle branch option selection
  const handleBranchOptionSelect = (option) => {
    setSelectedBranchOption(option);
    if (option === 'I Have Branch') {
      setIsAddingBranch(true);
    } else {
      setIsAddingBranch(false);
      setIsCreatingBranch(false); // Reset the new branch creation state
    }
  };

  useEffect(() => {
    //for smooth scroll
    if (isCreatingBranch === true && myDivRef.current) {
      console.log('clicked');
      myDivRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isCreatingBranch]);

  // Load stored branch option o
  const handleCreateBranch = () => {
    setIsCreatingBranch(true);
    // scrollToMyDiv();
  };

  const handleSaveButtonClick = async (form_data) => {
    setIsLoading(true);
    let uploadDocs;
    if (typeof form_data.documents[0] !== 'undefined') {
      uploadDocs = await getBase64SingleFile(form_data.documents[0]);
    }
    const payload = [
      {
        branch_id: null,
        name: form_data.branchName,
        branch_shipper_id: localStorage.getItem('shipper_id'),
        branch_region_cluster_id: form_data.cluster ? form_data.cluster : null,
        gstin: form_data.gstin,
        contact_person: form_data.contactPerson,
        contact_no: form_data.contactNumber,
        email: form_data.email,
        google_address: branchFullAdress.current.value,
        address:
          form_data.branchAddressLine1 + '||' + form_data.branchAddressLine2,
        city: form_data.branchCity,
        state: form_data.branchState,
        country: form_data.branchCountry,
        postal_code: form_data.branchPinCode,
        support_doc: uploadDocs,
        // "doc_path": ele.documents,
      },
    ];
    createBranch(payload)
      .then((res) => {
        if (res.data.success === true) {
          dispatch(
            openSnackbar({ type: 'success', message: res.data.clientMessage })
          );
          setDocuments([]);
          setSelectedFiles([]);
          const formData = new FormData();
          const docArray = form_data.documents;
          docArray.forEach((file, index) => {
            formData.append(`file[${index}]`, file);
          });
          setIsCreatingBranch(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          handleCloseBranch();
          fetchBranchData();
        } else {
          dispatch(
            openSnackbar({ type: 'error', message: res.data.clientMessage })
          );
        }
      })
      .catch((error) => {
        console.error('error', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCloseBranch = () => {
    setIsCreatingBranch(false);
    setDocuments([]);
    setSelectedFiles([]);
    reset();
  };

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

    // Reset the value of the file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = '';
    }

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

  const nextHandler = () => {
    if (selectedBranchOption === '') {
      dispatch(
        openSnackbar({ type: 'error', message: 'Please select an option' })
      );
    } else if (selectedBranchOption === 'I Have Branch') {
      if (kamRows.length === 0) {
        dispatch(
          openSnackbar({ type: 'error', message: 'Please create branch' })
        );
      } else {
        // finalSaveButtonClick();
        handleNext();
      }
    } else {
      // finalSaveButtonClick();
      handleNext();
    }
  };

  const clusterName = (id) => {
    const clusterLabel =
      clusterStates.length !== 0 &&
      clusterStates.filter((ele) => ele.value === id);
    return clusterLabel.length ? clusterLabel[0].label : '-';
  };

  const stateName = (id) => {
    const stateLabel =
      allStates.length !== 0 && allStates.filter((ele) => ele.value === id);
    return stateLabel.length ? stateLabel[0].label : 'undefined';
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };
  return (
    <>
      {openUpdateModel ? (
        <BranchUpdate
          rowObject={rowObject}
          handleClose={handleClose}
          editClusterStates={clusterStates}
          editCountryStates={countryStates}
        />
      ) : null}
      <BackdropComponent loading={loading} />

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <div className="customCardheader">
          <Typography variant="h4"> Delete Material</Typography>
        </div>
        <DialogContent>
          <Typography>Are you sure you want to delete?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} variant="contained" color="error">
            No
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <ContentWrapper>
        {/* Radio button options */}
        <TitleContainer>
          <Typography variant="h3">Branches</Typography>
          <Typography
            sx={{
              fontWeight: 400,
              marginTop: '8px',
              color: '#8A919D',
            }}
            variant="body1"
            mb={1}
          >
            Fill out / Update branch details
          </Typography>
          {shipperName && (
            <Typography
              variant="h3"
              sx={{ color: '#122B47', fontSize: '12px', fontWeight: 500 }}
            >
              <Typography
                variant="span"
                sx={{ color: '#122B47', fontSize: '12px', fontWeight: 700 }}
              >
                Shipper Name:
              </Typography>
              {'  '}
              {shipperName}
            </Typography>
          )}
        </TitleContainer>
        <RegisterCard title="Select an option">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <div
                className={`radio-option ${
                  selectedBranchOption === 'I Have Branch' ? 'selected' : ''
                }`}
                onClick={() => handleBranchOptionSelect('I Have Branch')}
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={selectedBranchOption === 'I Have Branch'}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h6">Have Branch</Typography>
                </div>
                <div className="radioIcon2">
                  <Tooltip title="Lorium">
                    <InfoIcon />
                  </Tooltip>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div
                className={`radio-option ${
                  selectedBranchOption === "Don't Have Branch" ? 'selected' : ''
                }`}
                onClick={() => handleBranchOptionSelect("Don't Have Branch")}
                style={
                  kamRows.length != 0
                    ? { pointerEvents: 'none', cursor: 'not-allowed' }
                    : {}
                }
              >
                <div className="radioIcon">
                  <Radio
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                    checked={selectedBranchOption === "Don't Have Branch"}
                  />
                </div>
                <div className="radiotext">
                  <Typography variant="h6">{`Don't Have Branch`}</Typography>
                </div>
                <div className="radioIcon2">
                  <Tooltip title="Lorium">
                    <InfoIcon />
                  </Tooltip>
                </div>
              </div>
            </Grid>
          </Grid>
        </RegisterCard>

        {kamRows.length === 0 ? null : (
          <RegisterCard>
            <Grid item md={12} style={{ marginBottom: '20px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item xs={12} sm={5} md={4}>
                      <Typography variant="h4">Branch List</Typography>
                    </Grid>
                    <Grid item>
                      <Grid container>
                        <Grid item>
                          <Grid
                            container
                            justifyContent="flex-start"
                            alignItems="center"
                          >
                            <Box
                              component="span"
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                bgcolor: '#065AD81A',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                marginRight: '5px',
                                justifyContent: 'center',
                                fontSize: '14px',
                              }}
                            >
                              {kamRows.length}
                            </Box>
                            <Typography>Branches Added</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <TableContainer
                  //  component={Paper}
                  >
                    <Table>
                      <TableHead sx={{ bgcolor: '#065AD81A' }}>
                        <TableRow>
                          {KamColumns.map((column) => (
                            <TableCell key={column}>{column}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {kamRows.length === 0
                          ? 'No data to show'
                          : kamRows.map((row, rowIndex) => (
                              <TableRow key={row}>
                                <TableCell>
                                  <Typography>{rowIndex + 1}</Typography>
                                </TableCell>

                                <TableCell>
                                  <Typography>{row.branchName}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {clusterName(row.cluster)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {stateName(row.branchState)}
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <IconButton
                                    onClick={() => updateRow(row, rowIndex)}
                                  >
                                    <BorderColorIcon
                                      fontSize="small"
                                      color="primary"
                                    />
                                  </IconButton>

                                  <IconButton
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => deleteRow(row, rowIndex)}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
          </RegisterCard>
        )}

        {/* Add Branch Card */}

        {selectedBranchOption === 'I Have Branch' &&
        isAddingBranch &&
        !isCreatingBranch ? (
          <RegisterCard>
            <Box sx={{ display: 'flex' }}>
              <Typography style={{ marginBottom: '20px' }} variant="h4">
                Create Branches
              </Typography>

              {/* Add other text fields for contact person, contact number, GST */}
              <Button
                variant="contained"
                color="primary"
                sx={{ marginLeft: 'auto' }}
                onClick={handleCreateBranch}
                disabled={isCreatingBranch}
              >
                Start adding branch
              </Button>
            </Box>
          </RegisterCard>
        ) : null}

        {/* New Branch Created Card */}
        {isCreatingBranch ? (
          <Box id="myDiv" ref={myDivRef}>
            <form
              onSubmit={handleSubmit(handleSaveButtonClick)}
              onKeyPress={handleKeyPress}
            >
              <RegisterCard>
                <Box>
                  <Typography style={{ marginBottom: '20px' }} variant="h4">
                    Branch Details
                  </Typography>
                  {/* Display branch creation success message or any other content */}
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
                          // required={true}
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
                          // required={true}
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
                      <GoogleAutoComplete
                        onPlaceChanged={() => handleBranchAddressChnage()}
                        restrictions={{ country: 'ind' }}
                      >
                        <TextField
                          label="Full Address*"
                          size="small"
                          variant="filled"
                          fullWidth
                          inputRef={branchFullAdress}
                          // error={Boolean(errors.branchAddressLine1)}
                          // helperText={errors.branchAddressLine1?.message}
                        />
                      </GoogleAutoComplete>
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
                          options={states}
                          getOptionLabel={(option) => option.label || ''}
                          value={
                            states.find(
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
                            doc, docx, png, jpg, jpeg, pdf, xls, xlsx are
                            allowed format and file size not more than 10MB for
                            single file
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

                  <Grid item md={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button
                        variant="filled"
                        size="small"
                        color="secondary"
                        onClick={handleCloseBranch}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        type="submit"
                        // onClick={() => {
                        //   handleSaveButtonClick();
                        //   handleCloseBranch();
                        // }}
                        sx={{ marginLeft: 2 }}
                      >
                        Save
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </RegisterCard>
            </form>
          </Box>
        ) : null}
      </ContentWrapper>
      <FooterWrapper>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        {currentStep !== stepsContent.length - 1 ? (
          <Button
            variant="contained"
            // type="submit"
            onClick={() => nextHandler()}
            disabled={
              currentStep === stepsContent.length - 1 || isCreatingBranch
            }
          >
            Continue
          </Button>
        ) : (
          <Button variant="contained">Submit</Button>
        )}
      </FooterWrapper>
    </>
  );
}
