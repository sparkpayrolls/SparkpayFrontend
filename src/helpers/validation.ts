import * as Yup from 'yup';

export const format = {
  email: Yup.string()
    .email('Please enter valid email')
    .required('email is required'),
  password: Yup.string().required('password is required'),
  firstname: Yup.string().required('firstname is required'),
  lastname: Yup.string().required('lastname is required'),
  country: Yup.string().required('country is required'),
  phonenumber: Yup.string().required('phonenumber is required'),
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
