import { useState, useEffect } from 'react';
import {
  TextField,
  Grid,
  Box,
  Typography,
  // FormControl,
  // InputLabel,
  // Select,
  // MenuItem,
  IconButton,
  LinearProgress,
  Button,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import {
  shipperRegistration,
  updateShipper,
  downloadDocs,
} from '../../api/register/shipper-details';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TitleContainer from '../card/TitleContainer';
import RegisterCard from '../card/RegisterCard';
import ImageIcon from '@mui/icons-material/Image';
import Autocomplete from '@mui/material/Autocomplete';
import { Clear, InfoOutlined } from '@mui/icons-material';
import pdficon from '../../../public/PDF_svg.svg';
import jpgicon from '../../../public/JPG_svg.svg';
import pngicon from '../../../public/PNG_svg.svg';
import docIcon from '../../assets/doc.svg';
import docxIcon from '../../assets/docx.svg';
import jpegIcon from '../../assets/jpeg.svg';
import xlsIcon from '../../assets/xls.svg';
import xlsxIcon from '../../assets/xlsx.svg';
import download from '../../assets/download_icon.png';
import svgIcon from '../../assets/svgIcon.svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ErrorTypography from '../typography/ErrorTypography';
import ContentWrapper from '../form-warpper/ContentWrapper';
import FooterWrapper from '../form-warpper/FooterWrapper';
import { StringSlice } from '../../utility/utility-function';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  nameValidator,
  emailValidator,
  contactPersonValidator,
  contactNumberValidator,
  panNumberValidator,
  tanValidator,
  gstValidator,
  // incorporateCertificateNumber,
  cinNumberValidator,
  tradeLicenseValidator,
  addressLine1Validator,
  addressLine2Validator,
  cityValidator,
  pinCodeValidator,
  countryValidator,
  stateValidator,
  requiredValidator,
  requiredValidatorOfArrayNew,
  fieldWithNoValidation,
  requiredNonZeroPositiveValidator,
  conditionalValidationTan,
} from '../../validation/common-validator';
import BackdropComponent from '../backdrop/Backdrop';
// import SnackbarComponent from '../snackbar/SnackbarCompoenet';
import { viewAllLicense } from '../../api/master-data/license';
import { viewAllCountry } from '../../api/master-data/country';
import { getAllStateByCountry } from '../../api/master-data/state';
import { getShipperDetails } from '../../api/register/shipper-details';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../redux/slices/snackbar-slice';
import {
  getBase64Multiple,
  getBase64MultipleArray,
  getBase64SingleFile,
} from '../../utility/utility-function';
import DownloadIcon from '@mui/icons-material/Download';
const baseUrl = import.meta.env.VITE_TMS_APP_API_URL;

export default function ShipperDetails({
  // value,
  currentStep,
  stepsContent,
  handleNext,
  handlePrevious,
}) {
  const navigate = useNavigate();
  const [companyLogo, setCompanyLogo] = useState(null);
  const [shipperStatus, setShipperStatus] = useState();
  const [logoFile, setLogoFile] = useState('');
  let fileUploadProgress = {};
  const [checked, setChecked] = useState(false);
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [countries, setCountries] = useState([]);
  const [allLicense, setAllLicense] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [allStatesForCorporate, setAllStatesForCorporate] = useState([]);
  const [enableAllStatesForCorporate, setEnableAllStateForCorporate] =
    useState(true);
  const [allStatesForBilling, setAllStatesForBilling] = useState([]);
  const [isDocumentChange, setIsDocumentChange] = useState(false);
  const [isLogoChange, setIsLogoChange] = useState(false);
  const [docPath, setDocPath] = useState(null);
  const [subLabel, setSubLabel] = useState(
    'Get started by filling out your details'
  );
  const [shipperName, setShipperName] = useState(''); /// sorry :)
  const [enableAllStatesForBilling, setEnableAllStateForBilling] =
    useState(true);
  const dispatch = useDispatch();
  const shipper_id = localStorage.getItem('shipper_id');

  const schemaBuilder = (docPath) => {
    const baseSchema = yup.object().shape({
      name: nameValidator,
      email: emailValidator,
      contactPerson: contactPersonValidator,
      contactNumber: contactNumberValidator,
      panNumber: panNumberValidator,
      tanNumber: conditionalValidationTan,
      gstNumber: gstValidator,
      // incorporateCertificateNumber: incorporateCertificateNumber,
      cinNumber: cinNumberValidator,
      tradeLicense: tradeLicenseValidator,
      corporateAddressLine1: addressLine1Validator,
      corporateAddressLine2: addressLine2Validator,
      corporateCity: cityValidator,
      corporatePinCode: pinCodeValidator,
      corporateCountry: countryValidator,
      corporateState: stateValidator,
      billingAddressLine1: addressLine1Validator,
      billingAddressLine2: addressLine2Validator,
      billingCity: cityValidator,
      billingPinCode: pinCodeValidator,
      billingCountry: countryValidator,
      billingState: stateValidator,
      // purchaseLicense: requiredValidator('Purchase License'),
      UserUsage: requiredNonZeroPositiveValidator('Please add some value'),
      logo: fieldWithNoValidation,
    });

    let conditionalSchema = baseSchema; // Initialize with the base schema

    if (docPath === null) {
      conditionalSchema = conditionalSchema.shape({
        documents: requiredValidatorOfArrayNew('Atleast one document'),
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
    trigger,
    formState: {
      errors,
      isSubmitting,
      // isValid,
    },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      documents: [],
    },
  });

  // const handleFileDrop = (event) => {
  //   setError('documents', undefined);
  //   event.preventDefault();
  //   event.stopPropagation();
  //   const files = event.dataTransfer.files;
  //   const maxSize = 2 * 1024 * 1024; // 2 MB in bytes

  //   const validFiles = Array.from(files).filter((file) => file.size <= maxSize);
  //   const invalidFiles = Array.from(files).filter(
  //     (file) => file.size > maxSize
  //   );

  //   if (invalidFiles.length > 0) {
  //     // Handle the case where one or more dropped files exceed the 2 MB limit.
  //     setError('documents', {
  //       message: 'One or more dropped files exceed the 2 MB limit.',
  //       type: 'validate',
  //     });
  //   }

  //   if (validFiles.length > 0) {
  //     setSelectedFiles(() => [
  //       // ...(prev || []),
  //       ...validFiles.map((file) => file.name),
  //     ]);
  //     setIsDocumentChange(true);
  //     setValue('documents', validFiles);
  //   }
  // };

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

  // const handleFileInputChange = (event) => {
  //   clearErrors('documents');
  //   const files = Array.from(event.target.files);
  //   const maxSize = 2 * 1024 * 1024; // 2 MB in bytes

  //   const invalidFile = files.find((file) => file.size > maxSize);

  //   if (invalidFile) {
  //     // Throw an error if any file exceeds the size limit
  //     setError('documents', {
  //       message: 'Please try to upload files less than 2MB',
  //     });
  //   }

  //   const validFiles = files.filter((file) => file.size <= maxSize);

  //   if (validFiles.length > 0) {
  //     setDocuments(validFiles);
  //     setValue('documents', validFiles);
  //     setSelectedFiles(() => [
  //       // ...(prev || []),
  //       ...validFiles.map((file) => file.name),
  //     ]);
  //     setIsDocumentChange(true);
  //   } else {
  //     // Handle the case where no valid files were selected or show an error message.
  //     setError('documents', {
  //       message: 'No valid files selected or files exceed the 2 MB limit.',
  //     });
  //   }
  // };

  const handleFileInputChange = (event) => {
    console.log('triggered');
    // Check if the input value is empty
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

  const handleFileLogoChange = (event) => {
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
      setIsLogoChange(true);
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

  // const handleFileLogoChange = (event) => {
  //   clearErrors('logo');
  //   const file = event.target.files[0];
  //   const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
  //   if (file && file.size <= maxSize) {
  //     setLogoFile(file.name);
  //     setCompanyLogo(URL.createObjectURL(event.target.files[0]));
  //     setValue('logo', event.target.files[0]);
  //     setIsLogoChange(true);
  //     console.log(companyLogo, typeof companyLogo);
  //   } else {
  //     // Handle the case where the file exceeds the 10 MB limit
  //     // Optionally, you can reset the file input to clear the selected file
  //     setLogoFile('');
  //     setError('logo', {
  //       message: 'Please select a file not exceeding 10 MB in size',
  //     });
  //     setValue('logo', undefined);
  //     setCompanyLogo(null);
  //   }
  // };

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
        setIsLogoChange(true);
      } else {
        // Handle the case where the file type is not allowed or exceeds the 10 MB limit
        setLogoFile('');
        setValue('logo', undefined);
        let errorMessage = '';

        if (!allowedTypes.includes(file.type)) {
          errorMessage =
            'Invalid file type. Please select a jpg, jpeg, png or svg file.';
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

  // const handleFileDropLogo = (event) => {
  //   clearErrors('logo');
  //   event.preventDefault();
  //   event.stopPropagation();
  //   const file = event.dataTransfer.files[0];
  //   const maxSize = 10 * 1024 * 1024; // 2 MB in bytes
  //   if (file && file.size <= maxSize) {
  //     setLogoFile(file.name);
  //     setCompanyLogo(URL.createObjectURL(event.dataTransfer.files[0]));
  //     setValue('logo', event.dataTransfer.files[0]);
  //     setIsLogoChange(true);
  //   } else {
  //     // Handle the case where the file exceeds the 10 MB limit
  //     // Optionally, you can reset the file input to clear the selected file
  //     setLogoFile('');
  //     setValue('logo', undefined);
  //     setError('logo', {
  //       message: 'Please select a file not exceeding 10 MB in size',
  //     });
  //     setCompanyLogo(null);
  //   }
  // };

  function handleCheck(e) {
    if (e.target.checked) {
      const billingAddLine1 = getValues('corporateAddressLine1');
      clearErrors('billingAddressLine1');
      clearErrors('billingAddressLine2');
      clearErrors('billingCity');
      clearErrors('billingPinCode');
      clearErrors('billingCountry');
      clearErrors('billingState');

      setValue('billingAddressLine1', billingAddLine1);
      const billingAddLine2 = getValues('corporateAddressLine2');
      setValue('billingAddressLine2', billingAddLine2);
      const city = getValues('corporateCity');
      setValue('billingCity', city);
      const pinCode = getValues('corporatePinCode');
      setValue('billingPinCode', pinCode);
      const country = getValues('corporateCountry');
      setValue('billingCountry', country);
      const state = getValues('corporateState');
      setValue('billingState', state);
      handleCorporateStatePopulate(country, 'billing');
      setChecked(e.target.checked);
      // setEnableAllStateForBilling(false);
    } else {
      setValue('billingAddressLine1', '');
      setValue('billingAddressLine2', '');
      setValue('billingCity', '');
      setValue('billingPinCode', '');
      setValue('billingCountry', '');
      setValue('billingState', '');
      setChecked(e.target.checked);
      // setEnableAllStateForBilling(false);
    }
  }
  function handleRemoveLogo() {
    const fileInput = document.getElementById('fileInput1');
    if (fileInput) {
      fileInput.value = '';
    }
    setError('logo', undefined);
    setLogoFile('');
    setCompanyLogo(null);
    setValue('logo', undefined);
  }

  const onSubmit = async (data) => {
    // console.log(data);

    const formData = new FormData();
    const formData2 = new FormData();
    const docArray = data.documents;
    const docs = await getBase64MultipleArray(data.documents);
    console.log('data logo', data.logo);
    let uploadLogo;
    if (typeof data.logo !== 'undefined') {
      uploadLogo = await getBase64SingleFile(data.logo);
    }

    console.log('ki likhbo', docs);
    console.log('hi doc', data.documents);
    console.log('>>', data.logo);
    const dataLogo = data.logo ? data.logo : '';
    if (dataLogo !== '') {
      const newlogo = new File([data.logo], data.logo.name, {
        type: 'image/*',
      });
      if (newlogo instanceof File) {
        // console.log('inside instance');
        formData2.append('file', newlogo);
      } else {
        console.log('newlogo is not a valid File object:', newlogo);
      }
    }
    // console.log('data.logo:', data.logo, newlogo);

    // const newlogo = data.logo;
    // formData2.append('file', newlogo);
    // Append each file to the FormData
    docArray.forEach((file, index) => {
      formData.append(`file[${index}]`, file);
    });

    let payload = {};
    console.log('doc array', docArray, formData2, data.logo);
    if (shipperStatus === 'pending') {
      payload = {
        name: data.name,
        email: data.email,
        contact_person: data.contactPerson,
        contact_no: data.contactNumber,
        corporate_address:
          data.corporateAddressLine1 + '||' + data.corporateAddressLine2,
        corporate_city: data.corporateCity,
        corporate_state: data.corporateState,
        corporate_country: data.corporateCountry,
        corporate_postal_code: data.corporatePinCode,
        billing_address:
          data.billingAddressLine1 + '||' + data.billingAddressLine2,
        billing_city: data.billingCity,
        billing_state: data.billingState,
        billing_country: data.billingCountry,
        billing_postal_code: data.billingPinCode,
        pan: data.panNumber,
        tan: data.tanNumber,
        gstin: data.gstNumber,
        status: 'approved',
        cin: data.cinNumber,
        threshold_limit: parseInt(data.UserUsage),
        support_docs: docs,
        logo: uploadLogo,
        is_logo_updated: isLogoChange,
        is_file_updated: isDocumentChange,
      };
    } else {
      payload = {
        name: data.name,
        email: data.email,
        contact_person: data.contactPerson,
        contact_no: data.contactNumber,
        corporate_address:
          data.corporateAddressLine1 + '||' + data.corporateAddressLine2,
        corporate_city: data.corporateCity,
        corporate_state: data.corporateState,
        corporate_country: data.corporateCountry,
        corporate_postal_code: data.corporatePinCode,
        billing_address:
          data.billingAddressLine1 + '||' + data.billingAddressLine2,
        billing_city: data.billingCity,
        billing_state: data.billingState,
        billing_country: data.billingCountry,
        billing_postal_code: data.billingPinCode,
        pan: data.panNumber,
        tan: data.tanNumber,
        gstin: data.gstNumber,
        cin: data.cinNumber,
        support_docs: docs,
        threshold_limit: parseInt(data.UserUsage),
        logo: uploadLogo,
        is_logo_updated: isLogoChange,
        is_file_updated: isDocumentChange,
      };
    }

    console.log(payload);
    if (!shipper_id) {
      setIsLoading(true);
      shipperRegistration(payload)
        .then((res) => {
          if (res.data.success === true) {
            setIsLoading(false);
            console.log('response', res.data.data.shpr_id);
            dispatch(
              openSnackbar({ type: 'success', message: 'Successfully saved!' })
            );
            localStorage.setItem('shipper_id', res.data.data.shpr_id);
            handleNext();
          } else {
            setIsLoading(false);
            dispatch(
              openSnackbar({ type: 'error', message: res.data.clientMessage })
            );
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log(shipper_id);
      setIsLoading(true);
      updateShipper(payload, shipper_id)
        // handleNext()
        .then((res) => {
          if (res.data.success === true) {
            setIsLoading(false);
            console.log('response', res.data.data.shpr_id);
            dispatch(
              openSnackbar({ type: 'success', message: 'Successfully saved!' })
            );
            localStorage.setItem('shipper_id', res.data.data.shpr_id);
            handleNext();
          } else {
            setIsLoading(false);
            dispatch(
              openSnackbar({ type: 'error', message: res.data.clientMessage })
            );
          }
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (shipper_id) {
      getShipperDetails({ id: shipper_id })
        .then((res) => {
          const data = res.data.data;
          setShipperStatus(data.status);
          const corporate_address = res.data.data.corporate_address;
          const billing_address = res.data.data.billing_address;
          const parts = corporate_address.split('||');
          const parts2 = billing_address.split('||');
          handleCorporateStatePopulate(
            res.data.data.corporate_country,
            'corporate'
          );
          handleCorporateStatePopulate(
            res.data.data.billing_country,
            'billing'
          );
          setSubLabel('Update shipper details from here');
          setValue('name', data.name);
          setShipperName(data.name);
          setValue('email', data.email);
          setValue('contactPerson', data.contact_person);
          setValue('contactNumber', data.contact_no);
          setValue('panNumber', data.pan);
          setValue('tanNumber', data.tan);
          setValue('gstNumber', data.gstin);
          // setValue('incorporateCertificateNumber', data.inc_cert);
          setValue('cinNumber', data.cin);
          // setValue('tradeLicense', data.trade_license);
          setValue('corporateAddressLine1', parts[0]);
          setValue('corporateAddressLine2', parts[1]);
          setValue('corporateCity', data.corporate_city);
          setValue('corporatePinCode', data.corporate_postal_code);
          setValue('corporateCountry', data.corporate_country);
          setValue('corporateState', data.corporate_state);
          setValue('billingAddressLine1', parts2[0]);
          setValue('billingAddressLine2', parts2[1]);
          setValue('billingCity', data.billing_city);
          setValue('billingPinCode', data.billing_postal_code);
          setValue('billingCountry', data.billing_country);
          setValue('billingState', data.billing_state);
          setValue('UserUsage', data.threshold_limit);
          setDocPath(data.doc_path);
          setCompanyLogo(data.logo);
          const isSameAddress =
            parts[0] === parts2[0] &&
            parts[1] === parts2[1] &&
            data.corporate_city === data.billing_city &&
            data.corporate_postal_code === data.billing_postal_code &&
            data.corporate_state === data.billing_state &&
            data.corporate_country === data.billing_country;

          if (isSameAddress) {
            setChecked(true);
          }
          //document and logo invalid
        })
        .catch((err) => console.log(err));
    }
    //call api for edit

    viewAllCountry()
      .then((res) => {
        console.log('Country', res.data.data);
        if (res.data.success === true) {
          const countries = res.data.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
          console.log('countries', countries);
          setCountries(countries);
          // viewAllLicense()
          //   .then((res) => {
          //     if (res.data.success === true) {
          //       setAllLicense(res.data.data);
          //     }
          //   })
          //   .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));

    // setValue('adminContactNumber', '79806768699');
  }, []);

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

  // if (isSubmitting && Object.keys(errors).length !== 0) {
  //   console.log('why not');
  //   dispatch(
  //     openSnackbar({
  //       type: 'error',
  //       message:
  //         'There are errors in the input fields. Please check and try again. ',
  //     })
  //   );
  // }

  const handleBack = () => {
    navigate('/acculead-secured/shiperdata');
  };

  function backToLogin() {
    navigate('/acculead-secured/shiperdata');
  }

  const checkAddressIsSameOrNot = () => {
    console.log('hi');
    const corporateAddressLine1 = getValues('corporateAddressLine1');
    const billingAddressLine1 = getValues('billingAddressLine1');
    const corporateAddressLine2 = getValues('corporateAddressLine2');
    const billingAddressLine2 = getValues('billingAddressLine2');
    const corporate_city = getValues('corporateCity');
    const billing_city = getValues('billingCity');
    const corporate_postal_code = getValues('corporatePinCode');
    const billing_postal_code = getValues('billingPinCode');
    const corporate_country = getValues('corporateCountry');
    const billing_country = getValues('billingCountry');
    const corporate_state = getValues('corporateState');
    const billing_state = getValues('billingState');
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <BackdropComponent loading={loading} />
      <ContentWrapper component="div" sx={{ p: 2 }}>
        <TitleContainer>
          <Typography variant="h3">Shipper Details </Typography>

          <Typography
            sx={{
              fontWeight: 400,
              marginTop: '8px',
              color: '#8A919D',
            }}
            variant="body1"
            mb={1}
          >
            {subLabel}
          </Typography>
          {shipperName !== '' && (
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

        <RegisterCard title="Company Details">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="Company Name*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    error={Boolean(errors.name)}
                    size="small"
                    helperText={errors.name?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="Email*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    size="small"
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="contactPerson"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="Contact Person*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    size="small"
                    error={Boolean(errors.contactPerson)}
                    helperText={errors.contactPerson?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="contactNumber"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="Contact Number*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    size="small"
                    error={Boolean(errors.contactNumber)}
                    helperText={errors.contactNumber?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="panNumber"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="PAN*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    size="small"
                    error={Boolean(errors.panNumber)}
                    helperText={errors.panNumber?.message}
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
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="tanNumber"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="TAN"
                    variant="filled"
                    fullWidth
                    size="small"
                    inputRef={ref}
                    error={Boolean(errors.tanNumber)}
                    helperText={errors.tanNumber?.message}
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
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="cinNumber"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="CIN*"
                    variant="filled"
                    fullWidth
                    size="small"
                    error={Boolean(errors.cinNumber)}
                    helperText={errors.cinNumber?.message}
                    inputRef={ref}
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
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="gstNumber"
                control={control}
                defaultValue=""
                rules={{
                  required: false,
                }}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="GSTIN *"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    size="small"
                    error={Boolean(errors.gstNumber)}
                    helperText={errors.gstNumber?.message}
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
            {/* <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="incorporateCertificateNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Incorporation Certificate"
                    variant="filled"
                    fullWidth
                    size="small"
                    error={Boolean(errors.incorporateCertificateNumber)}
                    helperText={errors.incorporateCertificateNumber?.message}
                    {...field}
                  />
                )}
              />
            </Grid> */}

            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="tradeLicense"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    label="Trade License"
                    variant="filled"
                    fullWidth
                    size="small"
                    error={Boolean(errors.tradeLicense)}
                    helperText={errors.tradeLicense?.message}
                    inputRef={ref}
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
          </Grid>
        </RegisterCard>
        <RegisterCard title="Document Upload*">
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
                    href={`${baseUrl}/service/file/download/all/${shipper_id}/${docPath}`}
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
                  doc, docx, png, jpg, jpeg, pdf, xls, xlsx are allowed format
                  and file size not more than 10MB for single file
                </Typography>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: 'none' }}
                  multiple
                  accept=".doc, .png, .jpg, .jpeg, .pdf, .xls, .xlsx, .docx"
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

        <RegisterCard title="Address Details">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="corporateAddressLine1"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    label="Address Line 1*"
                    variant="filled"
                    fullWidth
                    size="small"
                    inputRef={ref}
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
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    label="Address Line 2"
                    variant="filled"
                    fullWidth
                    size="small"
                    inputRef={ref}
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
                name="corporateCity"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    label="City*"
                    variant="filled"
                    fullWidth
                    size="small"
                    error={Boolean(errors.corporateCity)}
                    helperText={errors.corporateCity?.message}
                    inputRef={ref}
                    onChange={(e) => {
                      setValue('corporateCity', e.target.value);
                      // setChecked(false);
                      checkAddressIsSameOrNot();
                      trigger('corporateCity');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="corporatePinCode"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    label="Pin Code*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    size="small"
                    error={Boolean(errors.corporatePinCode)}
                    helperText={errors.corporatePinCode?.message}
                    onChange={(e) => {
                      setValue('corporatePinCode', e.target.value);
                      // setChecked(false);
                      checkAddressIsSameOrNot();
                      trigger('corporatePinCode');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Box component="div">
                <Controller
                  name="corporateCountry"
                  control={control}
                  defaultValue=""
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
                        trigger('corporateCountry');
                      }}
                      popupIcon={<KeyboardArrowDownIcon />}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputRef={ref}
                          label="Country*"
                          variant="filled"
                          fullWidth
                          size="small"
                          error={!!errors.corporateCountry}
                          helperText={errors.corporateCountry?.message}
                        />
                      )}
                    />
                  )}
                />
                {/* <Controller
                  name="corporateCountry"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      variant="filled"
                      size="small"
                      error={Boolean(errors.corporateCountry)}
                    >
                      <InputLabel id="country-label">Country</InputLabel>
                      <Select
                        {...field}
                        labelId="country-label"
                        id="corporateCountry"
                        label="Country"
                        IconComponent={KeyboardArrowDownIcon}
                      >
                        {countries.map((country, index) => {
                          return (
                            <MenuItem value={country.id} key={index}>
                              {country.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors.corporateCountry && (
                        <ErrorTypography>
                          {errors.corporateCountry.message}
                        </ErrorTypography>
                      )}
                    </FormControl>
                  )}
                /> */}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="corporateState"
                control={control}
                defaultValue=""
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
                      trigger('corporateState');
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
                        error={!!errors.corporateState}
                        helperText={errors.corporateState?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box sx={{ my: 4 }}>
            <Typography sx={{}} variant="h4">
              Billing Address
            </Typography>

            <FormControlLabel
              label="Same as corporate address"
              control={<Checkbox checked={checked} onChange={handleCheck} />}
            />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="billingAddressLine1"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    label="Address Line 1*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    size="small"
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
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    label="Address Line 2"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    size="small"
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
                name="billingCity"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    label="City*"
                    variant="filled"
                    fullWidth
                    size="small"
                    inputRef={ref}
                    error={Boolean(errors.billingCity)}
                    helperText={errors.billingCity?.message}
                    onChange={(e) => {
                      setValue('billingCity', e.target.value);
                      // setChecked(false);
                      checkAddressIsSameOrNot();
                      trigger('billingCity');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="billingPinCode"
                control={control}
                defaultValue=""
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    {...field}
                    label="Pin Code*"
                    variant="filled"
                    fullWidth
                    inputRef={ref}
                    size="small"
                    error={Boolean(errors.billingPinCode)}
                    helperText={errors.billingPinCode?.message}
                    onChange={(e) => {
                      setValue('billingPinCode', e.target.value);
                      // setChecked(false);
                      console.log('hi');
                      checkAddressIsSameOrNot();
                      trigger('billingPinCode');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Box component="div">
                <Controller
                  name="billingCountry"
                  control={control}
                  defaultValue=""
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
                        handleCorporateStatePopulate(newValue.value, 'billing');
                        // setChecked(false);
                        checkAddressIsSameOrNot();
                        trigger('billingCountry');
                      }}
                      popupIcon={<KeyboardArrowDownIcon />}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputRef={ref}
                          label="Country*"
                          variant="filled"
                          fullWidth
                          size="small"
                          error={!!errors.billingCountry}
                          helperText={errors.billingCountry?.message}
                        />
                      )}
                    />
                  )}
                />
                {/* <Controller
                  name="billingCountry"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      variant="filled"
                      size="small"
                      error={Boolean(errors.billingCountry)}
                    >
                      <InputLabel id="country-label">Country</InputLabel>
                      <Select
                        {...field}
                        labelId="country-label"
                        id="billingCountry"
                        label="Country"
                        IconComponent={KeyboardArrowDownIcon}
                      >
                        {countries.map((country, index) => {
                          return (
                            <MenuItem value={country.id} key={index}>
                              {country.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors.billingCountry && (
                        <ErrorTypography>
                          {errors.billingCountry.message}
                        </ErrorTypography>
                      )}
                    </FormControl>
                  )}
                /> */}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name="billingState"
                control={control}
                defaultValue=""
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
                      trigger('billingState');
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
                        error={!!errors.billingState}
                        helperText={errors.billingState?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        </RegisterCard>

        <RegisterCard title="Company Logo">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={6}>
              <Typography color={' #5E6871'} sx={{ mb: 2 }}>
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
                  // accept="image/*"
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
              <Typography color={' #5E6871'} sx={{ mb: 2 }}>
                logo Preview
              </Typography>
              <div
                id="file-drop"
                style={{
                  border: '0.5px solid #BDCCD3',
                  borderRadius: '4px',
                  padding: '54px 0px 53px 0px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  height: '275px',
                  position: 'relative', // Make it relative for absolute positioning
                  overflow: 'hidden',
                }}
                // onDrop={handleFileDrop}
                onDragOver={(event) => event.preventDefault()}
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
                            src={`${baseUrl}/service/file/download/${shipper_id}/logo/${companyLogo}`}
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
                    //   { typeof companyLogo === "object" ? <img
                    //   src={companyLogo}
                    //   alt="Selected Preview"
                    //   style={{ maxWidth: '100%', maxHeight: '300px' }}
                    // />:"hello" }

                    <ImageIcon />
                  )}
                </div>
              </div>
            </Grid>
            <Grid item md={12}>
              {logoFile !== '' ? (
                <Box
                  key={0}
                  display="flex"
                  alignItems="center"
                  marginBottom="16px"
                >
                  <img
                    src={iconList[logoFile.split('.')[1]]}
                    alt="extension"
                    style={{ marginRight: '10px' }}
                  />
                  <Typography>
                    {StringSlice(logoFile.split('.')[0], 20)}
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
        <RegisterCard title="Maximum User">
          <Typography sx={{ mt: -2, fontWeight: 400, color: '#8B8EA1', mb: 4 }}>
            Add Maximum User Limit
          </Typography>

          <Grid item xs={12} sm={6} md={6}>
            <Controller
              name="UserUsage"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label=" maximum no. of users*"
                  variant="filled"
                  fullWidth
                  inputRef={ref}
                  type="number"
                  size="small"
                  error={Boolean(errors.UserUsage)}
                  helperText={errors.UserUsage?.message}
                  {...field}
                />
              )}
            />
          </Grid>
        </RegisterCard>
      </ContentWrapper>
      <FooterWrapper>
        {currentStep === 0 ? (
          <Button variant="outlined" onClick={() => backToLogin()}>
            Back
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
        )}

        {currentStep !== stepsContent.length - 1 ? (
          <Button
            variant="contained"
            type="submit"
            disabled={currentStep === stepsContent.length - 1}
          >
            {shipperStatus === 'pending'
              ? 'Approve and Continue'
              : ' Save and Continue'}
          </Button>
        ) : (
          <Button variant="contained" type="submit">
            Submit
          </Button>
        )}
      </FooterWrapper>
    </form>
  );
}
