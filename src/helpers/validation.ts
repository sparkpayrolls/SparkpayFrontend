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
  salary: Yup.string().required('Salary is Required'),
  phoneNumber: Yup.string().required('Phone Number is Required'),
});

export const bulkEmployeeFileUploadValidationSchema = Yup.object().shape({
  file: Yup.string().required('please upload an xlsx file to proceed'),
});

export const createOrganizationValidationSchema = Yup.object().shape({
  email: format.email,
  name: Yup.string().required('Company name is required'),
  phonenumber: format.phonenumber,
  country: Yup.string().required('Country is required'),
});

export const EditOrganisationDetailsValidationSchema = Yup.object().shape({
  email: format.email,
  name: Yup.string().required('Company name is required'),
  phonenumber: format.phonenumber,
  logo: Yup.string().optional(),
  salaryBreakdown: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        value: Yup.string().required('Value is required'),
      }),
    )
    .min(1)
    .required('At least, one item and should sum up to 100%'),
});

export const userChangePasswordValidationSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required'),
  newPassword: Yup.string().required('New password is required'),
  confirmPassword: Yup.string().required('Enter new password again'),
});

export const addonBonusValidationSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required'),
  newPassword: Yup.string().required('New password is required'),
  confirmPassword: Yup.string().required('Enter new password again'),
  country: format.country
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
  payoutMethod: Yup.string().required('Payout Method is required'),
  payoutMethodMeta: Yup.mixed().required(),
});

export const bankPayoutMethodMetaValidationSchema = Yup.object().shape({
  bankId: Yup.string().required('Bank name is required'),
  accountNumber: Yup.string()
    .min(6, 'Account number should be at least 6 digits long')
    .required('Account number is required'),
});

export const UserProfileValidationSchema = Yup.object().shape({
  firstname: format.firstname,
  lastname: format.lastname,
  phonenumber: format.phonenumber.optional(),
});

export const TaxInformationValidationSchema = Yup.object().shape({
  taxId: Yup.string(),
  state: Yup.string(),
  taxOfficeNumber: Yup.string(),
});

export const BulkEmployeeAddValidation = Yup.object()
  .shape({
    employees: Yup.array()
      .of(
        Yup.object()
          .shape({
            firstname: format.firstname,
            lastname: format.lastname,
            email: format.email,
            salary: Yup.string().required('Salary is required'),
          })
          .required(),
      )
      .min(1, 'at least one employee')
      .required(),
  })
  .required();
