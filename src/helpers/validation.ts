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
  inviteCode: Yup.string().required('invite code is required'),
});

export const forgotPasswordValidationSchema = Yup.object().shape({
  email: format.email,
});

export const resetPasswordValidationSchema = Yup.object().shape({
  password: format.password,
  confirmPassword: Yup.string().required('enter password again'),
});

export const singleEmployeeUploadValidationSchema = Yup.object().shape({
  email: Yup.string().email(),
  firstname: format.firstname,
  lastname: format.lastname,
  salary: Yup.string().required('Salary is Required'),
  phoneNumber: Yup.string(),
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

export const fundWalletValidationSchema = Yup.object().shape({
  amount: Yup.string().required('amount is required'),
  channel: Yup.string().required('select payment method'),
});

export const savePayrollValidationSchema = Yup.object().shape({
  payDate: Yup.string().required('pay date is required'),
  proRateMonth: Yup.string().required('select a prorate month'),
  year: Yup.number().required('select a prorate month'),
  cycle: Yup.number().required('enter payroll cycle'),
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
            phoneNumber: format.phonenumber,
            salary: Yup.string().required('Salary is required'),
          })
          .required(),
      )
      .min(1, 'at least one employee')
      .required(),
  })
  .required();

export const EmployeeGroupValidation = Yup.object()
  .shape({
    name: Yup.string().required('Group name is required'),
    description: Yup.string(),
    commonSalary: Yup.string(),
  })
  .required();

export const EmployeeTaxGroupValidation = Yup.object()
  .shape({
    name: Yup.string().required('Group name is required'),
    description: Yup.string(),
    meta: Yup.object().shape({
      salaryBreakdown: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required('Name is required'),
          value: Yup.string().required('Value is required'),
        }),
      ),
      customTaxRelief: Yup.array().of(
        Yup.object().shape({
          amount: Yup.string().required(),
          name: Yup.string().required(),
        }),
      ),
    }),
  })
  .required();

export const SalaryAddonValidation = Yup.object().shape({
  name: Yup.string().required('Addon name is required'),
  description: Yup.string(),
  type: Yup.string().required('Addon type is required'),
  amount: Yup.string().when(
    ['type'],
    (
      type: string,
      schema: Yup.StringSchema<
        string | undefined,
        Record<string, any>,
        string | undefined
      >,
    ) => {
      if (type === 'prorate') return schema;

      return schema.required('Amount is required');
    },
  ),
  payrollCycle: Yup.string()
    .matches(
      /^(all|[1-9]+[0-9]*)$/gi,
      '`all` for all payroll cycles or a positive number from 1 up',
    )
    .required('payroll cycle is required'),
  frequency: Yup.string().required('Frequency is required'),
  startYear: Yup.string().when(
    ['frequency'],
    (
      frequency: string,
      schema: Yup.StringSchema<
        string | undefined,
        Record<string, any>,
        string | undefined
      >,
    ) => {
      if (frequency !== 'recurring') return schema;

      return schema.required('Start year is required');
    },
  ),
  dates: Yup.array()
    .of(
      Yup.object().shape({
        month: Yup.string().required(),
        year: Yup.number(),
        days: Yup.lazy((value) => {
          if (value === undefined) return Yup.mixed();
          if (
            (Array.isArray(value) ? value : [value]).some(
              (v: string) => typeof v !== 'string',
            )
          ) {
            return Yup.object().required();
          }
          return Yup.array();
        }),
      }),
    )
    .required()
    .min(1),
});

export const CreateAdministratorValidation = Yup.object().shape({
  role: Yup.string(),
  user: Yup.string(),
  email: Yup.string().email().required('Email is required'),
  name: Yup.string().required('Name is required'),
});

export const CreateRoleValidation = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  permissions: Yup.array()
    .of(Yup.string())
    .min(1, 'Select at least one permission'),
});

export const RequestAccessValidation = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email().required('Email is required'),
});

export const UpdateSalaryValidation = Yup.object().shape({
  salary: Yup.number().min(10).required('a salary is required'),
});
