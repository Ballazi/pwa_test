import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Grid,
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Typography,
  Button,
  IconButton,
  LinearProgress,
} from '@mui/material';
import RegisterCard from '../../../../components/card/RegisterCard';
import { useForm, Controller } from 'react-hook-form';
import { FileUploader } from '../../../../components/register/TransporterComponent/fileUplodeComponent';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorTypography from '../../../../components/typography/ErrorTypography';
// import AddVehicleList from '../../AddVehicleList';
import * as yup from 'yup';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DownloadIcon from '@mui/icons-material/Download';
import {
  nameValidator,
  emailValidator,
  contactNumberValidator,
  panNumberValidator,
  tanValidator,
  gstValidator,
  nonRequiredValidator,
  addressLine1Validator,
  addressLine2Validator,
  cityValidator,
  pinCodeValidator,
  countryValidator,
  stateValidator,
  fieldWithNoValidationLogo,
  requiredValidatorOfArrayNew,
  conditionalIbaNumberValidator,
  rocNumberValidator,
} from '../../../../validation/common-validator';
import { viewAllCountry } from '../../../../api/master-data/country';
import { getAllStateByCountry } from '../../../../api/master-data/state';
import pdficon from '../../../../../public/PDF_svg.svg';
import jpgicon from '../../../../../public/JPG_svg.svg';
import pngicon from '../../../../../public/PNG_svg.svg';
import { StringSlice } from '../../../../utility/utility-function';
import { Clear } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import {
  getBase64SingleFile,
  getBase64MultipleArray,
} from '../../../../utility/utility-function';
import { openSnackbar } from '../../../../redux/slices/snackbar-slice';
import { useDispatch } from 'react-redux';
import {
  addNewShipper,
  getPublicTransporter,
  fetchMasterFleets,
} from '../../../../api/register/transporter';
import { updateTransporterDetails } from '../../../../api/public-transporter/public-transporter';
import ShipperList from './ShipperList';
import FleetTable from '../fleet-details/FleetTable';
import BackdropComponent from '../../../../components/backdrop/Backdrop';
import docIcon from '../../../../assets/doc.svg';
import docxIcon from '../../../../assets/docx.svg';
import jpegIcon from '../../../../assets/jpeg.svg';
import xlsIcon from '../../../../assets/xls.svg';
import xlsxIcon from '../../../../assets/xlsx.svg';
import svgIcon from '../../../../assets/svgIcon.svg';

const iconList = {
  jpg: jpgicon,
  pdf: pdficon,
  png: pngicon,
  doc: docIcon,
  docx: docxIcon,
  jpeg: jpegIcon,
  xls: xlsIcon,
  xlsx: xlsxIcon,
  svg: svgIcon,
};
let fileUploadProgress = {};
const baseUrl = import.meta.env.VITE_TMS_APP_API_URL;

export default function TransporterDetails({ handleNext }) {
  const [newFleets, setNewFleets] = useState([]);
  const [countries, setCountries] = useState([]);
  const [gstUpload, setGstUpload] = useState(null);
  const [cacUpload, setCacUpload] = useState(null);
  const [ibaUpload, setIbaUpload] = useState(null);
  const [allStatesForCorporate, setAllStatesForCorporate] = useState([]);
  const [enableAllStatesForCorporate, setEnableAllStateForCorporate] =
    useState(true);
  const [allStatesForBilling, setAllStatesForBilling] = useState([]);
  const [enableAllStatesForBilling, setEnableAllStateForBilling] =
    useState(true);
  const [checked, setChecked] = useState(false);
  const [logoFile, setLogoFile] = useState('');
  const [companyLogo, setCompanyLogo] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  // const [isLogoChange, setIsLogoChange] = useState(false);
  const [isGstUpdated, setIsGstUpdated] = useState(false);
  const [isCacUpdated, setIsCacUpdated] = useState(false);
  const [isIbaUpdated, setIsIbaUpdated] = useState(false);
  const [isFilesUpdated, setIsFilesUpdated] = useState(false);
  const [isLogoUpdated, setIsLogoUpdated] = useState(false);
  const [shipperList, setShipperList] = useState([]);
  const [hasGst, setHasGst] = useState(null);
  const [hasCac, setHasCac] = useState(null);
  const [hasIbaFile, setHasIbaFile] = useState(null);
  // const [isDocumentChange, setIsDocumentChange] = useState(false);
  const [docPath, setDocPath] = useState('mandate');
  const [gstLabel, setGstLabel] = useState('GSTIN Upload*');
  const [carrageActCertificateLabel, setCarriageActCertificateLabel] = useState(
    'Carriage act certificate upload'
  );
  const [ibaFileLabel, setIbaFileLabel] = useState('IBA file upload');
  const [masterFleets, setMasterFleets] = useState([]);
  const [masterFleetsCopy, setMasterFleetsCopy] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const transp_id = localStorage.getItem('transp_id');
  const schemaBuilder = (docPath) => {
    const baseSchema = yup.object().shape({
      name: nameValidator,
      email: emailValidator,
      contact_person: nameValidator,
      contact_no: contactNumberValidator,
      pan: panNumberValidator,
      tan: tanValidator,
      gstin: gstValidator,
      roc_number: rocNumberValidator,
      iba_approved: yup.boolean().nullable(),
      carriage_act_cert: nonRequiredValidator('Carriage act certificate'),
      bank_guarantee_date: yup.date().notRequired(),
      corporateAddressLine1: addressLine1Validator,
      corporateAddressLine2: addressLine2Validator,
      corporate_city: cityValidator,
      corporate_postal_code: pinCodeValidator,
      corporate_country: countryValidator,
      corporate_state: stateValidator,
      billingAddressLine1: addressLine1Validator,
      billingAddressLine2: addressLine2Validator,
      billing_city: cityValidator,
      billing_postal_code: pinCodeValidator,
      billing_country: countryValidator,
      billing_state: stateValidator,
      logo: fieldWithNoValidationLogo,
      iba_number: yup.mixed().nullable(),
      carriage_act_cert_file: yup.mixed(),
      iba_file: yup.mixed(),
    });

    let conditionalSchema = baseSchema; // Initialize with the base schema

    if (docPath === 'mandate') {
      conditionalSchema = conditionalSchema.shape({
        documents: requiredValidatorOfArrayNew('Atleast one document'),
        gst_doc: yup.mixed().required('Gst file is required'),
      });
    }

    return conditionalSchema;
  };
  const schema = schemaBuilder(docPath);

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    clearErrors,
    setError,
    // setFocus,
    reset,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(schema),

    defaultValues: {
      roc_number: '',
      // iba_approved: true,
      carriage_act_cert: '',
      logo: null,
      documents: [],
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [masterFleetsResponse, countryResponse, transporterResponse] =
        await Promise.all([
          fetchMasterFleets(),
          viewAllCountry(),
          transp_id ? getPublicTransporter(transp_id) : Promise.resolve(null),
        ]);

      if (masterFleetsResponse.data.success) {
        const masterData = masterFleetsResponse.data.data.map((data) => ({
          label: data.name,
          value: data.id,
        }));

        setMasterFleets(masterData);
        setMasterFleetsCopy(masterData);
      }

      if (countryResponse.data.success === true) {
        const countries = countryResponse.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setCountries(countries);
      }

      if (transporterResponse) {
        // Handle transporter data here
        const corporate_address =
          transporterResponse.data.data.corporate_address;
        const billing_address = transporterResponse.data.data.billing_address;
        const parts = corporate_address.split('||');
        const parts2 = billing_address.split('||');
        handleCorporateStatePopulate(
          transporterResponse.data.data.corporate_country,
          'corporate'
        );
        handleCorporateStatePopulate(
          transporterResponse.data.data.billing_country,
          'billing'
        );
        setValue('name', transporterResponse.data.data.name);
        setValue('email', transporterResponse.data.data.email);
        setValue(
          'contact_person',
          transporterResponse.data.data.contact_person
        );
        setValue('contact_no', transporterResponse.data.data.contact_no);
        setValue('pan', transporterResponse.data.data.pan);
        setValue('tan', transporterResponse.data.data.tan);
        setValue('gstin', transporterResponse.data.data.gstin);
        setValue('roc_number', transporterResponse.data.data.roc_number);
        setValue('iba_number', transporterResponse.data.data.iba_number);
        setValue(
          'carriage_act_cert',
          transporterResponse.data.data.carriage_act_cert
        );
        setValue('iba_approved', transporterResponse.data.data.iba_approved);
        setValue('corporateAddressLine1', parts[0]);
        setValue('corporateAddressLine2', parts[1]);
        setValue(
          'corporate_city',
          transporterResponse.data.data.corporate_city
        );
        setValue(
          'corporate_postal_code',
          transporterResponse.data.data.corporate_postal_code
        );
        setValue(
          'corporate_country',
          transporterResponse.data.data.corporate_country
        );
        setValue(
          'corporate_state',
          transporterResponse.data.data.corporate_state
        );
        setValue('billingAddressLine1', parts2[0]);
        setValue('billingAddressLine2', parts2[1]);
        setValue('billing_city', transporterResponse.data.data.billing_city);
        setValue(
          'billing_postal_code',
          transporterResponse.data.data.billing_postal_code
        );
        setValue(
          'billing_country',
          transporterResponse.data.data.billing_country
        );
        setValue('billing_state', transporterResponse.data.data.billing_state);
        setCompanyLogo(transporterResponse.data.data.logo);
        if (parts[0] === parts2[0] && parts[1] === parts2[1]) {
          setChecked(true);
        }
        if (transporterResponse.data.data.gstin_file === null) {
          setGstLabel('GSTIN Upload');
          setHasGst(false);
        } else {
          setGstLabel(transporterResponse.data.data.gstin_file);
          setHasGst(true);
        }
        if (transporterResponse.data.data.iba_file === null) {
          setIbaFileLabel('IBA file upload');
          setHasIbaFile(false);
        } else {
          setIbaFileLabel(transporterResponse.data.data.iba_file);
          setHasIbaFile(true);
        }
        if (transporterResponse.data.data.carriage_act_cert_file === null) {
          setCarriageActCertificateLabel('Carriage act certificate upload');
          setHasCac(false);
        } else {
          setCarriageActCertificateLabel(
            transporterResponse.data.data.carriage_act_cert_file
          );
          setHasCac(true);
        }
        setDocPath(transporterResponse.data.data.doc_path);
        setShipperList(transporterResponse.data.data.shippers);
        const fleetData = transporterResponse.data.data.fleets.map(
          (item, index) => {
            return {
              create_id: uuidv4(),
              mtf_fleet_id: item.mtf_fleet_id,
              no_of_owned: item.no_of_owned,
              no_of_leased: item.no_of_leased,
              is_updated: false,
              is_exist: true,
              index: index,
            };
          }
        );
        setNewFleets(fleetData);

        const isSameAddress =
          parts[0] === parts2[0] &&
          parts[1] === parts2[1] &&
          transporterResponse.data.data.corporate_city ===
            transporterResponse.data.data.billing_city &&
          transporterResponse.data.data.corporate_postal_code ===
            transporterResponse.data.data.billing_postal_code &&
          transporterResponse.data.data.corporate_state ===
            transporterResponse.data.data.billing_state &&
          transporterResponse.data.data.corporate_country ===
            transporterResponse.data.data.billing_country;

        if (isSameAddress) {
          setChecked(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewFleets = (data) => {
    const insertNewData = {
      create_id: uuidv4(),
      mtf_fleet_id: '',
      no_of_owned: 0,
      no_of_leased: 0,
      is_updated: data.is_updated,
      index: newFleets.length,
    };

    setNewFleets((prevData) => {
      return [...prevData, insertNewData];
    });
  };

  const handleInsertFleet = (data) => {
    console.log('fleet', data);
    const myIndex = data.index;
    console.log('myIndex', myIndex);
    setNewFleets((prevFleets) => {
      const fleets = [...prevFleets]; // Create a shallow copy of the previous state array
      fleets[myIndex] = data;
      return fleets; // Return the updated state value
    });
  };

  const handleCorporateStatePopulate = (id, type) => {
    console.log('id', id);
    getAllStateByCountry(id)
      .then((res) => {
        if (res.data.success === true) {
          const states = res.data.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
          if (type === 'corporate') {
            setAllStatesForCorporate(states);
            setEnableAllStateForCorporate(false);
          } else {
            setAllStatesForBilling(states);
            setEnableAllStateForBilling(false);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  function handleCheck(e) {
    if (e.target.checked) {
      const billingAddLine1 = getValues('corporateAddressLine1');
      clearErrors('billingAddressLine1');
      clearErrors('billingAddressLine2');
      clearErrors('billing_city');
      clearErrors('billing_postal_code');
      clearErrors('billing_country');
      clearErrors('billing_state');
      setValue('billingAddressLine1', billingAddLine1);
      const billingAddLine2 = getValues('corporateAddressLine2');
      setValue('billingAddressLine2', billingAddLine2);
      const city = getValues('corporate_city');
      setValue('billing_city', city);
      const pinCode = getValues('corporate_postal_code');
      setValue('billing_postal_code', pinCode);
      const country = getValues('corporate_country');
      setValue('billing_country', country);
      const state = getValues('corporate_state');
      setValue('billing_state', state);
      handleCorporateStatePopulate(country, 'billing');
      setChecked(e.target.checked);
      // setEnableAllStateForBilling(false);
    } else {
      setValue('billingAddressLine1', '');
      setValue('billingAddressLine2', '');
      setValue('billing_city', '');
      setValue('billing_postal_code', '');
      setValue('billing_country', '');
      setValue('billing_state', '');
      setChecked(e.target.checked);
      // setEnableAllStateForBilling(false);
    }
  }

  const handleFileDropLogo = (event) => {
    clearErrors('logo');
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
    if (file) {
      // Check file type
      const allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/svg+xml',
      ];

      if (allowedTypes.includes(file.type) && file.size <= maxSize) {
        setLogoFile(file.name);
        setCompanyLogo(URL.createObjectURL(file));
        setValue('logo', file);
        // setIsLogoChange(true);
      } else {
        // Handle the case where the file type is not allowed or exceeds the 10 MB limit
        setLogoFile('');
        setValue('logo', undefined);
        let errorMessage = '';

        if (!allowedTypes.includes(file.type)) {
          errorMessage =
            'Invalid file type. Please select a jpg, jpeg, png and svg file.';
        } else if (file.size > maxSize) {
          errorMessage =
            'File size exceeds the limit. Please select a file not exceeding 10 MB in size.';
        }

        setError('logo', {
          message: errorMessage,
        });
        setCompanyLogo(null);
      }
    }
  };

  const handleFileLogoChange = (event) => {
    if (transp_id) {
      setIsLogoUpdated(true);
    }

    clearErrors('logo');
    const file = event.target.files[0];
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
    const allowedFormats = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/svg+xml',
    ];

    if (file && file.size <= maxSize && allowedFormats.includes(file.type)) {
      setLogoFile(file.name);
      setCompanyLogo(URL.createObjectURL(event.target.files[0]));
      setValue('logo', event.target.files[0]);
      console.log(companyLogo, typeof companyLogo);
    } else {
      // Handle the case where the file exceeds the 10 MB limit or has an invalid format
      setLogoFile('');

      if (!file) {
        setError('logo', {
          message: 'Please select a file',
        });
      } else if (file.size > maxSize) {
        setError('logo', {
          message: 'File size exceeds the limit of 10 MB',
        });
      } else if (!allowedFormats.includes(file.type)) {
        setError('logo', {
          message:
            'Invalid file format. Please select a jpg, jpeg, png, or svg file.',
        });
      }

      setValue('logo', undefined);
      setCompanyLogo(null);
    }
  };

  const handleFileDrop = (event) => {
    console.log(event);
    if (transp_id) {
      setIsFilesUpdated(true);
    }
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
    // }
  };

  const handleSingleIBAFile = (val) => {
    const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB
    const allowedFileTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];
    if (val.size > maxSizeInBytes) {
      // File size exceeds 10 MB, handle the error
      setError('iba_file', {
        message: 'IBA file size larger than 10 MB! Please reduce size',
      });
      return;
    }

    if (!allowedFileTypes.includes(val.type)) {
      // File type is not allowed, handle the error
      setError('iba_file', {
        message: 'Invalid file type, jpg, jpeg, png and pdf are allowed.',
      });
      return;
    }
    if (transp_id) {
      setIsIbaUpdated(true);
    }
    clearErrors('iba_file');
    setValue('iba_file', val);
    console.log('file name', val);
    setIbaUpload(val);
    setIbaFileLabel(val?.name);
  };

  const handleSingleFile = (val) => {
    const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB
    const allowedFileTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];
    if (val.size > maxSizeInBytes) {
      // File size exceeds 10 MB, handle the error
      setError('gst_doc', {
        message: 'GSTIN file size larger than 10 MB! Please reduce size',
      });
      return;
    }

    if (!allowedFileTypes.includes(val.type)) {
      // File type is not allowed, handle the error
      setError('gst_doc', {
        message: 'Invalid file type, jpg, jpeg, png and pdf are allowed.',
      });
      return;
    }
    if (transp_id) {
      setIsGstUpdated(true);
    }
    clearErrors('gst_doc');
    setValue('gst_doc', val);
    console.log('file name', val);
    setGstUpload(val);
    setGstLabel(val?.name);
  };

  const handleSingleCarriageActFile = (val) => {
    const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB
    const allowedFileTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];
    if (val.size > maxSizeInBytes) {
      // File size exceeds 10 MB, handle the error
      setError('carriage_act_cert_file', {
        message:
          'Carriage act certificate file size larger than 10 MB! Please reduce size',
      });
      return;
    }

    if (!allowedFileTypes.includes(val.type)) {
      // File type is not allowed, handle the error
      setError('carriage_act_cert_file', {
        message: 'Invalid file type, jpg, jpeg, png and pdf are allowed.',
      });
      return;
    }
    if (transp_id) {
      setIsCacUpdated(true);
    }
    clearErrors('carriage_act_cert_file');
    setValue('carriage_act_cert_file', val);
    console.log('file name', val);
    setCacUpload(val);
    setCarriageActCertificateLabel(val?.name);
  };

  function handleRemoveLogo() {
    const fileInput = document.getElementById('fileInput1');
    if (fileInput) {
      fileInput.value = '';
    }
    setError('logo', undefined);
    setLogoFile('');
    setCompanyLogo(null);
    setValue('logo', null);
  }

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
    if (transp_id) {
      setIsFilesUpdated(true);
    }
    if (!event.target.files.length) {
      // console.log('errorrrrr');
      // Reset the value and clear any previous errors
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
    const newfiles = [...documents, ...validFiles];
    console.log('newfiles', documents, validFiles);
    setDocuments(newfiles);
    setValue('documents', newfiles);
    setSelectedFiles(() => [
      // ...(prev || []),
      ...newfiles.map((file) => file.name),
    ]);
  };

  function onSubmit(data) {
    // console.log('data check ho', data);
    console.log('data check ho', newFleets);
    const modifiedData = newFleets.map((item) => {
      const { create_id, index, ...data } = item;
      return data;
    });
    console.log('data check', modifiedData);
    console.log('hit me', data);

    const {
      corporateAddressLine1,
      corporateAddressLine2,
      billingAddressLine1,
      billingAddressLine2,
      ...refinedData
    } = data;

    handleNewEntry(refinedData, data, modifiedData);
  }

  const handleNewEntry = async (refinedData, data, modifiedData) => {
    let uploadFile;
    let cacUploadFile;
    let ibaUploadFile;
    console.log('gstUpload', gstUpload);
    if (gstUpload) {
      console.log('check');
      uploadFile = await makeBase64(gstUpload);
    }
    if (cacUpload) {
      cacUploadFile = await makeBase64(cacUpload);
    }
    if (ibaUpload) {
      ibaUploadFile = await makeBase64(ibaUpload);
    }
    const docs = await getBase64MultipleArray(data.documents);
    console.log('uploadFile', uploadFile);
    console.log('file', refinedData.logo);
    let uploadLogo;
    if (refinedData.logo !== null && typeof refinedData.logo !== 'undefined') {
      console.log('check 2');
      uploadLogo = await getBase64SingleFile(data.logo);
    }

    // const logoFile = await makeBase64(refinedData.logo[0]);
    console.log('logo', logoFile);
    const { logo, ...finalData } = refinedData;

    const payload = {
      ...finalData,
      corporate_address:
        data.corporateAddressLine1 + '||' + data.corporateAddressLine2,
      billing_address:
        data.billingAddressLine1 + '||' + data.billingAddressLine2,
      fleets: modifiedData,
      gstin_file: uploadFile,
      carriage_act_cert_file: cacUploadFile,
      iba_file: ibaUploadFile,
      logo: uploadLogo,
      support_docs: docs,
    };

    const isMtfFleetIdNotPresent = newFleets.some(
      (obj) => !obj.hasOwnProperty('mtf_fleet_id')
    );

    const hasDuplicate = hasDuplicateFleetId(newFleets);

    console.log('payload', payload);

    if (isMtfFleetIdNotPresent) {
      dispatch(
        openSnackbar({
          type: 'error',
          message: 'Please save every fleet details before proceed!',
        })
      );
    } else if (hasDuplicate) {
      dispatch(
        openSnackbar({
          type: 'error',
          message: 'Duplicate fleet entry found! Please delete existing one!',
        })
      );
    } else if (transp_id) {
      const payload2 = {
        ...payload,
        is_logo_updated: isLogoUpdated,
        is_file_updated: docs.length === 0 ? false : isFilesUpdated,
        is_gstin_updated: isGstUpdated,
        is_carriage_act_file_updated: isCacUpdated,
        is_iba_file_updated: isIbaUpdated,
      };
      updateTransporterDetails(transp_id, payload2)
        .then((res) => {
          if (res.data.success) {
            console.log(res);
            dispatch(
              openSnackbar({
                type: 'success',
                message: 'Transporter details updated successfully',
              })
            );
            handleNext();
          } else {
            dispatch(
              openSnackbar({
                type: 'error',
                message: res.data.clientMessage,
              })
            );
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            openSnackbar({
              type: 'error',
              message: 'Something went wrong! Please try again later',
            })
          );
        });
    } else {
      addNewShipper(payload)
        .then((res) => {
          if (res.data.success) {
            console.log('resssss', res.data.data.trnsp_id);
            localStorage.setItem('transp_id', res.data.data.trnsp_id);
            reset();
            setNewFleets([]);
            dispatch(
              openSnackbar({
                type: 'success',
                message: res.data.clientMessage,
              })
            );
            handleNext();
          } else {
            dispatch(
              openSnackbar({
                type: 'error',
                message: res.data.clientMessage,
              })
            );
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            openSnackbar({
              type: 'error',
              message: 'Something went wrong! Please try again later',
            })
          );
        });
    }
  };

  const makeBase64 = async (file) => {
    if (typeof file !== 'undefined' || file !== null) {
      return await getBase64SingleFile(file);
    }
  };

  const addNewFleet = () => {
    console.log('new Fleets', ...newFleets);

    setNewFleets((prevState) => [
      ...prevState,
      {
        create_id: uuidv4(),
        // mtf_fleet_id: masterFleets[0].value,
        no_of_owned: '0',
        no_of_leased: '0',
        is_updated: false,
        // is_exist: false,
        index: newFleets.length,
      },
    ]);
  };

  const handleDeleteFleet = (fleet) => {
    const myIndex = fleet.index;
    setNewFleets((prevFleets) => {
      const fleets = [...prevFleets]; // Create a shallow copy of the previous state array
      const filteredFleets = fleets.filter((item) => item.index !== myIndex);
      return filteredFleets; // Return the updated state value
    });
  };

  function hasDuplicateFleetId(array) {
    const fleetIdSet = new Set();
    for (const obj of array) {
      if (fleetIdSet.has(obj.mtf_fleet_id)) {
        return true;
      } else {
        fleetIdSet.add(obj.mtf_fleet_id);
      }
    }
    return false;
  }

  const checkAddressIsSameOrNot = () => {
    console.log('hi');
    const corporateAddressLine1 = getValues('corporateAddressLine1');
    const billingAddressLine1 = getValues('billingAddressLine1');
    const corporateAddressLine2 = getValues('corporateAddressLine2');
    const billingAddressLine2 = getValues('billingAddressLine2');
    const corporate_city = getValues('corporate_city');
    const billing_city = getValues('billing_city');
    const corporate_postal_code = getValues('corporate_postal_code');
    const billing_postal_code = getValues('billing_postal_code');
    const corporate_country = getValues('corporate_country');
    const billing_country = getValues('billing_country');
    const corporate_state = getValues('corporate_state');
    const billing_state = getValues('billing_state');
    const isSameAddress =
      corporateAddressLine1 === billingAddressLine1 &&
      corporateAddressLine2 === billingAddressLine2 &&
      corporate_city === billing_city &&
      corporate_postal_code === billing_postal_code &&
      corporate_country === billing_country &&
      corporate_state === billing_state;
    if (isSameAddress) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  };

  return (
    <>
      <BackdropComponent loading={loading} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <RegisterCard title="Transporter details">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Transporter Name*"
                    error={Boolean(errors.name)}
                    size="small"
                    helperText={errors.name?.message}
                    inputRef={ref}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="Corporate contact email*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    //   disabled={props.isEdit}
                    error={Boolean(errors.email)}
                    size="small"
                    helperText={errors.email?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Controller
                name="contact_person"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="Corporate contact person*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    //   disabled={props.isEdit}
                    error={Boolean(errors.contact_person)}
                    size="small"
                    helperText={errors.contact_person?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Controller
                name="contact_no"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="Corporate contact number*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    //   disabled={props.isEdit}
                    error={Boolean(errors.contact_no)}
                    size="small"
                    helperText={errors.contact_no?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Controller
                name="pan"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="PAN*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    //   disabled={props.isEdit}
                    error={Boolean(errors.pan)}
                    size="small"
                    helperText={errors.pan?.message}
                    InputProps={{
                      onChange: (event) => {
                        const upperCaseValue = event.target.value.toUpperCase();
                        field.onChange(upperCaseValue);
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Controller
                name="tan"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="TAN*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    //   disabled={props.isEdit}
                    error={Boolean(errors.tan)}
                    size="small"
                    helperText={errors.tan?.message}
                    InputProps={{
                      onChange: (event) => {
                        const upperCaseValue = event.target.value.toUpperCase();
                        field.onChange(upperCaseValue);
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Controller
                name="gstin"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="GSTIN*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    //   disabled={props.isEdit}
                    error={Boolean(errors.gstin)}
                    size="small"
                    helperText={errors.gstin?.message}
                    InputProps={{
                      onChange: (event) => {
                        const upperCaseValue = event.target.value.toUpperCase();
                        field.onChange(upperCaseValue);
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Box
                sx={{
                  color: 'black',
                  background: '#eeeeee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTopLeftRadius: '5px',
                  borderTopRightRadius: '5px',
                  borderBottom: '1px solid black',
                }}
              >
                <Box>
                  <Box
                    display="block"
                    sx={
                      gstLabel === 'GSTIN Upload*'
                        ? {
                            padding: '12px',
                            color: 'grey',
                          }
                        : {
                            padding: '1px',
                            color: 'grey',
                          }
                    }
                  >
                    {gstLabel !== 'GSTIN Upload*' && (
                      <Typography
                        sx={{
                          fontSize: '12px',
                          marginBottom: '4px',
                          marginLeft: '10px',
                        }}
                      >
                        GSTIN Upload*
                      </Typography>
                    )}
                    <Typography
                      sx={
                        gstLabel !== 'GSTIN Upload*'
                          ? { fontSize: '16px', marginLeft: '10px' }
                          : { fontSize: '16px', marginLeft: '2px' }
                      }
                    >
                      {gstLabel}
                    </Typography>
                  </Box>
                  {/* <Box>
                    <label>{gstLabel}</label>
                  </Box> */}
                </Box>

                <FileUploader handleFile={handleSingleFile} />
              </Box>
              {errors.gst_doc && (
                <ErrorTypography>{errors.gst_doc.message}</ErrorTypography>
              )}
              {hasGst && (
                <a
                  href={`${baseUrl}/service/file/download/${transp_id}/gstin_file/${gstLabel}`}
                  style={{
                    fontSize: '9px',
                    color: 'blue',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Download GstIn
                </a>
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Controller
                name="roc_number"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="ROC Number"
                    variant="filled"
                    fullWidth
                    //   disabled={props.isEdit}
                    error={Boolean(errors.roc_number)}
                    size="small"
                    helperText={errors.roc_number?.message}
                    InputProps={{
                      onChange: (event) => {
                        const upperCaseValue = event.target.value.toUpperCase();
                        field.onChange(upperCaseValue);
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Controller
                name="carriage_act_cert"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Carriage act certificate"
                    variant="filled"
                    fullWidth
                    //   disabled={props.isEdit}
                    error={Boolean(errors.carriage_act_cert)}
                    size="small"
                    helperText={errors.carriage_act_cert?.message}
                  />
                )}
              />
            </Grid>

            {/* carriage act certificate upload */}
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Box
                sx={{
                  color: 'black',
                  background: '#eeeeee',
                  //   border: '1px solid black',
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTopLeftRadius: '5px',
                  borderTopRightRadius: '5px',
                  borderBottom: '1px solid black',
                }}
              >
                <Box>
                  <Box
                    display="block"
                    sx={
                      carrageActCertificateLabel ===
                      'Carriage act certificate upload'
                        ? {
                            padding: '12px',
                            color: 'grey',
                          }
                        : {
                            padding: '1px',
                            color: 'grey',
                          }
                    }
                  >
                    {carrageActCertificateLabel !==
                      'Carriage act certificate upload' && (
                      <Typography
                        sx={{
                          fontSize: '12px',
                          marginBottom: '4px',
                          marginLeft: '10px',
                        }}
                      >
                        Carriage act certificate upload
                      </Typography>
                    )}
                    <Typography
                      sx={
                        carrageActCertificateLabel !==
                        'Carriage act certificate upload'
                          ? { fontSize: '16px', marginLeft: '10px' }
                          : { fontSize: '16px', marginLeft: '2px' }
                      }
                    >
                      {carrageActCertificateLabel}
                    </Typography>
                  </Box>
                </Box>

                <FileUploader handleFile={handleSingleCarriageActFile} />
              </Box>

              {errors.carriage_act_cert_file && (
                <ErrorTypography>
                  {errors.carriage_act_cert_file.message}
                </ErrorTypography>
              )}
              {hasCac && (
                <a
                  href={`${baseUrl}/service/file/download/${transp_id}/carriage_act_cert_file/${carrageActCertificateLabel}`}
                  style={{
                    fontSize: '9px',
                    color: 'blue',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Download Carriage act certificate
                </a>
              )}
            </Grid>

            {/* ------------------------------- */}
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Controller
                name="iba_number"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="IBA number"
                    variant="filled"
                    fullWidth
                    //   disabled={props.isEdit}
                    error={Boolean(errors.iba_number)}
                    size="small"
                    helperText={errors.iba_number?.message}
                    InputProps={{
                      onChange: (event) => {
                        const trimmedValue = event.target.value.trim();
                        field.onChange(event.target.value);
                        if (trimmedValue !== '') {
                          setValue('iba_approved', true);
                        } else {
                          setValue('iba_approved', false);
                        }
                      },
                    }}
                  />
                )}
              />
            </Grid>
            {/* IBA certificate upload */}
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Box
                sx={{
                  color: 'black',
                  background: '#eeeeee',
                  //   border: '1px solid black',
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTopLeftRadius: '5px',
                  borderTopRightRadius: '5px',
                  borderBottom: '1px solid black',
                }}
              >
                <Box>
                  <Box
                    display="block"
                    sx={
                      ibaFileLabel === 'IBA file upload'
                        ? {
                            padding: '12px',
                            color: 'grey',
                          }
                        : {
                            padding: '1px',
                            color: 'grey',
                          }
                    }
                  >
                    {ibaFileLabel !== 'IBA file upload' && (
                      <Typography
                        sx={{
                          fontSize: '12px',
                          marginBottom: '4px',
                          marginLeft: '10px',
                        }}
                      >
                        IBA file upload
                      </Typography>
                    )}
                    <Typography
                      sx={
                        ibaFileLabel !== 'IBA file upload'
                          ? { fontSize: '16px', marginLeft: '10px' }
                          : { fontSize: '16px', marginLeft: '2px' }
                      }
                    >
                      {ibaFileLabel}
                    </Typography>
                  </Box>
                </Box>

                <FileUploader handleFile={handleSingleIBAFile} />
              </Box>

              {errors.iba_file && (
                <ErrorTypography>{errors.iba_file.message}</ErrorTypography>
              )}
              {hasIbaFile && (
                <a
                  href={`${baseUrl}/service/file/download/${transp_id}/iba_file/${ibaFileLabel}`}
                  style={{
                    fontSize: '9px',
                    color: 'blue',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Download IBA file
                </a>
              )}
            </Grid>
            {/* ------------------------------- */}
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Controller
                name="iba_approved"
                control={control}
                render={({ field }) => {
                  return (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={!!field.value}
                          //   disabled={props.isEdit}
                        />
                      }
                      sx={{ marginTop: '16px' }}
                      label="IBA approved"
                    />
                  );
                }}
              />
              {errors.iba_approved && (
                <ErrorTypography>{errors.iba_approved.message}</ErrorTypography>
              )}
            </Grid>
          </Grid>
        </RegisterCard>
        <RegisterCard title="Document upload*">
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <div
                style={{
                  textAlign: 'end',
                  position: 'relative',
                  bottom: '50px',
                }}
              >
                {docPath && (
                  <a
                    href={`${baseUrl}/service/file/download/all/${transp_id}/${docPath}`}
                  >
                    <DownloadIcon />
                    {/* {docPath} */}
                  </a>
                )}
              </div>
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
                  Drag and drop files here
                </Typography>
                <Typography sx={{ color: 'rgba(0, 0, 0, 0.40)' }}>
                  doc, docx, png, jpg, jpeg, pdf, xls, xlsx file size not more
                  than 10MB for single file
                </Typography>
                <input
                  type="file"
                  id="fileInput"
                  // name="documents"
                  style={{ display: 'none' }}
                  multiple
                  accept=".doc, .png, .jpg, .jpeg, .pdf, .xls, .xlsx, .docx"
                  // required
                  onChange={handleFileInputChange}
                />

                <Button
                  variant="outlined"
                  sx={{ marginTop: '24px' }}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  {' '}
                  Choose a File
                </Button>
              </div>
              {errors.documents && (
                <ErrorTypography>{errors.documents.message}</ErrorTypography>
              )}
            </Grid>
            {console.log('errors', errors)}
            <Grid item xs={12} md={12}>
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
                  <Typography>{StringSlice(file.split('.')[0], 15)}</Typography>
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
        </RegisterCard>
        <RegisterCard title="Vehicle details">
          <FleetTable
            handleNewFleets={handleNewFleets}
            handleDelete={handleDeleteFleet}
            newFleets={newFleets}
            saveFleetDetails={handleInsertFleet}
            masterFleets={masterFleets}
            addNewFleet={addNewFleet}
            masterFleetsCopy={masterFleetsCopy}
          />
        </RegisterCard>
        <RegisterCard title="Transporter address details">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="corporateAddressLine1"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    label="Address Line 1*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    //   disabled={props.isEdit}
                    size="small"
                    error={Boolean(errors.corporateAddressLine1)}
                    helperText={errors.corporateAddressLine1?.message}
                    onChange={(e) => {
                      setValue('corporateAddressLine1', e.target.value);
                      // setChecked(false);
                      checkAddressIsSameOrNot();
                      trigger('corporateAddressLine1');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="corporateAddressLine2"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address Line 2"
                    //   disabled={props.isEdit}
                    variant="filled"
                    fullWidth
                    size="small"
                    error={Boolean(errors.corporateAddressLine2)}
                    helperText={errors.corporateAddressLine2?.message}
                    onChange={(e) => {
                      setValue('corporateAddressLine2', e.target.value);
                      // setChecked(false);
                      checkAddressIsSameOrNot();
                      trigger('corporateAddressLine2');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="corporate_city"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    label="City*"
                    variant="filled"
                    inputRef={ref}
                    //   disabled={props.isEdit}
                    fullWidth
                    size="small"
                    error={Boolean(errors.corporate_city)}
                    helperText={errors.corporate_city?.message}
                    onChange={(e) => {
                      setValue('corporate_city', e.target.value);
                      // setChecked(false);
                      checkAddressIsSameOrNot();
                      trigger('corporate_city');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="corporate_postal_code"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    label="Pin Code*"
                    variant="filled"
                    inputRef={ref}
                    //   disabled={props.isEdit}
                    fullWidth
                    size="small"
                    error={Boolean(errors.corporate_postal_code)}
                    helperText={errors.corporate_postal_code?.message}
                    onChange={(e) => {
                      setValue('corporate_postal_code', e.target.value);
                      // setChecked(false);
                      checkAddressIsSameOrNot();
                      trigger('corporate_postal_code');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Box component="div">
                <Controller
                  name="corporate_country"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field: { ref, ...field } }) => (
                    <Autocomplete
                      {...field}
                      options={countries}
                      getOptionLabel={(option) => option.label || ''}
                      value={
                        countries.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.value : '');
                        handleCorporateStatePopulate(
                          newValue.value,
                          'corporate'
                        );
                        // setChecked(false);
                        checkAddressIsSameOrNot();
                        trigger('corporate_country');
                      }}
                      // disabled={props.isEdit}
                      popupIcon={<KeyboardArrowDownIcon />}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputRef={ref}
                          label="Country*"
                          variant="filled"
                          fullWidth
                          size="small"
                          error={!!errors.corporate_country}
                          helperText={errors.corporate_country?.message}
                        />
                      )}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="corporate_state"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <Autocomplete
                    {...field}
                    options={allStatesForCorporate}
                    disabled={enableAllStatesForCorporate}
                    getOptionLabel={(option) => option.label || ''}
                    value={
                      allStatesForCorporate.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      field.onChange(newValue ? newValue.value : '');
                      // setChecked(false);
                      checkAddressIsSameOrNot();
                      trigger('corporate_state');
                    }}
                    popupIcon={<KeyboardArrowDownIcon />}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="State*"
                        inputRef={ref}
                        variant="filled"
                        fullWidth
                        size="small"
                        error={!!errors.corporate_state}
                        helperText={errors.corporate_state?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box sx={{ my: 4 }}>
            <Typography variant="h4">Billing Address</Typography>

            <FormControlLabel
              label="Same as corporate address"
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleCheck}
                  // disabled={props.isEdit}
                />
              }
            />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="billingAddressLine1"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    label="Address Line 1*"
                    variant="filled"
                    inputRef={ref}
                    fullWidth
                    size="small"
                    //   disabled={props.isEdit}
                    error={Boolean(errors.billingAddressLine1)}
                    helperText={errors.billingAddressLine1?.message}
                    onChange={(e) => {
                      setValue('billingAddressLine1', e.target.value);
                      // setChecked(false);
                      checkAddressIsSameOrNot();
                      trigger('billingAddressLine1');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="billingAddressLine2"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address Line 2"
                    variant="filled"
                    fullWidth
                    size="small"
                    //   disabled={props.isEdit}
                    error={Boolean(errors.billingAddressLine2)}
                    helperText={errors.billingAddressLine2?.message}
                    onChange={(e) => {
                      setValue('billingAddressLine2', e.target.value);
                      // setChecked(false);
                      checkAddressIsSameOrNot();
                      trigger('billingAddressLine2');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="billing_city"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    label="City*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    //   disabled={props.isEdit}
                    size="small"
                    error={Boolean(errors.billing_city)}
                    helperText={errors.billing_city?.message}
                    onChange={(e) => {
                      setValue('billing_city', e.target.value);
                      // setChecked(false);
                      checkAddressIsSameOrNot();
                      trigger('billing_city');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="billing_postal_code"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    label="Pin Code*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    //   disabled={props.isEdit}
                    size="small"
                    error={Boolean(errors.billing_postal_code)}
                    helperText={errors.billing_postal_code?.message}
                    onChange={(e) => {
                      setValue('billing_postal_code', e.target.value);
                      // setChecked(false);
                      checkAddressIsSameOrNot();
                      trigger('billing_postal_code');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Box component="div">
                <Controller
                  name="billing_country"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field: { ref, ...field } }) => (
                    <Autocomplete
                      {...field}
                      options={countries}
                      getOptionLabel={(option) => option.label || ''}
                      value={
                        countries.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      // disabled={props.isEdit}
                      onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.value : '');
                        handleCorporateStatePopulate(newValue.value, 'billing');
                        // setChecked(false);
                        checkAddressIsSameOrNot();
                        trigger('billing_country');
                      }}
                      popupIcon={<KeyboardArrowDownIcon />}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Country*"
                          inputRef={ref}
                          variant="filled"
                          fullWidth
                          size="small"
                          error={!!errors.billing_country}
                          helperText={errors.billing_country?.message}
                        />
                      )}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="billing_state"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field: { ref, ...field } }) => (
                  <Autocomplete
                    {...field}
                    options={allStatesForBilling}
                    disabled={enableAllStatesForBilling}
                    getOptionLabel={(option) => option.label || ''}
                    value={
                      allStatesForBilling.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      field.onChange(newValue ? newValue.value : '');
                      // setChecked(false);
                      checkAddressIsSameOrNot();
                      trigger('billing_state');
                    }}
                    popupIcon={<KeyboardArrowDownIcon />}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputRef={ref}
                        label="State*"
                        variant="filled"
                        fullWidth
                        size="small"
                        error={!!errors.billing_state}
                        helperText={errors.billing_state?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        </RegisterCard>
        <RegisterCard title="Transporter logo">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6}>
              <Typography
                color={' #5E6871'}
                sx={{ mb: 2, fontWeight: 600, fontSize: '14px' }}
              >
                Upload company logo
              </Typography>
              <Box
                component="div"
                id="file-drop"
                sx={{
                  border: '2px dashed rgba(171, 191, 201, 0.80)',
                  borderRadius: '10px',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  paddingTop: '35px',
                  paddingBottom: '35px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  // height: "250px",
                }}
                onDrop={handleFileDropLogo}
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
                  Drag and drop icons here
                </Typography>
                <Typography sx={{ color: 'rgba(0, 0, 0, 0.40)' }}>
                  jpg, jpeg & png are allowed format and file size no more than
                  10MB
                </Typography>
                <input
                  type="file"
                  id="fileInput1"
                  style={{ display: 'none' }}
                  accept=".png, .jpg, .jpeg, .svg"
                  // multiple
                  onChange={handleFileLogoChange}
                />

                <Button
                  variant="outlined"
                  sx={{ marginTop: '24px' }}
                  onClick={() => document.getElementById('fileInput1').click()}
                >
                  {' '}
                  Choose a File
                </Button>
              </Box>
              {errors.logo && (
                <ErrorTypography>{errors.logo.message}</ErrorTypography>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Typography
                color={' #5E6871'}
                sx={{ mb: 2, fontWeight: 600, fontSize: '14px' }}
              >
                logo Preview
              </Typography>
              <div
                id="file-drop"
                style={{
                  border: '0.5px solid #BDCCD3',
                  borderRadius: '10px',
                  padding: '54px 0px 53px 0px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  height: '275px',
                  position: 'relative', // Make it relative for absolute positioning
                  overflow: 'hidden',
                }}
                // onDrop={handleFileDrop}
                // onDragOver={(event) => event.preventDefault()}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '100%', // Fit the image within the container width
                    maxHeight: '100%', // Fit the image within the container height
                  }}
                >
                  {companyLogo ? (
                    (() => {
                      if (companyLogo.startsWith('blob:')) {
                        return (
                          <img
                            src={companyLogo}
                            alt="Selected Preview"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '300px',
                              objectFit: 'contain',
                            }}
                          />
                        );
                      } else {
                        return (
                          <img
                            src={`${baseUrl}/service/file/download/${transp_id}/logo/${companyLogo}`}
                            alt="uploaded logo"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '300px',
                              objectFit: 'contain',
                            }}
                          />
                        );
                      }
                    })()
                  ) : (
                    <ImageIcon />
                  )}
                </div>
              </div>
            </Grid>
            <Grid item md={12} lg={12}>
              {logoFile !== '' ? (
                <Box
                  key={0}
                  display="flex"
                  alignItems="center"
                  marginBottom="16px"
                >
                  <img
                    src={iconList[logoFile?.split('.')[1]]}
                    alt="extension"
                    style={{ marginRight: '10px' }}
                  />
                  <Typography>
                    {StringSlice(logoFile?.split('.')[0], 20)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={fileUploadProgress[logoFile] || 0}
                    style={{ flex: 1, marginLeft: '16px' }}
                  />
                  <IconButton onClick={() => handleRemoveLogo()}>
                    <Clear />
                  </IconButton>
                </Box>
              ) : null}
            </Grid>
          </Grid>
        </RegisterCard>
        {transp_id && <ShipperList shipperList={shipperList} />}
        <Grid container justifyContent="right">
          <Button variant="contained" type="submit">
            Save and continue
          </Button>
        </Grid>
      </form>
    </>
  );
}
