import * as Yup from 'yup';

export const format = {
  email: Yup.string()
    .email('Please enter valid Email')
    .required('Email is Required'),
  password: Yup.string().required('Password is Required'),
  firstname: Yup.string().required('Firstname is Required'),
  lastname: Yup.string().required('Lastname is Required'),
  country: Yup.string().required('Country is Required'),
  phonenumber: Yup.string().required('Phone Number is Required'),
};

export const loginValidationSchema = Yup.object().shape({
  email: format.email,
  password: format.password,
});

export const signupValidationSchema = Yup.object().shape({
  firstname: format.firstname,
  lastname: format.lastname,
  country: format.country,
  email: format.email,
  password: format.password,
});

export const forgotPasswordValidationSchema = Yup.object().shape({
  email: format.email,
});

export const resetPasswordValidationSchema = Yup.object().shape({
  password: format.password,
  confirmPassword: Yup.string().required('enter password again'),
});

export const singleEmployeeUploadValidationSchema = Yup.object().shape({
  email: format.email,
  firstname: format.firstname,
  lastname: format.lastname,
  salary: Yup.string().required('salary is required'),
});

export const createOrganizationValidationSchema = Yup.object().shape({
  email: format.email,
  name: format.firstname,
  country: format.country,
  phonenumber: format.phonenumber,
});

export const fundWalletValidationSchema = Yup.object().shape({
  amount: Yup.string().required('amount is required'),
  channel: Yup.string().required('select payment method'),
});

export const savePayrollValidationSchema = Yup.object().shape({
  payDate: Yup.string().required('pay date is required'),
  proRateMonth: Yup.string().required('select a pro rate month'),
});
export const EmployeeOnboardingValidationSchema = Yup.object().shape({
  country: format.country,
  accountNumber: Yup.string().required('Account Number is Required'),
  payoutMethod: Yup.string().required('Payout Method is required'),
  bankName: Yup.string().required('Bank Name is required'),
});
