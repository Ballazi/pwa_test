import { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  DialogActions,
  Button,
  Box,
  Autocomplete,
  Typography,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  IconButton,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { Clear } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DownloadIcon from '@mui/icons-material/Download';
import * as yup from 'yup';
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
  rocNumberValidator,
  requiredValidatorOfArrayNew,
} from '../../../validation/common-validator';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FileUploader } from '../TransporterComponent/fileUplodeComponent';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import VehicleListTable from './VehicleListTable';
import {
  fetchKamRole,
  addTransporter,
  fetchBranch,
  fetchMasterFleets,
} from '../../../api/register/transporter';
import { viewAllCountry } from '../../../api/master-data/country';
import { getAllStateByCountry } from '../../../api/master-data/state';
import SelectKam from './SelectKam';
import KamList from './KamList';
import FleetTable from '../../../pages/public-transporter/create-transporter-pages/fleet-details/FleetTable';
// import AddVehicleList from './AddVehicleList';
import { v4 as uuidv4 } from 'uuid';
import { addNewShipper } from '../../../api/register/transporter';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../../redux/slices/snackbar-slice';
import ErrorTypography from '../../typography/ErrorTypography';
import {
  getBase64SingleFile,
  getBase64MultipleArray,
} from '../../../utility/utility-function';
import { StringSlice } from '../../../utility/utility-function';
import pdficon from '../../../../public/PDF_svg.svg';
import jpgicon from '../../../../public/JPG_svg.svg';
import pngicon from '../../../../public/PNG_svg.svg';
import docIcon from '../../../assets/doc.svg';
import docxIcon from '../../../assets/docx.svg';
import xlsIcon from '../../../assets/xls.svg';
import xlsxIcon from '../../../assets/xlsx.svg';
import jpegIcon from '../../../assets/jpeg.svg';
import svgIcon from '../../../assets/svgIcon.svg';
const baseUrl = import.meta.env.VITE_TMS_APP_API_URL;

export default function TransporterDetails(props) {
  const [allStatesForCorporate, setAllStatesForCorporate] = useState([]);
  const [fleets, setFleets] = useState([]);
  const [enableAllStatesForCorporate, setEnableAllStateForCorporate] =
    useState(true);
  const [checked, setChecked] = useState(false);
  const [masterFleets, setMasterFleets] = useState([]);
  const [masterFleetsCopy, setMasterFleetsCopy] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [allStatesForBilling, setAllStatesForBilling] = useState([]);
  const [countries, setCountries] = useState([]);
  const [enableAllStatesForBilling, setEnableAllStateForBilling] =
    useState(true);
  const [roleId, setRoleId] = useState('');
  const [users, setUsers] = useState([]);
  const [kamDataForEdit, setKamDataForEdit] = useState({});
  const [draftDeletedKam, setDraftDeletedKam] = useState({});
  const [newFleets, setNewFleets] = useState([]);
  // const [draftFleets, setDraftFleets] = useState([]);
  const [isFilesUpdated, setIsFilesUpdated] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isGstUpdated, setIsGstUpdated] = useState(false);
  const [hasGst, setHasGst] = useState(null);
  const [gstLabel, setGstLabel] = useState('GSTIN Upload*');
  const [gstUpload, setGstUpload] = useState(null);
  const [isLogoChange, setIsLogoChange] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoFile, setLogoFile] = useState('');
  const [docPath, setDocPath] = useState(null);
  const dispatch = useDispatch();
  const [branches, setBranches] = useState([]);
  const shipper_id = localStorage.getItem('shipper_id');
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
  const schemaBuilder = (hasGst) => {
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
      bank_guarantee_date:
        // yup.date().required('Date is required')
        yup.date().notRequired(),
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
      documents: yup.mixed(),
    });

    let conditionalSchema = baseSchema;
    if (hasGst === null) {
      conditionalSchema = conditionalSchema.shape({
        // documents: requiredValidatorOfArrayNew('Atleast one document'),
        gst_doc: yup.mixed().required('Gst file is required'),
      });
    }

    return conditionalSchema;
  };
  const schema = schemaBuilder(hasGst);

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    clearErrors,
    setError,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      roc_number: '',
      // iba_approved: false,
      carriage_act_cert: '',
      logo: null,
      documents: [],
    },
  });

  useEffect(() => {
    // Call the fetchData function
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [countriesRes, kamRoleRes, branchRes, masterFleetsResponse] =
        await Promise.all([
          viewAllCountry(),
          fetchKamRole(),
          fetchBranch(shipper_id),
          fetchMasterFleets(),
        ]);

      console.log('Country', countriesRes.data.data);

      if (countriesRes.data.success === true) {
        const countries = countriesRes.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setCountries(countries);
        setRoleId(kamRoleRes.data.data.id);
      }

      const branchData = branchRes.data.data.map((item) => ({
        label: item.name,
        value: item.branch_id,
      }));
      setBranches(branchData);

      if (masterFleetsResponse.data.success) {
        const masterData = masterFleetsResponse.data.data.map((data) => ({
          label: data.name,
          value: data.id,
        }));

        setMasterFleets(masterData);
        setMasterFleetsCopy(masterData);
      }

      if (props.isEdit && props.modalTransporterData) {
        const userData = props?.modalTransporterData.kams.map((user) => {
          console.log('user koi', user.role_list);
          const filteredData = branchData.filter((dataItem) =>
            user.role_list.some(
              (roleItem) => roleItem.mpus_branch_id === dataItem.value
            )
          );
          return {
            contact_no: user.contact_no,
            email: user.email,
            is_new: false,
            name: user.name,
            user_id: user.user_id,
            role_list: filteredData,
            share_login_details: true,
          };
        });
        setUsers(userData);
        console.log('hohoho', props.modalTransporterData);
        const corporate_address = props.modalTransporterData.corporate_address;
        const billing_address = props.modalTransporterData.billing_address;
        const parts = corporate_address.split('||');
        const parts2 = billing_address.split('||');
        const date = props.modalTransporterData.bank_guarantee_date
          ? dayjs(new Date(props.modalTransporterData.bank_guarantee_date))
          : null;
        console.log('date', date);

        handleCorporateStatePopulate(
          props.modalTransporterData.billing_country,
          'corporate'
        );
        handleCorporateStatePopulate(
          props.modalTransporterData.corporate_country,
          'billing'
        );

        setValue('name', props.modalTransporterData.name);
        setValue('email', props.modalTransporterData.email);
        setValue('contact_person', props.modalTransporterData.contact_person);
        setValue('contact_no', props.modalTransporterData.contact_no);
        setValue('pan', props.modalTransporterData.pan);
        setValue('tan', props.modalTransporterData.tan);
        setValue('gstin', props.modalTransporterData.gstin);
        setValue('roc_number', props.modalTransporterData.roc_number);
        setValue(
          'carriage_act_cert',
          props.modalTransporterData.carriage_act_cert
        );
        setCompanyLogo(props.modalTransporterData.logo);
        setValue('bank_guarantee_date', date);

        setValue('corporateAddressLine1', parts[0]);
        setValue('corporateAddressLine2', parts[1]);
        setValue('corporate_city', props.modalTransporterData.corporate_city);
        setValue(
          'corporate_postal_code',
          props.modalTransporterData.corporate_postal_code
        );
        setValue(
          'corporate_country',
          props.modalTransporterData.corporate_country
        );
        setValue('corporate_state', props.modalTransporterData.corporate_state);
        setValue('billingAddressLine1', parts2[0]);
        setValue('billingAddressLine2', parts2[1]);
        setValue('billing_country', props.modalTransporterData.billing_country);
        setValue('billing_state', props.modalTransporterData.billing_state);
        setValue('billing_city', props.modalTransporterData.billing_city);
        setValue(
          'billing_postal_code',
          props.modalTransporterData.billing_postal_code
        );
        setValue('iba_approved', props.modalTransporterData.iba_approved);
        setFleets(props.modalTransporterData.fleets);
        console.log('test', props.modalTransporterData.iba_approved);

        if (props.modalTransporterData.gstin_file === null) {
          setGstLabel('GSTIN Upload');
          setHasGst(true);
        } else {
          setGstLabel(props.modalTransporterData.gstin_file);
          setHasGst(true);
        }

        setDocPath(props.modalTransporterData.doc_path);
        console.log('hi', props.modalTransporterData.doc_path);

        const isSameAddress =
          parts[0] === parts2[0] &&
          parts[1] === parts2[1] &&
          props.modalTransporterData.corporate_city ===
            props.modalTransporterData.billing_city &&
          props.modalTransporterData.corporate_postal_code ===
            props.modalTransporterData.billing_postal_code &&
          props.modalTransporterData.corporate_state ===
            props.modalTransporterData.billing_state &&
          props.modalTransporterData.corporate_country ===
            props.modalTransporterData.billing_country;

        if (isSameAddress) {
          setChecked(true);
        }

        const fleetData = props.modalTransporterData.fleets.map(
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
        // setDraftFleets(fleetData);
        // const allExistedFleetsId = props.modalTransporterData.fleets.map(
        //   (item) => item.mtf_fleet_id
        // );
        // const filteredMasterData = masterFleetsResponse.data.data.filter(
        //   (item) => !allExistedFleetsId.includes(item.id)
        // );
        // const masterDataReplica = filteredMasterData.map((data) => ({
        //   label: data.name,
        //   value: data.id,
        // }));
        // setMasterFleetsCopy(masterDataReplica);

        // setUsers(props.modalTransporterData.user);
      }
    } catch (error) {
      console.error(error);
    }
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

  const handleKamUsers = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const onSubmit = (data) => {
    const transformedUsersData = users.map((user) => {
      const { is_new, ...restUser } = user;
      if (is_new) {
        const { user_id, ...rest } = restUser;
        return {
          ...rest,
          role_list: transformRoleList(rest),
        };
      } else {
        const { is_new, ...rest } = restUser;
        return {
          ...rest,
          role_list: transformRoleList(rest),
        };
      }
    });
    if (props.isEdit === true) {
      const transformedUsersData = users.map((user) => {
        const { is_new, ...restUser } = user;
        if (is_new) {
          const { user_id, ...rest } = restUser;
          return {
            ...rest,
            role_list: transformRoleList(rest),
          };
        } else {
          const { is_new, ...rest } = restUser;
          return {
            ...rest,
            role_list: transformRoleList(rest),
          };
        }
      });
      const payload = {
        shipper_id: shipper_id,
        transporter_id: props?.modalTransporterData?.trnsp_id,
        users: transformedUsersData,
      };
      console.log('payload', payload);
      if (users.length === 0) {
        dispatch(
          openSnackbar({
            type: 'error',
            message: 'Please Add KAM details!',
          })
        );
      } else {
        addTransporter(payload)
          .then((res) => {
            if (res.data.success === true) {
              reset();
              props.handleComplete(
                users,
                props?.modalTransporterData?.trnsp_id
              );
              dispatch(
                openSnackbar({
                  type: 'success',
                  message: res.data.clientMessage,
                })
              );
            } else {
              dispatch(
                openSnackbar({
                  type: 'error',
                  message: res.data.clientMessage,
                })
              );
            }
          })
          .catch((err) =>
            dispatch(
              openSnackbar({
                type: 'error',
                message: err.response.data.clientMessage,
              })
            )
          );
      }
    } else {
      console.log('new fleet', newFleets);
      const modifiedData = newFleets.map((item) => {
        const { create_id, index, ...data } = item;
        return data;
      });
      console.log('data', modifiedData);
      console.log('hit me', data);

      const {
        corporateAddressLine1,
        corporateAddressLine2,
        billingAddressLine1,
        billingAddressLine2,
        ...refinedData
      } = data;

      const inputDate =
        refinedData.bank_guarantee_date === null
          ? null
          : dayjs(refinedData.bank_guarantee_date).format(
              'YYYY-MM-DD HH:mm:ss.SSS'
            );
      console.log(
        'refine date',
        inputDate,
        refinedData.bank_guarantee_date === null
      );
      handleNewEntry(
        refinedData,
        inputDate,
        data,
        modifiedData,
        transformedUsersData
      );
    }
  };

  const handleNewEntry = async (
    refinedData,
    inputDate,
    data,
    modifiedData,
    transformedUsersData
  ) => {
    let uploadFile;
    console.log('gstUpload', gstUpload);
    if (gstUpload) {
      console.log('check');
      uploadFile = await makeBase64(gstUpload);
    }
    console.log('uploadFile', uploadFile);
    console.log('file', refinedData.logo);
    let uploadLogo;
    if (refinedData.logo !== null && typeof refinedData.logo !== 'undefined') {
      console.log('check 2');
      uploadLogo = await getBase64SingleFile(data.logo);
    }
    let docs = [];
    if (data.documents.length > 0) {
      docs = await getBase64MultipleArray(data.documents);
    }

    // const logoFile = await makeBase64(refinedData.logo[0]);
    console.log('logo', logoFile);
    const { logo, documents, gst_doc, ...finalData } = refinedData;

    const payload = {
      ...finalData,
      onboarding_shipper_id: shipper_id,
      bank_guarantee_date: inputDate,
      corporate_address:
        data.corporateAddressLine1 + '||' + data.corporateAddressLine2,
      billing_address:
        data.billingAddressLine1 + '||' + data.billingAddressLine2,
      fleets: modifiedData,
      users: transformedUsersData,
      gstin_file: uploadFile,
      logo: uploadLogo,
      support_docs: docs,
    };

    console.log('payload', payload);
    console.log('new fleets', newFleets);
    const isMtfFleetIdNotPresent = newFleets.some(
      (obj) => !obj.hasOwnProperty('mtf_fleet_id')
    );

    const hasDuplicate = hasDuplicateFleetId(newFleets);

    console.log('hello>>>', isMtfFleetIdNotPresent);
    // if (newFleets.length === 0) {
    //   dispatch(
    //     openSnackbar({
    //       type: 'error',
    //       message: 'Please add fleet details',
    //     })
    //   );
    // }
    if (users.length === 0) {
      dispatch(
        openSnackbar({
          type: 'error',
          message: 'Please Add KAM details!',
        })
      );
    } else if (isMtfFleetIdNotPresent) {
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
    }
    // else if (users.length === 0) {
    //   dispatch(
    //     openSnackbar({
    //       type: 'error',
    //       message: 'Please add at least one kam details',
    //     })
    //   );
    // }
    else {
      addNewShipper(payload)
        .then((res) => {
          if (res.data.success) {
            console.log('response', res);
            reset();
            const myData = {
              ...payload,
              trnsp_id: res.data.data.trnsp_id,
              kam_count: users.length,
            };
            props.handleCompleteNewTransporter(users, myData);
            setNewFleets([]);
            // setDraftFleets([]);
            setUsers([]);
            dispatch(
              openSnackbar({
                type: 'success',
                message: res.data.clientMessage,
              })
            );
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            dispatch(
              openSnackbar({
                type: 'error',
                message: res.data.clientMessage,
              })
            );
          }
        })
        .catch((err) =>
          dispatch(
            openSnackbar({
              type: 'error',
              message: err.message,
            })
          )
        );
    }
  };

  const makeBase64 = async (file) => {
    if (typeof file !== 'undefined' || file !== null) {
      return await getBase64SingleFile(file);
    }
  };

  const handleClickEdit = (user, index) => {
    setKamDataForEdit(user);
    console.log('index', index);
    const newArray = users.slice(0, index).concat(users.slice(index + 1));
    console.log(newArray); // newArray does not contain the element at index 2 (3)
    setUsers(newArray);
    // handleClickDelete(index);
    setDraftDeletedKam(user);
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

  const handleClickDelete = (index, user) => {
    const indexToDelete = index;
    if (
      indexToDelete >= 0 &&
      indexToDelete < users.length &&
      user.is_new === true
    ) {
      console.log('fuck you');
      const newArray = users
        .slice(0, indexToDelete)
        .concat(users.slice(indexToDelete + 1));
      console.log(newArray); // newArray does not contain the element at index 2 (3)
      setUsers(newArray);
    } else {
      console.log('fuck off');
      const userData = users.filter(
        (item) => !item.hasOwnProperty('is_deleted')
      );
      const findUsers = userData.find(
        (item, index) => item.contact_no === user.contact_no
      );
      setUsers((prev) =>
        prev.map((item) => {
          if (item.user_id === findUsers.user_id) {
            item.is_deleted = true;
          }
          return item;
        })
      );
    }
  };

  // const handleClickDelete = (index, contactNumber) => {
  //   const indexToDelete = index;

  //   const userData = users.filter((item) => !item.hasOwnProperty('is_deleted'));
  //   console.log('index', indexToDelete, contactNumber, userData);
  //   // if (indexToDelete >= 0 && indexToDelete < users.length) {
  //   console.log('users', users);
  //   const findUsers = userData.find(
  //     (item, index) => item.contact_no === contactNumber
  //   );
  //   console.log('findUsers', findUsers);

  //   if (findUsers.hasOwnProperty('user_id')) {
  //     ///for edit
  //     setUsers((prev) =>
  //       prev.map((item) => {
  //         if (item.user_id === findUsers.user_id) {
  //           item.is_deleted = true;
  //         }
  //         return item;
  //       })
  //     );

  //     console.log('users', users);
  //   } else {
  //     ///for non saved data
  //     const newArray = userData
  //       .slice(0, indexToDelete)
  //       .concat(users.slice(indexToDelete + 1));
  //     console.log('newArray', newArray);
  //     setUsers(newArray);
  //   }
  //   // }
  // };

  function transformRoleList(user) {
    return user.role_list.map((role) => ({
      mpus_shipper_id: shipper_id,
      mpus_branch_id: role.value,
      mpus_role_id: roleId,
    }));
  }

  const handleKamEdit = (data) => {
    console.log('hello', data);
    setUsers((prevState) => [...prevState, data]);

    // setUsers((prevUsers) => {
    //   const existingObjectIndex = prevUsers.findIndex(
    //     (obj) => obj.user_id === data.user_id
    //   );

    //   if (existingObjectIndex !== -1) {
    //     // If an object with the same user_id exists, update it
    //     prevUsers[existingObjectIndex] = data;
    //     console.log('Object updated.');
    //     return [...prevUsers]; // Return a new array to trigger a state update
    //   } else {
    //     // If it doesn't exist, add it to the array
    //     return prevUsers; // No changes, return the current state
    //   }
    // });
  };

  // const handleKamEdit = (data) => {
  //   console.log('hello', data);
  //   const existingObjectIndex = users.findIndex(
  //     (obj) => obj.user_id === data.user_id
  //   );

  //   if (existingObjectIndex !== -1) {
  //     // If an object with the same user_id exists, update it
  //     users[existingObjectIndex] = data;
  //     setUsers([...users]);
  //     console.log('Object updated.');
  //   } else {
  //     // If it doesn't exist, add it to the array
  //     return;
  //   }
  // };

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

  // const handleNewFleets = (data) => {
  //   console.log('backstreet boys', data);
  //   const insertNewData = {
  //     create_id: uuidv4(),
  //     mtf_fleet_id: '',
  //     no_of_owned: 0,
  //     no_of_leased: 0,
  //     is_updated: false,
  //     index: newFleets.length,
  //   };

  //   setNewFleets((prevData) => {
  //     return [...prevData, insertNewData];
  //   });
  // };

  const handleInsertFleet = (data) => {
    console.log('fleet', data);
    const myIndex = data.index;
    console.log('myIndex', myIndex);
    setNewFleets((prevFleets) => {
      const fleets = [...prevFleets]; // Create a shallow copy of the previous state array
      fleets[myIndex] = data;
      return fleets; // Return the updated state value
    });

    // setMasterFleetsCopy((prevFleets) => {
    //   const data1 = prevFleets.filter(
    //     (item) => item.value !== data.mtf_fleet_id
    //   );
    //   return data1;
    // });
  };
  // const handleInsertFleet = (data) => {
  //   console.log('fleet', data);
  //   const myIndex = data.index;
  //   console.log('myIndex', myIndex);
  //   const fleets = newFleets;
  //   fleets[myIndex] = data;
  //   setNewFleets(fleets);
  // };

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
        message: 'Invalid file type, only jpg, jpeg, png and pdf are allowed.',
      });
      return;
    }
    if (shipper_id) {
      setIsGstUpdated(true);
    }
    clearErrors('gst_doc');
    setValue('gst_doc', val);
    console.log('file name', val);
    setGstUpload(val);
    setGstLabel(val?.name);
  };

  // const handleSingleFile = (val) => {
  //   // console.log('sotti', val);
  //   console.log('gst file', val);
  //   setGstUpload(val);
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

  // const handleFileDropLogo = (event) => {
  //   clearErrors('logo');
  //   event.preventDefault();
  //   event.stopPropagation();
  //   const file = event.dataTransfer.files[0];
  //   const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
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

  const onCancelEdit = () => {
    setUsers((prevState) => [...prevState, draftDeletedKam]);
    setKamDataForEdit({});
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

  const checkAddressIsSameOrNot = () => {
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

  // const handleFileDrop = (event) => {
  //   if (shipper_id) {
  //     setIsFilesUpdated(true);
  //   }
  //   if (!event.target.files.length) {
  //     // Reset the value and clear any previous errors
  //     event.target.value = '';
  //     clearErrors('documents');
  //     return;
  //   }
  //   setError('documents', undefined);
  //   event.preventDefault();
  //   event.stopPropagation();
  //   const files = event.dataTransfer.files;
  //   const maxSize = 10 * 1024 * 1024; // 10 MB in bytes

  //   const validFiles = Array.from(files).filter((file) => {
  //     const fileExtension = file.name.split('.').pop().toLowerCase();
  //     const allowedFormats = [
  //       'doc',
  //       'png',
  //       'jpg',
  //       'jpeg',
  //       'pdf',
  //       'xls',
  //       'xlsx',
  //       'docx',
  //     ];
  //     return file.size <= maxSize && allowedFormats.includes(fileExtension);
  //   });

  //   const invalidFiles = Array.from(files).filter(
  //     (file) => file.size > maxSize || !validFiles.includes(file)
  //   );

  //   if (invalidFiles.length > 0) {
  //     // Handle the case where one or more dropped files exceed the 10 MB limit or have unsupported formats.
  //     setError('documents', {
  //       message:
  //         'Some dropped files are either larger than 10 MB or have unsupported formats.',
  //       type: 'validate',
  //     });
  //   }

  //   if (validFiles.length > 0) {
  //     setSelectedFiles(() => [
  //       // ...(prev || []),
  //       ...validFiles.map((file) => file.name),
  //     ]);
  //     // setIsDocumentChange(true);
  //     setValue('documents', validFiles);
  //   }
  // };

  const handleFileDrop = (event) => {
    console.log(event);
    if (shipper_id) {
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
    if (shipper_id) {
      setIsFilesUpdated(true);
    }
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
  };

  // const handleFileInputChange = (event) => {
  //   if (shipper_id) {
  //     setIsFilesUpdated(true);
  //   }
  //   if (!event.target.files.length) {
  //     // Reset the value and clear any previous errors
  //     event.target.value = '';
  //     clearErrors('documents');
  //     return;
  //   }
  //   clearErrors('documents');
  //   const files = Array.from(event.target.files);
  //   const maxSize = 10 * 1024 * 1024; // 10 MB in bytes

  //   const allowedFormats = ['doc', 'png', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx'];

  //   const invalidFile = files.find((file) => {
  //     const fileExtension = file.name.split('.').pop().toLowerCase();
  //     return file.size > maxSize || !allowedFormats.includes(fileExtension);
  //   });

  //   if (invalidFile) {
  //     // Throw an error if any file exceeds the size limit or has an invalid format
  //     setError('documents', {
  //       message:
  //         'Please try to upload files less than 10MB and in the specified formats.',
  //     });
  //   }

  //   const validFiles = files.filter((file) => {
  //     const fileExtension = file.name.split('.').pop().toLowerCase();
  //     return file.size <= maxSize && allowedFormats.includes(fileExtension);
  //   });

  //   if (validFiles.length > 0) {
  //     setDocuments(validFiles);
  //     setValue('documents', validFiles);
  //     setSelectedFiles(() => [
  //       // ...(prev || []),
  //       ...validFiles.map((file) => file.name),
  //     ]);
  //     // setIsDocumentChange(true);
  //   } else {
  //     // Handle the case where no valid files were selected or show an error message.
  //     setError('documents', {
  //       message: 'No valid files selected or files exceed the 10 MB limit.',
  //     });
  //   }
  // };

  const handleDeleteFleet = (fleet) => {
    const myIndex = fleet.index;
    setNewFleets((prevFleets) => {
      const fleets = [...prevFleets]; // Create a shallow copy of the previous state array
      const filteredFleets = fleets.filter((item) => item.index !== myIndex);
      return filteredFleets; // Return the updated state value
    });

    // setDraftFleets((prevFleets) => {
    //   const fleets = [...prevFleets]; // Create a shallow copy of the previous state array
    //   const filteredFleets = fleets.filter((item) => item.index !== myIndex);
    //   return filteredFleets; // Return the updated state value
    // });

    const retrieveMasterFleet = masterFleets.find(
      (item) => item.value === fleet.mtf_fleet_id
    );
    console.log('check man', retrieveMasterFleet);
    // setMasterFleetsCopy((prevState) => [...prevState, retrieveMasterFleet]);
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
        // isEditable: false,
      },
    ]);

    // setDraftFleets((prevState) => [
    //   ...prevState,
    //   {
    //     create_id: uuidv4(),
    //     // mtf_fleet_id: masterFleets[0].value,
    //     no_of_owned: '0',
    //     no_of_leased: '0',
    //     is_updated: false,
    //     isEditable: true,
    //     // is_exist: false,
    //     index: newFleets.length,
    //   },
    // ]);
  };

  // const handleDraftFleets = (create_id) => {
  //   const myIndex = create_id;
  //   setDraftFleets((prevFleets) => {
  //     const fleets = [...prevFleets]; // Create a shallow copy of the previous state array
  //     const filteredFleets = fleets.filter(
  //       (item) => item.create_id !== myIndex
  //     );
  //     return filteredFleets; // Return the updated state value
  //   });
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {console.log('here', errors)}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Transporter Name*"
                  variant="filled"
                  fullWidth
                  disabled={props.isEdit}
                  inputRef={ref}
                  error={Boolean(errors.name)}
                  size="small"
                  helperText={errors.name?.message}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Corporate contact email*"
                  variant="filled"
                  fullWidth
                  disabled={props.isEdit}
                  inputRef={ref}
                  error={Boolean(errors.email)}
                  size="small"
                  helperText={errors.email?.message}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Controller
              name="contact_person"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Corporate contact person*"
                  variant="filled"
                  fullWidth
                  disabled={props.isEdit}
                  inputRef={ref}
                  error={Boolean(errors.contact_person)}
                  size="small"
                  helperText={errors.contact_person?.message}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Controller
              name="contact_no"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Corporate contact number*"
                  variant="filled"
                  fullWidth
                  disabled={props.isEdit}
                  inputRef={ref}
                  error={Boolean(errors.contact_no)}
                  size="small"
                  helperText={errors.contact_no?.message}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Controller
              name="pan"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="PAN*"
                  variant="filled"
                  fullWidth
                  disabled={props.isEdit}
                  inputRef={ref}
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
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Controller
              name="tan"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="TAN*"
                  variant="filled"
                  fullWidth
                  disabled={props.isEdit}
                  inputRef={ref}
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
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Controller
              name="gstin"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="GSTIN*"
                  variant="filled"
                  fullWidth
                  disabled={props.isEdit}
                  inputRef={ref}
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
          <Grid item xs={12} sm={6} md={6} lg={6}>
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
            {hasGst && !props.isEdit && (
              <a
                href={`${baseUrl}/service/file/download/${props?.modalTransporterData?.trnsp_id}/gstin_file/${gstLabel}`}
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
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Controller
              name="roc_number"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="ROC Number"
                  variant="filled"
                  fullWidth
                  disabled={props.isEdit}
                  inputRef={ref}
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
          {/* <Grid item xs={12} sm={6} md={6} lg={6}>
            <Controller
              name="iba_approved"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="IBA Approved"
                  variant="filled"
                  fullWidth
                  disabled={props.isEdit}
                  error={Boolean(errors.iba_approved)}
                  size="small"
                  helperText={errors.iba_approved?.message}
                />
              )}
            />
          </Grid> */}
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Controller
              name="carriage_act_cert"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...field } }) => (
                <TextField
                  label="Carriage act certificate"
                  variant="filled"
                  fullWidth
                  disabled={props.isEdit}
                  inputRef={ref}
                  error={Boolean(errors.carriage_act_cert)}
                  size="small"
                  helperText={errors.carriage_act_cert?.message}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="bank_guarantee_date"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Bank guarantee validity date"
                    disabled={props.isEdit}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        size: 'small',
                        variant: 'filled',
                        fullWidth: true,
                      },
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                )}
              />
              {errors.bank_guarantee_date && (
                <ErrorTypography>
                  {errors.bank_guarantee_date.message}
                </ErrorTypography>
              )}
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Controller
          name="iba_approved"
          control={control}
          // defaultValue={false}
          disabled={props.isEdit}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={!!field.value}
                  disabled={props.isEdit}
                />
              }
              sx={{ marginTop: '16px' }}
              label="IBA approved"
            />
          )}
        />
        {errors.iba_approved && (
          <ErrorTypography>{errors.iba_approved.message}</ErrorTypography>
        )}
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h4">Document upload</Typography>
              {docPath && (
                <a
                  href={`${baseUrl}/service/file/download/all/${props?.modalTransporterData?.trnsp_id}/${docPath}`}
                >
                  <DownloadIcon />
                </a>
              )}
            </Box> */}
            {!props.isEdit && (
              <div
                id="file-drop"
                style={{
                  marginTop: '20px',
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
            )}
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
                  src={iconList[file?.split('.').pop()]}
                  alt="extension"
                  style={{ marginRight: '10px' }}
                />
                <Typography>{StringSlice(file?.split('.')[0], 15)}</Typography>
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
        {props.isEdit === true && <VehicleListTable fleets={fleets} />}
        {props.isEdit === false && (
          <FleetTable
            handleNewFleets={handleNewFleets}
            handleDelete={handleDeleteFleet}
            newFleets={newFleets}
            saveFleetDetails={handleInsertFleet}
            masterFleets={masterFleets}
            // draftFleets={draftFleets}
            addNewFleet={addNewFleet}
            masterFleetsCopy={masterFleetsCopy}
            // handleDraftFleets={handleDraftFleets}
          />
        )}
        <Typography variant="h4" sx={{ my: 2 }}>
          Transporter address details
        </Typography>
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
                  disabled={props.isEdit}
                  inputRef={ref}
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
              render={({ field: { ref, ...field } }) => (
                <TextField
                  {...field}
                  label="Address Line 2"
                  disabled={props.isEdit}
                  inputRef={ref}
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
              render={({ field: { ref, ...field } }) => (
                <TextField
                  {...field}
                  label="City*"
                  variant="filled"
                  disabled={props.isEdit}
                  inputRef={ref}
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
              render={({ field: { ref, ...field } }) => (
                <TextField
                  {...field}
                  label="Pin Code*"
                  variant="filled"
                  disabled={props.isEdit}
                  inputRef={ref}
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
                      handleCorporateStatePopulate(newValue.value, 'corporate');
                      // setChecked(false);
                      checkAddressIsSameOrNot();
                      trigger('corporate_country');
                    }}
                    disabled={props.isEdit}
                    popupIcon={<KeyboardArrowDownIcon />}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country*"
                        variant="filled"
                        fullWidth
                        size="small"
                        inputRef={ref}
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
              render={({ field: { ref, ...field } }) => (
                <Autocomplete
                  {...field}
                  options={allStatesForCorporate}
                  disabled={enableAllStatesForCorporate || props.isEdit}
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
                      variant="filled"
                      inputRef={ref}
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
                disabled={props.isEdit}
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
              render={({ field: { ref, ...field } }) => (
                <TextField
                  {...field}
                  label="Address Line 1*"
                  variant="filled"
                  fullWidth
                  size="small"
                  disabled={props.isEdit}
                  inputRef={ref}
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
                  size="small"
                  disabled={props.isEdit}
                  inputRef={ref}
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
              render={({ field: { ref, ...field } }) => (
                <TextField
                  {...field}
                  label="City*"
                  variant="filled"
                  fullWidth
                  disabled={props.isEdit}
                  inputRef={ref}
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
              render={({ field: { ref, ...field } }) => (
                <TextField
                  {...field}
                  label="Pin Code*"
                  variant="filled"
                  fullWidth
                  disabled={props.isEdit}
                  inputRef={ref}
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
                    disabled={props.isEdit}
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
                        variant="filled"
                        fullWidth
                        inputRef={ref}
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
              render={({ field: { ref, ...field } }) => (
                <Autocomplete
                  {...field}
                  options={allStatesForBilling}
                  disabled={enableAllStatesForBilling || props.isEdit}
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
                      label="State*"
                      variant="filled"
                      fullWidth
                      inputRef={ref}
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

        <Typography
          color={'#2D3440'}
          sx={{ my: 2, fontWeight: 600, fontSize: '18px' }}
        >
          Transporter logo
        </Typography>
        <Grid container spacing={3}>
          {!props.isEdit && (
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
                  height: '275px',
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
          )}
          <Grid item xs={12} sm={12} md={props.isEdit ? 12 : 6}>
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
                borderRadius: '4px',
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
                          src={`${baseUrl}/service/file/download/${props?.modalTransporterData?.trnsp_id}/logo/${companyLogo}`}
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
          <Grid item md={12}>
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
        <SelectKam
          roleId={roleId}
          transId={props?.modalTransporterData?.trnsp_id}
          isEdited={props.isEdit}
          handleKamUsers={handleKamUsers}
          kamDataForEdit={kamDataForEdit}
          handleKamEdit={handleKamEdit}
          users={users}
          onCancelEdit={onCancelEdit}
        />
        {users.length > 0 && (
          <KamList
            users={users}
            handleClickEdit={handleClickEdit}
            handleClickDelete={handleClickDelete}
          />
        )}
      </Box>
      <DialogActions>
        <Button
          onClick={() => props.onClose()}
          variant="outlined"
          sx={{
            border: '1px solid #8A919D',
            fontWeight: 600,
            color: '#8A919D',
            size: '12px',
          }}
        >
          CANCEL
        </Button>
        <Button type="submit" variant="contained" color="primary">
          SAVE TRANSPORTER
        </Button>
      </DialogActions>
    </form>
  );
}
