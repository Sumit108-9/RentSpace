import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Comprehensive city-to-pincode mapping for supported cities
export const CITY_PINCODE_DATA = {
  // Tier 1 Cities
  'Bengaluru': {
    state: 'Karnataka',
    pincodes: ['560001', '560002', '560003', '560004', '560005', '560006', '560007', '560008', '560009', '560010'],
    pincodeRanges: [{ start: 560000, end: 562999 }],
    samplePincode: '560001'
  },
  'Mumbai': {
    state: 'Maharashtra',
    pincodes: ['400001', '400002', '400003', '400004', '400005', '400006', '400007', '400008', '400009', '400010'],
    pincodeRanges: [{ start: 400000, end: 401999 }],
    samplePincode: '400001'
  },
  'Delhi': {
    state: 'Delhi',
    pincodes: ['110001', '110002', '110003', '110004', '110005', '110006', '110007', '110008', '110009', '110010'],
    pincodeRanges: [{ start: 110000, end: 110999 }],
    samplePincode: '110001'
  },
  'Hyderabad': {
    state: 'Telangana',
    pincodes: ['500001', '500002', '500003', '500004', '500005', '500006', '500007', '500008', '500009', '500010'],
    pincodeRanges: [{ start: 500000, end: 501999 }],
    samplePincode: '500001'
  },
  'Chennai': {
    state: 'Tamil Nadu',
    pincodes: ['600001', '600002', '600003', '600004', '600005', '600006', '600007', '600008', '600009', '600010'],
    pincodeRanges: [{ start: 600000, end: 602999 }],
    samplePincode: '600001'
  },
  'Kolkata': {
    state: 'West Bengal',
    pincodes: ['700001', '700002', '700003', '700004', '700005', '700006', '700007', '700008', '700009', '700010'],
    pincodeRanges: [{ start: 700000, end: 701999 }],
    samplePincode: '700001'
  },
  // Tier 2 Cities
  'Pune': {
    state: 'Maharashtra',
    pincodes: ['411001', '411002', '411003', '411004', '411005', '411006', '411007', '411008', '411009', '411010'],
    pincodeRanges: [{ start: 411000, end: 413999 }],
    samplePincode: '411001'
  },
  'Gurugram': {
    state: 'Haryana',
    pincodes: ['122001', '122002', '122003', '122004', '122005', '122006', '122007', '122008', '122009', '122010'],
    pincodeRanges: [{ start: 122000, end: 122999 }],
    samplePincode: '122001'
  },
  'Noida': {
    state: 'Uttar Pradesh',
    pincodes: ['201301', '201302', '201303', '201304', '201305', '201306', '201307', '201308', '201309', '201310'],
    pincodeRanges: [{ start: 201300, end: 201399 }],
    samplePincode: '201301'
  },
  'Jaipur': {
    state: 'Rajasthan',
    pincodes: ['302001', '302002', '302003', '302004', '302005', '302006', '302007', '302008', '302009', '302010'],
    pincodeRanges: [{ start: 302000, end: 303999 }],
    samplePincode: '302001'
  },
  'Ahmedabad': {
    state: 'Gujarat',
    pincodes: ['380001', '380002', '380003', '380004', '380005', '380006', '380007', '380008', '380009', '380010'],
    pincodeRanges: [{ start: 380000, end: 381999 }],
    samplePincode: '380001'
  },
  'Chandigarh': {
    state: 'Chandigarh',
    pincodes: ['160001', '160002', '160003', '160004', '160005', '160006', '160007', '160008', '160009', '160010'],
    pincodeRanges: [{ start: 160000, end: 160999 }],
    samplePincode: '160001'
  },
  'Ghaziabad': {
    state: 'Uttar Pradesh',
    pincodes: ['201001', '201002', '201003', '201004', '201005', '201006', '201007', '201008', '201009', '201010'],
    pincodeRanges: [{ start: 201000, end: 201299 }],
    samplePincode: '201001'
  },
  'Gandhinagar': {
    state: 'Gujarat',
    pincodes: ['382001', '382002', '382003', '382004', '382005', '382006', '382007', '382008', '382009', '382010'],
    pincodeRanges: [{ start: 382000, end: 383999 }],
    samplePincode: '382001'
  },
  'Indore': {
    state: 'Madhya Pradesh',
    pincodes: ['452001', '452002', '452003', '452004', '452005', '452006', '452007', '452008', '452009', '452010'],
    pincodeRanges: [{ start: 452000, end: 453999 }],
    samplePincode: '452001'
  },
  'Faridabad': {
    state: 'Haryana',
    pincodes: ['121001', '121002', '121003', '121004', '121005', '121006', '121007', '121008', '121009', '121010'],
    pincodeRanges: [{ start: 121000, end: 121999 }],
    samplePincode: '121001'
  },
  'Lucknow': {
    state: 'Uttar Pradesh',
    pincodes: ['226001', '226002', '226003', '226004', '226005', '226006', '226007', '226008', '226009', '226010'],
    pincodeRanges: [{ start: 226000, end: 227999 }],
    samplePincode: '226001'
  },
  'Coimbatore': {
    state: 'Tamil Nadu',
    pincodes: ['641001', '641002', '641003', '641004', '641005', '641006', '641007', '641008', '641009', '641010'],
    pincodeRanges: [{ start: 641000, end: 642999 }],
    samplePincode: '641001'
  },
  'Kochi': {
    state: 'Kerala',
    pincodes: ['682001', '682002', '682003', '682004', '682005', '682006', '682007', '682008', '682009', '682010'],
    pincodeRanges: [{ start: 682000, end: 683999 }],
    samplePincode: '682001'
  },
  'Bhopal': {
    state: 'Madhya Pradesh',
    pincodes: ['462001', '462002', '462003', '462004', '462005', '462006', '462007', '462008', '462009', '462010'],
    pincodeRanges: [{ start: 462000, end: 464999 }],
    samplePincode: '462001'
  },
  'Vadodara': {
    state: 'Gujarat',
    pincodes: ['390001', '390002', '390003', '390004', '390005', '390006', '390007', '390008', '390009', '390010'],
    pincodeRanges: [{ start: 390000, end: 392999 }],
    samplePincode: '390001'
  },
  'Kanpur': {
    state: 'Uttar Pradesh',
    pincodes: ['208001', '208002', '208003', '208004', '208005', '208006', '208007', '208008', '208009', '208010'],
    pincodeRanges: [{ start: 208000, end: 209999 }],
    samplePincode: '208001'
  },
  'Pondicherry': {
    state: 'Puducherry',
    pincodes: ['605001', '605002', '605003', '605004', '605005', '605006', '605007', '605008', '605009', '605010'],
    pincodeRanges: [{ start: 605000, end: 605999 }],
    samplePincode: '605001'
  },
  'Vijayawada': {
    state: 'Andhra Pradesh',
    pincodes: ['520001', '520002', '520003', '520004', '520005', '520006', '520007', '520008', '520009', '520010'],
    pincodeRanges: [{ start: 520000, end: 521999 }],
    samplePincode: '520001'
  },
  'Mysuru': {
    state: 'Karnataka',
    pincodes: ['570001', '570002', '570003', '570004', '570005', '570006', '570007', '570008', '570009', '570010'],
    pincodeRanges: [{ start: 570000, end: 571999 }],
    samplePincode: '570001'
  },
  'Meerut': {
    state: 'Uttar Pradesh',
    pincodes: ['250001', '250002', '250003', '250004', '250005', '250006', '250007', '250008', '250009', '250010'],
    pincodeRanges: [{ start: 250000, end: 251999 }],
    samplePincode: '250001'
  },
  'Sonipat': {
    state: 'Haryana',
    pincodes: ['131001', '131002', '131003', '131004', '131005', '131006', '131007', '131008', '131009', '131010'],
    pincodeRanges: [{ start: 131000, end: 131999 }],
    samplePincode: '131001'
  },
  'Hosur': {
    state: 'Tamil Nadu',
    pincodes: ['635109', '635110', '635111', '635112', '635113', '635114', '635115', '635116', '635117', '635118'],
    pincodeRanges: [{ start: 635100, end: 635199 }],
    samplePincode: '635109'
  },
  'Nashik': {
    state: 'Maharashtra',
    pincodes: ['422001', '422002', '422003', '422004', '422005', '422006', '422007', '422008', '422009', '422010'],
    pincodeRanges: [{ start: 422000, end: 423999 }],
    samplePincode: '422001'
  },
  'Patiala': {
    state: 'Punjab',
    pincodes: ['147001', '147002', '147003', '147004', '147005', '147006', '147007', '147008', '147009', '147010'],
    pincodeRanges: [{ start: 147000, end: 148999 }],
    samplePincode: '147001'
  },
  'Panipat': {
    state: 'Haryana',
    pincodes: ['132101', '132102', '132103', '132104', '132105', '132106', '132107', '132108', '132109', '132110'],
    pincodeRanges: [{ start: 132100, end: 132199 }],
    samplePincode: '132101'
  },
  'Karnal': {
    state: 'Haryana',
    pincodes: ['132001', '132002', '132003', '132004', '132005', '132006', '132007', '132008', '132009', '132010'],
    pincodeRanges: [{ start: 132000, end: 132099 }],
    samplePincode: '132001'
  },
  'Ambala': {
    state: 'Haryana',
    pincodes: ['133001', '133002', '133003', '133004', '133005', '133006', '133007', '133008', '133009', '133010'],
    pincodeRanges: [{ start: 133000, end: 134999 }],
    samplePincode: '133001'
  }
};

// City categories for UI organization
export const POPULAR_CITIES = [
  { name: 'Bengaluru', icon: '🏢' },
  { name: 'Mumbai', icon: '🌆' },
  { name: 'Hyderabad', icon: '🏰' },
  { name: 'Pune', icon: '🏛️' },
  { name: 'Delhi', icon: '🕌' },
  { name: 'Gurugram', icon: '🏙️' },
  { name: 'Noida', icon: '🏢' },
  { name: 'Chennai', icon: '🏖️' }
];

export const OTHER_CITIES = [
  'Kolkata', 'Jaipur', 'Chandigarh', 'Ghaziabad', 'Gandhinagar', 
  'Ahmedabad', 'Indore', 'Faridabad', 'Lucknow', 'Coimbatore', 
  'Kochi', 'Bhopal', 'Vadodara', 'Kanpur', 'Pondicherry', 
  'Vijayawada', 'Mysuru', 'Meerut', 'Sonipat', 'Hosur', 
  'Nashik', 'Patiala', 'Panipat', 'Karnal', 'Ambala'
];

// Validation utilities
export const validatePincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

export const findCityByPincode = (pincode) => {
  if (!validatePincode(pincode)) return null;
  
  const pincodeNum = parseInt(pincode, 10);
  
  for (const [city, data] of Object.entries(CITY_PINCODE_DATA)) {
    // Check if pincode is in known pincodes list
    if (data.pincodes.includes(pincode)) {
      return city;
    }
    // Check if pincode is in any of the ranges
    for (const range of data.pincodeRanges) {
      if (pincodeNum >= range.start && pincodeNum <= range.end) {
        return city;
      }
    }
  }
  return null;
};

export const isCitySupported = (city) => {
  return CITY_PINCODE_DATA.hasOwnProperty(city);
};

export const getCitySamplePincode = (city) => {
  return CITY_PINCODE_DATA[city]?.samplePincode || null;
};

export const getCityState = (city) => {
  return CITY_PINCODE_DATA[city]?.state || null;
};

// Create context
const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocationState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('deliveryLocation');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved location:', e);
        }
      }
    }
    // Default location
    return {
      city: 'Bengaluru',
      pincode: '560001',
      state: 'Karnataka',
      isGeolocated: false
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGeolocating, setIsGeolocating] = useState(false);

  // Persist location to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('deliveryLocation', JSON.stringify(location));
    }
  }, [location]);

  // Set location by city name
  const setLocationByCity = useCallback((cityName) => {
    if (!isCitySupported(cityName)) {
      setError(`Sorry, we don't deliver to ${cityName} yet.`);
      return false;
    }

    const cityData = CITY_PINCODE_DATA[cityName];
    setLocationState({
      city: cityName,
      pincode: cityData.samplePincode,
      state: cityData.state,
      isGeolocated: false
    });
    setError(null);
    return true;
  }, []);

  // Set location by pincode
  const setLocationByPincode = useCallback((pincode) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate pincode format
      if (!validatePincode(pincode)) {
        setError('Please enter a valid 6-digit pincode');
        setIsLoading(false);
        return false;
      }

      // Find city by pincode
      const city = findCityByPincode(pincode);
      
      if (city) {
        const cityData = CITY_PINCODE_DATA[city];
        setLocationState({
          city,
          pincode,
          state: cityData.state,
          isGeolocated: false
        });
        setIsLoading(false);
        return true;
      } else {
        // Pincode is valid format but city not in supported list
        setError('We are checking service availability in your area. Please select a nearby city from the list.');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
      return false;
    }
  }, []);

  // Browser geolocation
  const detectLocation = useCallback(() => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        resolve(false);
        return;
      }

      setIsGeolocating(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would use reverse geocoding API here
          // For now, we'll just pick the nearest major city based on rough coordinates
          const { latitude, longitude } = position.coords;
          
          // Rough city detection based on coordinates
          let detectedCity = null;
          
          // Bengaluru region (approx)
          if (latitude >= 12.8 && latitude <= 13.2 && longitude >= 77.4 && longitude <= 77.8) {
            detectedCity = 'Bengaluru';
          }
          // Mumbai region (approx)
          else if (latitude >= 18.8 && latitude <= 19.3 && longitude >= 72.7 && longitude <= 73.1) {
            detectedCity = 'Mumbai';
          }
          // Delhi region (approx)
          else if (latitude >= 28.4 && latitude <= 28.9 && longitude >= 76.8 && longitude <= 77.4) {
            detectedCity = 'Delhi';
          }
          // Hyderabad region (approx)
          else if (latitude >= 17.2 && latitude <= 17.6 && longitude >= 78.2 && longitude <= 78.6) {
            detectedCity = 'Hyderabad';
          }
          // Chennai region (approx)
          else if (latitude >= 12.8 && latitude <= 13.3 && longitude >= 80.1 && longitude <= 80.3) {
            detectedCity = 'Chennai';
          }
          // Pune region (approx)
          else if (latitude >= 18.4 && latitude <= 18.7 && longitude >= 73.7 && longitude <= 74.0) {
            detectedCity = 'Pune';
          }
          // Kolkata region (approx)
          else if (latitude >= 22.4 && latitude <= 22.8 && longitude >= 88.2 && longitude <= 88.5) {
            detectedCity = 'Kolkata';
          }
          // Ahmedabad region (approx)
          else if (latitude >= 22.9 && latitude <= 23.2 && longitude >= 72.4 && longitude <= 72.7) {
            detectedCity = 'Ahmedabad';
          }
          // Jaipur region (approx)
          else if (latitude >= 26.8 && latitude <= 27.0 && longitude >= 75.6 && longitude <= 75.9) {
            detectedCity = 'Jaipur';
          }
          // Chandigarh region (approx)
          else if (latitude >= 30.6 && latitude <= 30.9 && longitude >= 76.6 && longitude <= 76.9) {
            detectedCity = 'Chandigarh';
          }
          
          setIsGeolocating(false);
          
          if (detectedCity && isCitySupported(detectedCity)) {
            const success = setLocationByCity(detectedCity);
            resolve(success);
          } else {
            setError('Unable to detect your exact city. Please select manually from the list.');
            resolve(false);
          }
        },
        (err) => {
          setIsGeolocating(false);
          let errorMsg = 'Unable to detect your location';
          if (err.code === 1) {
            errorMsg = 'Location permission denied. Please enable location access or select manually.';
          } else if (err.code === 2) {
            errorMsg = 'Location unavailable. Please select manually from the list.';
          } else if (err.code === 3) {
            errorMsg = 'Location detection timed out. Please select manually.';
          }
          setError(errorMsg);
          resolve(false);
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    });
  }, [setLocationByCity]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    location,
    setLocationByCity,
    setLocationByPincode,
    detectLocation,
    isLoading,
    isGeolocating,
    error,
    clearError,
    validatePincode,
    findCityByPincode,
    isCitySupported,
    getCitySamplePincode,
    getCityState,
    CITY_PINCODE_DATA,
    POPULAR_CITIES,
    OTHER_CITIES
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export default LocationContext;
