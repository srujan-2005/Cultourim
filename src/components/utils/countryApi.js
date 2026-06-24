
import { toast } from '@/hooks/use-toast';

export const fetchCountryData = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    
    if (!response.ok) {
      throw new Error('Failed to fetch country data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching country data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch country data. Using cached data instead.",
      variant: "destructive",
    });
    return [];
  }
};

// Helper function to get currency symbol for a country
export const getCurrencySymbol = (countryData) => {
  if (!countryData || !countryData.currencies) {
    return '$';
  }
  
  const currencyCode = Object.keys(countryData.currencies)[0];
  return countryData.currencies[currencyCode]?.symbol || '$';
};

// Helper function to format currency based on country
export const formatCurrency = (amount, countryData) => {
  const symbol = getCurrencySymbol(countryData);
  return `${symbol}${amount.toLocaleString()}`;
};

// Exporting CountryType object to document properties we're using
export const CountryType = {
  currency: '',
  currencyCode: '',
  currencySymbol: '',
  flagUrl: '',
  capital: '',
  languages: [],
  population: 0,
  region: '',
  exchangeRate: 0
};