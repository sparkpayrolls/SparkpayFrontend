import Image from 'next/image';
import { SelectInput } from '../Input/seletct-input';
import { useAppSelector, useAppDispatch } from 'src/redux/hooks';
import { commitSelectedCountry } from '../../redux/slices/selected-country/selected-country.slice';

const CountryDropdown = () => {
  const { countries, selectedCountry } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const handleCountryChange = (event: any) => {
    const selectedIso2 = event.target.value;
    const country = countries.find((country) => country.iso2 === selectedIso2);
    dispatch(commitSelectedCountry(country || null));
  };

  return (
    <div className="country-dropdown-input">
      <div className="country-dropdown-container">
        <SelectInput
          label=""
          name="country"
          placeholder="Select Country"
          onChange={handleCountryChange}
          value={selectedCountry ? selectedCountry.iso2 : ''}
          options={countries.map((country) => ({
            value: country.iso2,
            label: (
              <div className="dropdown-option">
                <Image
                  src={country.flag}
                  className="country-flag"
                  width={23}
                  height={5}
                  alt={`${country.name} flag`}
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
  );
};

export default CountryDropdown;
