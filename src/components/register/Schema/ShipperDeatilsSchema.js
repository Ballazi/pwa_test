import * as yup from 'yup';

export const ShipperDetailsSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  contactPerson: yup
    .string()
    .min(3, 'Contact person must be at least 3 characters')
    .max(30, 'Contact person cannot be more than 30 characters')
    .required('Contact person is required'),
  contactNumber: yup
    .string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid contact number')
    .required('Contact number is required'),
  panNumber: yup
    .string()
    .matches(/^([A-Za-z]{5}\d{4}[A-Za-z]{1})$/, 'Enter a valid PAN number')
    .required('PAN number is required'),
  tanNumber: yup
    .string()
    .min(2, 'Enter TAN and remove this later')
    // .matches(/^([A-Za-z]{4}\d{5}[A-Za-z]{1})$/, "Enter a valid TAN number")
    .required('TAN number is required'),
  gstNumber: yup.string().when({
    is: (val) => val.length > 0,
    then: () => yup.string().min(2, 'Please provide valid GST number!'),
    // .matches(
    //   /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/,
    //   "Enter a valid GST number"
    // ),
  }),
  incorporateCertificateNumber: yup.string().when({
    is: (val) => val.length > 0,
    then: () => yup.string().min(2, 'Please provide valid incorporate number'),
  }),
  cinNumber: yup.string().when({
    is: (val) => val.length > 0,
    then: () => yup.string().min(2, 'Please provide valid CIN number'),
    // .matches(
    //   /^[L|U]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,
    //   "Enter a valid CIN number"
    // ),
  }),
  tradeLicense: yup.string().when({
    is: (val) => val.length > 0,
    then: () => yup.string().min(2, 'Please provide valid CIN number'),
  }),
  corporateAddressLine1: yup.string().required('Address line 1 is required'),
  corporateAddressLine2: yup.string(),
  corporateCity: yup.string().required('City is required'),
  corporatePinCode: yup.string().required('Pincode is required'),
  corporateCountry: yup.string().required('Country is required'),
  corporateState: yup.string().required('State is required'),
  billingAddressLine1: yup.string().required('Address line 1 is required'),
  billingAddressLine2: yup.string(),
  billingCity: yup.string().required('City is required'),
  billingPinCode: yup.string().required('Pincode is required'),
  billingCountry: yup.string().required('Country is required'),
  billingState: yup.string().required('State is required'),
  adminName: yup.string().required('Admin name is required!'),
  adminContactNumber: yup
    .string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid contact number')
    .required('Admin contact number is required'),
  adminEmail: yup.string().when({
    is: (val) => val.length > 0,
    then: () => yup.string().email('Invalid email'),
  }),
});
