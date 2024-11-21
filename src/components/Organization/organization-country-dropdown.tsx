import { Formik } from 'formik';
import Image from 'next/image';
import { SelectInput } from '../Input/seletct-input';

const CountryDropdown = (props:any) => {
  const { handleSubmit } = props;

  const initialValues = {
    country: '',
  };
  const countries = [
    { label: 'Nigeria', value: 'Nigeria', imageUrl: '/svgs/NigeriaLogo.svg' },
    { label: 'Kenya', value: 'Kenya', imageUrl: '/svgs/kenya.svg' },
    { label: 'Ghana', value: 'Ghana', imageUrl: '/svgs/Ghana.svg' },
    { label: 'Cameroon', value: 'CM', imageUrl: '/svgs/NigeriaLogo.svg' },
    { label: 'Algeria', value: 'DZ', imageUrl: '/svgs/Kenya.svg' },
  ];

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, handleBlur, handleChange, handleSubmit }) => (
        <form
          className="country-dropdown-input"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="country-dropdown-container">
            <div>
              <SelectInput
                label=""
                name="country"
                placeholder="Select Country"
                onBlur={handleBlur}
                onChange={(e) => {
                handleChange(e);
                }}
                value={values.country}
                options={countries.map((country) => ({
                  value: country.value,
                  label: (
                    <div className="dropdown-option">
                      <Image
                        src={country.imageUrl}
                        alt={country.label}
                        width={20}
                        height={20}
                      />
                      <span>{country.label}</span>
                    </div>
                  ),
                }))}
                displayValue="label"
                actualValue="value"
                className="country-dropdown-select"
              />
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default CountryDropdown;
