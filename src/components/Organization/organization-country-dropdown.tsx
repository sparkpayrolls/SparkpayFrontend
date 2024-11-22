import { useState } from 'react';
import { SelectInput } from '../Input/seletct-input';

const CountryDropdown = () => {
  const [selectedCountry, setSelectedCountry] = useState('');

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

  const handleCountryChange = (event: any) => {
    const country = event.target.value;
    setSelectedCountry(country);
    console.log('Selected country:', country);
  };

  return (
    <div className="country-dropdown-input">
      <div className='country-dropdown-container'>
        <SelectInput
          label=""
          name="country"
          placeholder="Select Country"
          onChange={handleCountryChange}  
          value={selectedCountry}
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
  );
};

export default CountryDropdown;
