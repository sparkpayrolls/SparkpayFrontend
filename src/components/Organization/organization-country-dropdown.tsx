import { Formik } from 'formik';
import { SelectInput } from '../Input/seletct-input';

const CountryDropdown = (props: any) => {
  const { handleSubmit } = props;

  const initialValues = {
    country: '',
  };
  const countries = [
    {
      name: 'Nigeria',
      iso2: 'NG',
      flag: 'https://cdn.britannica.com/68/5068-050-53E22285/Flag-Nigeria.jpg',
      id: '1',
    },
    {
      name: 'Ghana',
      iso2: 'GH',
      flag: 'https://cdn.britannica.com/54/5054-050-8EC06097/Flag-Ghana.jpg',
      id: '2',
    },
    {
      name: 'Kenya',
      iso2: 'KE',
      flag: 'https://cdn.britannica.com/15/15-050-B075588A/Flag-Kenya.jpg',
      id: '3',
    },
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
                onChange={(event) => {
                  handleChange(event);
                  console.log('Selected country:', event.target.value);
                }}
                value={values.country}
                options={countries.map((country) => ({
                  value: country.iso2,
                  label: (
                    <div className="dropdown-option">
                      <img
                        src={country.flag}
                        alt={`${country.name} flag`}
                        className="country-flag"
                        width={20}
                        height={20}
                      />
                      <span>{country.name}</span>
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
