import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Penny() {
  const [budget, setBudget] = useState('');
  const [country, setCountry] = useState('');
  const [days, setDays] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Added step state to track current page: 1=input, 2=results

  const countryData = {
    'japan': { accommodation: 80, food: 40, transportation: 15, attractions: 25, misc: 10, costIndex: 83, currency: 'JPY', language: 'Japanese', bestTimeToVisit: 'March-May & October-November', visa: 'Required for many countries', tipping: 'Not customary', safety: 'Very safe' },
    'thailand': { accommodation: 30, food: 15, transportation: 5, attractions: 10, misc: 5, costIndex: 43, currency: 'THB', language: 'Thai', bestTimeToVisit: 'November-February', visa: 'Required for many countries', tipping: 'Not expected but appreciated', safety: 'Generally safe' },
    'france': { accommodation: 100, food: 45, transportation: 20, attractions: 30, misc: 15, costIndex: 89, currency: 'EUR', language: 'French', bestTimeToVisit: 'April-June & September-October', visa: 'Schengen visa for non-EU', tipping: '5-10% in restaurants', safety: 'Generally safe' },
    'usa': { accommodation: 120, food: 50, transportation: 25, attractions: 35, misc: 20, costIndex: 100, currency: 'USD', language: 'English', bestTimeToVisit: 'May-September', visa: 'Required for many countries', tipping: '15-20% expected', safety: 'Varies by location' },
    'mexico': { accommodation: 40, food: 20, transportation: 8, attractions: 15, misc: 7, costIndex: 50, currency: 'MXN', language: 'Spanish', bestTimeToVisit: 'November-April', visa: 'Required for many countries', tipping: '10-15% in restaurants', safety: 'Exercise caution in certain areas' },
    'italy': { accommodation: 90, food: 40, transportation: 15, attractions: 25, misc: 10, costIndex: 78, currency: 'EUR', language: 'Italian', bestTimeToVisit: 'April-June & September-October', visa: 'Schengen visa for non-EU', tipping: 'Not required but appreciated', safety: 'Generally safe' },
    'australia': { accommodation: 110, food: 45, transportation: 20, attractions: 30, misc: 15, costIndex: 95, currency: 'AUD', language: 'English', bestTimeToVisit: 'September-November & March-May', visa: 'Required for most countries', tipping: 'Not expected', safety: 'Very safe' },
    'germany': { accommodation: 85, food: 40, transportation: 15, attractions: 25, misc: 10, costIndex: 80, currency: 'EUR', language: 'German', bestTimeToVisit: 'May-September', visa: 'Schengen visa for non-EU', tipping: '5-10% in restaurants', safety: 'Very safe' },
    'uk': { accommodation: 120, food: 50, transportation: 25, attractions: 35, misc: 20, costIndex: 98, currency: 'GBP', language: 'English', bestTimeToVisit: 'May-September', visa: 'Required for many countries', tipping: '10-15% in restaurants', safety: 'Generally safe' },
    'canada': { accommodation: 100, food: 45, transportation: 20, attractions: 30, misc: 15, costIndex: 87, currency: 'CAD', language: 'English & French', bestTimeToVisit: 'June-September', visa: 'Required for many countries', tipping: '15-20% expected', safety: 'Very safe' },
    'spain': { accommodation: 80, food: 35, transportation: 15, attractions: 25, misc: 10, costIndex: 75, currency: 'EUR', language: 'Spanish', bestTimeToVisit: 'April-June & September-October', visa: 'Schengen visa for non-EU', tipping: 'Not required but appreciated', safety: 'Generally safe' },
    'greece': { accommodation: 70, food: 30, transportation: 10, attractions: 20, misc: 10, costIndex: 68, currency: 'EUR', language: 'Greek', bestTimeToVisit: 'April-June & September-October', visa: 'Schengen visa for non-EU', tipping: '5-10% in restaurants', safety: 'Generally safe' },
    'singapore': { accommodation: 100, food: 30, transportation: 10, attractions: 25, misc: 15, costIndex: 85, currency: 'SGD', language: 'English, Mandarin, Malay, Tamil', bestTimeToVisit: 'Year-round', visa: 'Required for some countries', tipping: 'Not customary', safety: 'Very safe' },
    'brazil': { accommodation: 60, food: 25, transportation: 10, attractions: 20, misc: 10, costIndex: 65, currency: 'BRL', language: 'Portuguese', bestTimeToVisit: 'September-March', visa: 'Required for many countries', tipping: '10% in restaurants', safety: 'Exercise caution in certain areas' },
    'egypt': { accommodation: 40, food: 15, transportation: 5, attractions: 15, misc: 5, costIndex: 40, currency: 'EGP', language: 'Arabic', bestTimeToVisit: 'October-April', visa: 'Required for most countries', tipping: 'Expected (baksheesh)', safety: 'Exercise caution' },
    'india': { accommodation: 30, food: 10, transportation: 5, attractions: 10, misc: 5, costIndex: 35, currency: 'INR', language: 'Hindi & others', bestTimeToVisit: 'October-March', visa: 'Required for most countries', tipping: '5-10% in restaurants', safety: 'Exercise caution' },
    'portugal': { accommodation: 75, food: 30, transportation: 12, attractions: 20, misc: 10, costIndex: 65, currency: 'EUR', language: 'Portuguese', bestTimeToVisit: 'March-May & September-October', visa: 'Schengen visa for non-EU', tipping: '5-10% in restaurants', safety: 'Very safe' },
    'netherlands': { accommodation: 95, food: 40, transportation: 15, attractions: 25, misc: 12, costIndex: 85, currency: 'EUR', language: 'Dutch', bestTimeToVisit: 'April-May & September-October', visa: 'Schengen visa for non-EU', tipping: '10% in restaurants', safety: 'Very safe' },
    'south_korea': { accommodation: 75, food: 35, transportation: 12, attractions: 22, misc: 10, costIndex: 78, currency: 'KRW', language: 'Korean', bestTimeToVisit: 'March-May & September-November', visa: 'Required for many countries', tipping: 'Not customary', safety: 'Very safe' },
    'vietnam': { accommodation: 25, food: 10, transportation: 5, attractions: 8, misc: 5, costIndex: 38, currency: 'VND', language: 'Vietnamese', bestTimeToVisit: 'September-April', visa: 'Required for most countries', tipping: 'Not required but appreciated', safety: 'Generally safe' },
    'turkey': { accommodation: 45, food: 20, transportation: 8, attractions: 15, misc: 8, costIndex: 55, currency: 'TRY', language: 'Turkish', bestTimeToVisit: 'April-May & September-November', visa: 'Required for many countries', tipping: '5-10% in restaurants', safety: 'Exercise caution in certain areas' },
    'morocco': { accommodation: 40, food: 15, transportation: 7, attractions: 12, misc: 8, costIndex: 50, currency: 'MAD', language: 'Arabic & French', bestTimeToVisit: 'March-May & September-November', visa: 'Not required for many Western countries', tipping: '10% in restaurants', safety: 'Exercise caution' },
    };
  
  // Expanded attraction data
  const attractionData = {
    'japan': [
      { name: 'Tokyo Tower', cost: 10, rating: 4.5, type: 'Landmark', duration: '1-2 hours', bestTime: 'Sunset', location: 'Tokyo' },
      { name: 'Senso-ji Temple', cost: 0, rating: 4.7, type: 'Religious Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Tokyo' },
      { name: 'Meiji Shrine', cost: 0, rating: 4.6, type: 'Religious Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Tokyo' },
      { name: 'Tokyo Disneyland', cost: 75, rating: 4.8, type: 'Theme Park', duration: 'Full day', bestTime: 'Weekdays', location: 'Tokyo' },
      { name: 'Shibuya Crossing', cost: 0, rating: 4.5, type: 'Landmark', duration: '30 minutes', bestTime: 'Evening', location: 'Tokyo' },
      { name: 'Mount Fuji', cost: 30, rating: 4.9, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Early morning', location: 'Honshu' },
      { name: 'Fushimi Inari Shrine', cost: 0, rating: 4.8, type: 'Religious Site', duration: '2-3 hours', bestTime: 'Early morning', location: 'Kyoto' },
      { name: 'Arashiyama Bamboo Grove', cost: 0, rating: 4.7, type: 'Natural Landmark', duration: '1-2 hours', bestTime: 'Early morning', location: 'Kyoto' },
      { name: 'Nara Park', cost: 0, rating: 4.7, type: 'Park', duration: '3-4 hours', bestTime: 'Daytime', location: 'Nara' },
      { name: 'Hiroshima Peace Memorial', cost: 0, rating: 4.8, type: 'Museum/Memorial', duration: '2-3 hours', bestTime: 'Daytime', location: 'Hiroshima' },
      { name: 'Osaka Castle', cost: 5, rating: 4.6, type: 'Historical Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Osaka' },
      { name: 'Dotonbori', cost: 0, rating: 4.7, type: 'District', duration: '2-3 hours', bestTime: 'Evening', location: 'Osaka' },
      { name: 'TeamLab Borderless', cost: 30, rating: 4.9, type: 'Museum', duration: '3-4 hours', bestTime: 'Weekdays', location: 'Tokyo' },
      { name: 'Hakone Open Air Museum', cost: 15, rating: 4.8, type: 'Museum', duration: '3-4 hours', bestTime: 'Daytime', location: 'Hakone' },
      { name: 'Kinkaku-ji (Golden Pavilion)', cost: 5, rating: 4.8, type: 'Temple', duration: '1 hour', bestTime: 'Morning', location: 'Kyoto' }
    ],
    'thailand': [
      { name: 'Grand Palace', cost: 15, rating: 4.7, type: 'Historical Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Bangkok' },
      { name: 'Wat Arun', cost: 2, rating: 4.6, type: 'Temple', duration: '1-2 hours', bestTime: 'Sunset', location: 'Bangkok' },
      { name: 'Sunday Night Market', cost: 0, rating: 4.4, type: 'Market', duration: '2-3 hours', bestTime: 'Evening', location: 'Chiang Mai' },
      { name: 'Elephant Nature Park', cost: 80, rating: 4.9, type: 'Wildlife Sanctuary', duration: 'Full day', bestTime: 'Morning', location: 'Chiang Mai' },
      { name: 'Phi Phi Islands', cost: 40, rating: 4.7, type: 'Island', duration: 'Full day', bestTime: 'Daytime', location: 'Phuket' },
      { name: 'Chatuchak Market', cost: 0, rating: 4.5, type: 'Market', duration: '3-4 hours', bestTime: 'Weekend morning', location: 'Bangkok' },
      { name: 'Railay Beach', cost: 0, rating: 4.8, type: 'Beach', duration: 'Half/Full day', bestTime: 'Morning', location: 'Krabi' },
      { name: 'Wat Pho', cost: 3, rating: 4.7, type: 'Temple', duration: '1-2 hours', bestTime: 'Morning', location: 'Bangkok' },
      { name: 'Doi Suthep', cost: 3, rating: 4.8, type: 'Temple', duration: 'Half day', bestTime: 'Morning', location: 'Chiang Mai' },
      { name: 'Similan Islands', cost: 60, rating: 4.9, type: 'National Park', duration: 'Full day', bestTime: 'Morning', location: 'Phang Nga' },
      { name: 'Wat Rong Khun (White Temple)', cost: 4, rating: 4.7, type: 'Temple', duration: '1-2 hours', bestTime: 'Morning', location: 'Chiang Rai' },
      { name: 'Sukhothai Historical Park', cost: 4, rating: 4.8, type: 'Historical Site', duration: 'Half day', bestTime: 'Morning', location: 'Sukhothai' },
      { name: 'Ayutthaya Historical Park', cost: 7, rating: 4.7, type: 'Historical Site', duration: 'Full day', bestTime: 'Morning', location: 'Ayutthaya' },
      { name: 'Khao Yai National Park', cost: 10, rating: 4.8, type: 'National Park', duration: 'Full day', bestTime: 'Morning', location: 'Central Thailand' },
      { name: 'Maya Bay', cost: 10, rating: 4.6, type: 'Beach', duration: 'Half day', bestTime: 'Morning', location: 'Phi Phi Islands' }
    ],
    'france': [
      { name: 'Eiffel Tower', cost: 25, rating: 4.6, type: 'Landmark', duration: '2-3 hours', bestTime: 'Sunset', location: 'Paris' },
      { name: 'Louvre Museum', cost: 17, rating: 4.7, type: 'Museum', duration: '3-4 hours', bestTime: 'Morning', location: 'Paris' },
      { name: 'Notre-Dame Cathedral', cost: 0, rating: 4.7, type: 'Religious Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Paris' },
      { name: 'Palace of Versailles', cost: 20, rating: 4.8, type: 'Palace', duration: 'Full day', bestTime: 'Morning', location: 'Versailles' },
      { name: 'Mont Saint-Michel', cost: 11, rating: 4.8, type: 'Historical Site', duration: 'Full day', bestTime: 'Daytime', location: 'Normandy' },
      { name: 'French Riviera', cost: 0, rating: 4.7, type: 'Coastal Region', duration: 'Multiple days', bestTime: 'Summer', location: 'Southern France' },
      { name: 'Musée d\'Orsay', cost: 14, rating: 4.7, type: 'Museum', duration: '2-3 hours', bestTime: 'Morning', location: 'Paris' },
      { name: 'Château de Chambord', cost: 14, rating: 4.7, type: 'Castle', duration: 'Half day', bestTime: 'Morning', location: 'Loire Valley' },
      { name: 'Arc de Triomphe', cost: 13, rating: 4.7, type: 'Monument', duration: '1 hour', bestTime: 'Evening', location: 'Paris' },
      { name: 'Sacré-Cœur', cost: 0, rating: 4.7, type: 'Religious Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Paris' },
      { name: 'Carcassonne', cost: 9, rating: 4.7, type: 'Historical Site', duration: 'Half day', bestTime: 'Morning', location: 'Occitanie' },
      { name: 'Chamonix-Mont-Blanc', cost: 30, rating: 4.8, type: 'Mountain', duration: 'Full day', bestTime: 'Morning', location: 'French Alps' },
      { name: 'Sainte-Chapelle', cost: 11, rating: 4.8, type: 'Religious Site', duration: '1 hour', bestTime: 'Sunny day', location: 'Paris' },
      { name: 'Provence Lavender Fields', cost: 0, rating: 4.9, type: 'Natural Landmark', duration: 'Half day', bestTime: 'June-August', location: 'Provence' },
      { name: 'Centre Pompidou', cost: 14, rating: 4.6, type: 'Museum', duration: '2-3 hours', bestTime: 'Afternoon', location: 'Paris' }
    ],
    'usa': [
      { name: 'Statue of Liberty', cost: 24, rating: 4.7, type: 'Monument', duration: 'Half day', bestTime: 'Morning', location: 'New York' },
      { name: 'Grand Canyon', cost: 35, rating: 4.9, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Sunrise/Sunset', location: 'Arizona' },
      { name: 'Times Square', cost: 0, rating: 4.5, type: 'District', duration: '1-2 hours', bestTime: 'Evening', location: 'New York' },
      { name: 'Golden Gate Bridge', cost: 0, rating: 4.8, type: 'Landmark', duration: '1-2 hours', bestTime: 'Morning', location: 'San Francisco' },
      { name: 'Disney World', cost: 109, rating: 4.7, type: 'Theme Park', duration: 'Full day', bestTime: 'Weekday', location: 'Florida' },
      { name: 'Yellowstone', cost: 20, rating: 4.9, type: 'National Park', duration: 'Multiple days', bestTime: 'June-September', location: 'Wyoming' },
      { name: 'Empire State Building', cost: 42, rating: 4.7, type: 'Landmark', duration: '1-2 hours', bestTime: 'Night', location: 'New York' },
      { name: 'The White House', cost: 0, rating: 4.6, type: 'Government Building', duration: '1 hour', bestTime: 'Morning', location: 'Washington DC' },
      { name: 'Las Vegas Strip', cost: 0, rating: 4.7, type: 'Entertainment District', duration: 'Evening', bestTime: 'Night', location: 'Nevada' },
      { name: 'Yosemite National Park', cost: 35, rating: 4.9, type: 'National Park', duration: 'Full day', bestTime: 'May-September', location: 'California' },
      { name: 'Alcatraz Island', cost: 41, rating: 4.7, type: 'Historical Site', duration: 'Half day', bestTime: 'Morning', location: 'San Francisco' },
      { name: 'Central Park', cost: 0, rating: 4.8, type: 'Park', duration: '2-3 hours', bestTime: 'Morning', location: 'New York' },
      { name: 'Metropolitan Museum of Art', cost: 25, rating: 4.8, type: 'Museum', duration: '3-4 hours', bestTime: 'Weekday', location: 'New York' },
      { name: 'French Quarter', cost: 0, rating: 4.7, type: 'District', duration: 'Half day', bestTime: 'Evening', location: 'New Orleans' },
      { name: 'Hawaii Volcanoes National Park', cost: 30, rating: 4.8, type: 'National Park', duration: 'Full day', bestTime: 'Morning', location: 'Hawaii' }
    ],
    'mexico': [
      { name: 'Chichen Itza', cost: 23, rating: 4.8, type: 'Archaeological Site', duration: 'Full day', bestTime: 'Early morning', location: 'Yucatan' },
      { name: 'Frida Kahlo Museum', cost: 14, rating: 4.6, type: 'Museum', duration: '1-2 hours', bestTime: 'Weekday morning', location: 'Mexico City' },
      { name: 'Xcaret Park', cost: 120, rating: 4.7, type: 'Theme Park', duration: 'Full day', bestTime: 'Weekday', location: 'Playa del Carmen' },
      { name: 'Tulum Ruins', cost: 4, rating: 4.7, type: 'Archaeological Site', duration: 'Half day', bestTime: 'Morning', location: 'Tulum' },
      { name: 'Chapultepec Castle', cost: 5, rating: 4.5, type: 'Historical Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Mexico City' },
      { name: 'Copper Canyon', cost: 25, rating: 4.8, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Morning', location: 'Chihuahua' },
      { name: 'Teotihuacan', cost: 5, rating: 4.8, type: 'Archaeological Site', duration: 'Full day', bestTime: 'Morning', location: 'Mexico City vicinity' },
      { name: 'Cozumel', cost: 0, rating: 4.7, type: 'Island', duration: 'Full day', bestTime: 'Daytime', location: 'Quintana Roo' },
      { name: 'Zocalo', cost: 0, rating: 4.6, type: 'Plaza', duration: '1-2 hours', bestTime: 'Daytime', location: 'Mexico City' },
      { name: 'Cenote Dos Ojos', cost: 10, rating: 4.8, type: 'Natural Landmark', duration: '2-3 hours', bestTime: 'Morning', location: 'Tulum' },
      { name: 'National Museum of Anthropology', cost: 5, rating: 4.8, type: 'Museum', duration: '3-4 hours', bestTime: 'Weekday', location: 'Mexico City' },
      { name: 'Puerto Vallarta Malecon', cost: 0, rating: 4.7, type: 'Boardwalk', duration: '2-3 hours', bestTime: 'Sunset', location: 'Puerto Vallarta' },
      { name: 'Monte Alban', cost: 5, rating: 4.8, type: 'Archaeological Site', duration: 'Half day', bestTime: 'Morning', location: 'Oaxaca' },
      { name: 'Isla Mujeres', cost: 19, rating: 4.7, type: 'Island', duration: 'Full day', bestTime: 'Daytime', location: 'Cancun' },
      { name: 'Palenque Ruins', cost: 4, rating: 4.8, type: 'Archaeological Site', duration: 'Half day', bestTime: 'Morning', location: 'Chiapas' }
    ],
    'italy': [
    { name: 'Colosseum', cost: 18, rating: 4.7, type: 'Historical Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Rome' },
    { name: 'Vatican Museums', cost: 17, rating: 4.8, type: 'Museum', duration: '3-4 hours', bestTime: 'Morning', location: 'Vatican City' },
    { name: 'Trevi Fountain', cost: 0, rating: 4.8, type: 'Landmark', duration: '30 minutes', bestTime: 'Early morning', location: 'Rome' },
    { name: 'Uffizi Gallery', cost: 20, rating: 4.7, type: 'Museum', duration: '2-3 hours', bestTime: 'Morning', location: 'Florence' },
    { name: 'Leaning Tower', cost: 20, rating: 4.7, type: 'Landmark', duration: '1-2 hours', bestTime: 'Morning', location: 'Pisa' },
    { name: 'Venice Canals', cost: 0, rating: 4.9, type: 'Natural Landmark', duration: 'Half day', bestTime: 'Early morning', location: 'Venice' },
    { name: 'Pompeii', cost: 16, rating: 4.8, type: 'Archaeological Site', duration: 'Full day', bestTime: 'Morning', location: 'Naples' },
    { name: 'Duomo di Milano', cost: 3, rating: 4.7, type: 'Religious Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Milan' },
    { name: 'Pantheon', cost: 0, rating: 4.8, type: 'Historical Site', duration: '1 hour', bestTime: 'Daytime', location: 'Rome' },
    { name: 'Amalfi Coast', cost: 0, rating: 4.9, type: 'Coastal Region', duration: 'Full day', bestTime: 'Morning', location: 'Campania' },
    { name: 'St. Mark\'s Basilica', cost: 0, rating: 4.8, type: 'Religious Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Venice' },
    { name: 'Roman Forum', cost: 16, rating: 4.7, type: 'Archaeological Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Rome' },
    { name: 'Galleria dell\'Accademia', cost: 12, rating: 4.8, type: 'Museum', duration: '1-2 hours', bestTime: 'Morning', location: 'Florence' },
    { name: 'Cinque Terre', cost: 8, rating: 4.8, type: 'Coastal Villages', duration: 'Full day', bestTime: 'Morning', location: 'Liguria' },
    { name: 'Duomo di Firenze', cost: 18, rating: 4.7, type: 'Religious Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Florence' }
  ],
  'australia': [
    { name: 'Sydney Opera House', cost: 40, rating: 4.8, type: 'Landmark', duration: '1-2 hours', bestTime: 'Daytime', location: 'Sydney' },
    { name: 'Great Barrier Reef', cost: 150, rating: 4.9, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Morning', location: 'Queensland' },
    { name: 'Uluru', cost: 25, rating: 4.9, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Sunrise/Sunset', location: 'Northern Territory' },
    { name: 'Bondi Beach', cost: 0, rating: 4.7, type: 'Beach', duration: 'Half day', bestTime: 'Morning', location: 'Sydney' },
    { name: 'Great Ocean Road', cost: 0, rating: 4.8, type: 'Scenic Drive', duration: 'Full day', bestTime: 'Daytime', location: 'Victoria' },
    { name: 'Harbour Bridge Climb', cost: 200, rating: 4.8, type: 'Adventure', duration: '2-3 hours', bestTime: 'Sunset', location: 'Sydney' },
    { name: 'Daintree Rainforest', cost: 35, rating: 4.8, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Morning', location: 'Queensland' },
    { name: 'Taronga Zoo', cost: 45, rating: 4.6, type: 'Zoo', duration: 'Full day', bestTime: 'Morning', location: 'Sydney' },
    { name: 'Twelve Apostles', cost: 0, rating: 4.8, type: 'Natural Landmark', duration: '1-2 hours', bestTime: 'Sunset', location: 'Victoria' },
    { name: 'National Gallery of Victoria', cost: 0, rating: 4.7, type: 'Museum', duration: '2-3 hours', bestTime: 'Weekday', location: 'Melbourne' },
    { name: 'Melbourne Cricket Ground', cost: 25, rating: 4.8, type: 'Sports Venue', duration: '2-3 hours', bestTime: 'Game day', location: 'Melbourne' },
    { name: 'Kings Park', cost: 0, rating: 4.8, type: 'Park', duration: '2-3 hours', bestTime: 'Morning', location: 'Perth' },
    { name: 'Blue Mountains', cost: 0, rating: 4.7, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Morning', location: 'New South Wales' },
    { name: 'Port Arthur', cost: 40, rating: 4.6, type: 'Historical Site', duration: 'Full day', bestTime: 'Morning', location: 'Tasmania' },
    { name: 'Kakadu National Park', cost: 25, rating: 4.8, type: 'National Park', duration: 'Multiple days', bestTime: 'Dry season', location: 'Northern Territory' }
  ],
  'germany': [
    { name: 'Neuschwanstein Castle', cost: 15, rating: 4.8, type: 'Castle', duration: 'Half day', bestTime: 'Morning', location: 'Bavaria' },
    { name: 'Brandenburg Gate', cost: 0, rating: 4.7, type: 'Monument', duration: '30 minutes', bestTime: 'Daytime', location: 'Berlin' },
    { name: 'Cologne Cathedral', cost: 0, rating: 4.8, type: 'Religious Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Cologne' },
    { name: 'Berlin Wall Memorial', cost: 0, rating: 4.7, type: 'Historical Site', duration: '1-2 hours', bestTime: 'Daytime', location: 'Berlin' },
    { name: 'Reichstag Building', cost: 0, rating: 4.7, type: 'Government Building', duration: '1-2 hours', bestTime: 'Evening', location: 'Berlin' },
    { name: 'Marienplatz', cost: 0, rating: 4.7, type: 'Square', duration: '1 hour', bestTime: 'Morning', location: 'Munich' },
    { name: 'Heidelberg Castle', cost: 8, rating: 4.7, type: 'Castle', duration: '2-3 hours', bestTime: 'Morning', location: 'Heidelberg' },
    { name: 'Museum Island', cost: 18, rating: 4.8, type: 'Museum Complex', duration: 'Full day', bestTime: 'Weekday', location: 'Berlin' },
    { name: 'Romantic Road', cost: 0, rating: 4.8, type: 'Scenic Route', duration: 'Multiple days', bestTime: 'Summer', location: 'Bavaria' },
    { name: 'Black Forest', cost: 0, rating: 4.8, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Summer', location: 'Baden-Württemberg' },
    { name: 'Dresden Frauenkirche', cost: 0, rating: 4.8, type: 'Religious Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Dresden' },
    { name: 'Europa-Park', cost: 55, rating: 4.8, type: 'Theme Park', duration: 'Full day', bestTime: 'Weekday', location: 'Rust' },
    { name: 'Zugspitze', cost: 58, rating: 4.8, type: 'Mountain', duration: 'Full day', bestTime: 'Clear day', location: 'Bavaria' },
    { name: 'Nuremberg Castle', cost: 7, rating: 4.6, type: 'Castle', duration: '2-3 hours', bestTime: 'Morning', location: 'Nuremberg' },
    { name: 'Miniatur Wunderland', cost: 15, rating: 4.9, type: 'Museum', duration: '3-4 hours', bestTime: 'Weekday', location: 'Hamburg' }
  ],
  'uk': [
    { name: 'Tower of London', cost: 30, rating: 4.7, type: 'Historical Site', duration: '3-4 hours', bestTime: 'Morning', location: 'London' },
    { name: 'Stonehenge', cost: 20, rating: 4.6, type: 'Historical Site', duration: '2 hours', bestTime: 'Morning', location: 'Wiltshire' },
    { name: 'British Museum', cost: 0, rating: 4.8, type: 'Museum', duration: '3-4 hours', bestTime: 'Weekday', location: 'London' },
    { name: 'Edinburgh Castle', cost: 18, rating: 4.7, type: 'Castle', duration: '2-3 hours', bestTime: 'Morning', location: 'Edinburgh' },
    { name: 'Westminster Abbey', cost: 24, rating: 4.7, type: 'Religious Site', duration: '1-2 hours', bestTime: 'Morning', location: 'London' },
    { name: 'Buckingham Palace', cost: 30, rating: 4.6, type: 'Palace', duration: '2-3 hours', bestTime: 'Morning', location: 'London' },
    { name: 'Lake District', cost: 0, rating: 4.9, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Summer', location: 'Cumbria' },
    { name: 'Giant\'s Causeway', cost: 0, rating: 4.8, type: 'Natural Landmark', duration: '2-3 hours', bestTime: 'Morning', location: 'Northern Ireland' },
    { name: 'Royal Mile', cost: 0, rating: 4.7, type: 'Historic Street', duration: '2-3 hours', bestTime: 'Daytime', location: 'Edinburgh' },
    { name: 'Roman Baths', cost: 22, rating: 4.7, type: 'Historical Site', duration: '2 hours', bestTime: 'Morning', location: 'Bath' },
    { name: 'National Gallery', cost: 0, rating: 4.8, type: 'Museum', duration: '2-3 hours', bestTime: 'Weekday', location: 'London' },
    { name: 'Windsor Castle', cost: 26, rating: 4.7, type: 'Castle', duration: '2-3 hours', bestTime: 'Morning', location: 'Windsor' },
    { name: 'London Eye', cost: 30, rating: 4.5, type: 'Observation Wheel', duration: '30 minutes', bestTime: 'Sunset', location: 'London' },
    { name: 'York Minster', cost: 12, rating: 4.8, type: 'Religious Site', duration: '1-2 hours', bestTime: 'Morning', location: 'York' },
    { name: 'Natural History Museum', cost: 0, rating: 4.8, type: 'Museum', duration: '3-4 hours', bestTime: 'Weekday', location: 'London' }
  ],
  'canada': [
    { name: 'Niagara Falls', cost: 0, rating: 4.9, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Morning', location: 'Ontario' },
    { name: 'CN Tower', cost: 40, rating: 4.6, type: 'Landmark', duration: '1-2 hours', bestTime: 'Sunset', location: 'Toronto' },
    { name: 'Banff National Park', cost: 10, rating: 4.9, type: 'National Park', duration: 'Multiple days', bestTime: 'Summer', location: 'Alberta' },
    { name: 'Butchart Gardens', cost: 30, rating: 4.8, type: 'Garden', duration: '3-4 hours', bestTime: 'Summer', location: 'Victoria' },
    { name: 'Old Quebec', cost: 0, rating: 4.8, type: 'Historic District', duration: 'Full day', bestTime: 'Summer', location: 'Quebec City' },
    { name: 'Notre-Dame Basilica', cost: 8, rating: 4.8, type: 'Religious Site', duration: '1 hour', bestTime: 'Morning', location: 'Montreal' },
    { name: 'Stanley Park', cost: 0, rating: 4.8, type: 'Park', duration: 'Half day', bestTime: 'Morning', location: 'Vancouver' },
    { name: 'Capilano Suspension Bridge', cost: 50, rating: 4.6, type: 'Landmark', duration: '2-3 hours', bestTime: 'Morning', location: 'Vancouver' },
    { name: 'Royal Ontario Museum', cost: 23, rating: 4.6, type: 'Museum', duration: '3-4 hours', bestTime: 'Weekday', location: 'Toronto' },
    { name: 'Whistler Blackcomb', cost: 135, rating: 4.7, type: 'Ski Resort', duration: 'Full day', bestTime: 'Winter', location: 'British Columbia' },
    { name: 'Hopewell Rocks', cost: 10, rating: 4.8, type: 'Natural Landmark', duration: '2-3 hours', bestTime: 'Low tide', location: 'New Brunswick' },
    { name: 'Parliament Hill', cost: 0, rating: 4.7, type: 'Government Building', duration: '1-2 hours', bestTime: 'Morning', location: 'Ottawa' },
    { name: 'Peggy\'s Cove', cost: 0, rating: 4.8, type: 'Natural Landmark', duration: '1-2 hours', bestTime: 'Morning', location: 'Nova Scotia' },
    { name: 'Jasper National Park', cost: 10, rating: 4.9, type: 'National Park', duration: 'Multiple days', bestTime: 'Summer', location: 'Alberta' },
    { name: 'Gros Morne National Park', cost: 10, rating: 4.8, type: 'National Park', duration: 'Multiple days', bestTime: 'Summer', location: 'Newfoundland' }
  ],
  'spain': [
    { name: 'Sagrada Familia', cost: 20, rating: 4.8, type: 'Religious Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Barcelona' },
    { name: 'Alhambra', cost: 14, rating: 4.9, type: 'Palace', duration: 'Half day', bestTime: 'Morning', location: 'Granada' },
    { name: 'Park Güell', cost: 10, rating: 4.7, type: 'Park', duration: '2 hours', bestTime: 'Morning', location: 'Barcelona' },
    { name: 'Prado Museum', cost: 15, rating: 4.8, type: 'Museum', duration: '3-4 hours', bestTime: 'Weekday', location: 'Madrid' },
    { name: 'La Rambla', cost: 0, rating: 4.5, type: 'Street', duration: '1-2 hours', bestTime: 'Evening', location: 'Barcelona' },
    { name: 'Plaza Mayor', cost: 0, rating: 4.6, type: 'Square', duration: '30 minutes', bestTime: 'Evening', location: 'Madrid' },
    { name: 'Seville Cathedral', cost: 10, rating: 4.7, type: 'Religious Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Seville' },
    { name: 'Royal Palace of Madrid', cost: 13, rating: 4.7, type: 'Palace', duration: '2 hours', bestTime: 'Morning', location: 'Madrid' },
    { name: 'Ibiza Old Town', cost: 0, rating: 4.7, type: 'Historic District', duration: '2-3 hours', bestTime: 'Evening', location: 'Ibiza' },
    { name: 'Guggenheim Museum', cost: 13, rating: 4.6, type: 'Museum', duration: '2-3 hours', bestTime: 'Weekday', location: 'Bilbao' },
    { name: 'Mezquita of Cordoba', cost: 11, rating: 4.8, type: 'Religious Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Cordoba' },
    { name: 'Tenerife Teide National Park', cost: 0, rating: 4.9, type: 'National Park', duration: 'Full day', bestTime: 'Morning', location: 'Canary Islands' },
    { name: 'Plaza de España', cost: 0, rating: 4.8, type: 'Plaza', duration: '1-2 hours', bestTime: 'Morning', location: 'Seville' },
    { name: 'Montserrat Monastery', cost: 8, rating: 4.7, type: 'Religious Site', duration: 'Half day', bestTime: 'Morning', location: 'Barcelona' },
    { name: 'City of Arts and Sciences', cost: 38, rating: 4.7, type: 'Museum Complex', duration: 'Full day', bestTime: 'Weekday', location: 'Valencia' }
  ],
  'greece': [
    { name: 'Acropolis', cost: 20, rating: 4.9, type: 'Historical Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Athens' },
    { name: 'Santorini Caldera', cost: 0, rating: 4.9, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Sunset', location: 'Santorini' },
    { name: 'Parthenon', cost: 0, rating: 4.8, type: 'Historical Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Athens' },
    { name: 'Meteora', cost: 3, rating: 4.9, type: 'Natural/Religious Site', duration: 'Full day', bestTime: 'Morning', location: 'Thessaly' },
    { name: 'Delphi', cost: 12, rating: 4.8, type: 'Archaeological Site', duration: 'Half day', bestTime: 'Morning', location: 'Central Greece' },
    { name: 'Mykonos Windmills', cost: 0, rating: 4.7, type: 'Landmark', duration: '30 minutes', bestTime: 'Sunset', location: 'Mykonos' },
    { name: 'Palace of Knossos', cost: 15, rating: 4.6, type: 'Archaeological Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Crete' },
    { name: 'Navagio Beach', cost: 0, rating: 4.9, type: 'Beach', duration: 'Half day', bestTime: 'Morning', location: 'Zakynthos' },
    { name: 'Corfu Old Town', cost: 0, rating: 4.7, type: 'Historic District', duration: 'Half day', bestTime: 'Morning', location: 'Corfu' },
    { name: 'Olympia', cost: 12, rating: 4.7, type: 'Archaeological Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Peloponnese' },
    { name: 'Acropolis Museum', cost: 10, rating: 4.8, type: 'Museum', duration: '2-3 hours', bestTime: 'Afternoon', location: 'Athens' },
    { name: 'Samaria Gorge', cost: 5, rating: 4.8, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Morning', location: 'Crete' },
    { name: 'Lindos Acropolis', cost: 12, rating: 4.7, type: 'Archaeological Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Rhodes' },
    { name: 'Melissani Cave', cost: 7, rating: 4.8, type: 'Natural Landmark', duration: '1 hour', bestTime: 'Midday', location: 'Kefalonia' },
    { name: 'Ancient Mycenae', cost: 12, rating: 4.7, type: 'Archaeological Site', duration: '2 hours', bestTime: 'Morning', location: 'Peloponnese' }
  ],
  'singapore': [
    { name: 'Gardens by the Bay', cost: 0, rating: 4.8, type: 'Park', duration: '3-4 hours', bestTime: 'Evening', location: 'Marina Bay' },
    { name: 'Marina Bay Sands', cost: 20, rating: 4.7, type: 'Landmark', duration: '2-3 hours', bestTime: 'Sunset', location: 'Marina Bay' },
    { name: 'Singapore Zoo', cost: 40, rating: 4.7, type: 'Zoo', duration: 'Full day', bestTime: 'Morning', location: 'Mandai' },
    { name: 'Universal Studios Singapore', cost: 80, rating: 4.6, type: 'Theme Park', duration: 'Full day', bestTime: 'Weekday', location: 'Sentosa Island' },
    { name: 'Sentosa Island', cost: 0, rating: 4.7, type: 'Island', duration: 'Full day', bestTime: 'Daytime', location: 'Southern Singapore' },
    { name: 'Merlion Park', cost: 0, rating: 4.5, type: 'Park', duration: '30 minutes', bestTime: 'Evening', location: 'Marina Bay' },
    { name: 'Singapore Botanic Gardens', cost: 0, rating: 4.8, type: 'Garden', duration: '2-3 hours', bestTime: 'Morning', location: 'Central Singapore' },
    { name: 'Chinatown', cost: 0, rating: 4.6, type: 'District', duration: '2-3 hours', bestTime: 'Evening', location: 'Southern Singapore' },
    { name: 'ArtScience Museum', cost: 18, rating: 4.6, type: 'Museum', duration: '2-3 hours', bestTime: 'Afternoon', location: 'Marina Bay' },
    { name: 'Singapore Flyer', cost: 33, rating: 4.5, type: 'Observation Wheel', duration: '30 minutes', bestTime: 'Sunset', location: 'Marina Bay' },
    { name: 'Little India', cost: 0, rating: 4.6, type: 'District', duration: '2 hours', bestTime: 'Daytime', location: 'Central Singapore' },
    { name: 'National Museum of Singapore', cost: 15, rating: 4.6, type: 'Museum', duration: '2-3 hours', bestTime: 'Afternoon', location: 'Central Singapore' },
    { name: 'Night Safari', cost: 50, rating: 4.7, type: 'Zoo', duration: '3 hours', bestTime: 'Evening', location: 'Mandai' },
    { name: 'Clarke Quay', cost: 0, rating: 4.6, type: 'District', duration: '2-3 hours', bestTime: 'Evening', location: 'Central Singapore' },
    { name: 'Jewel Changi Airport', cost: 0, rating: 4.8, type: 'Shopping/Entertainment', duration: '2-3 hours', bestTime: 'Anytime', location: 'Changi' }
  ],
  'brazil': [
    { name: 'Christ the Redeemer', cost: 16, rating: 4.8, type: 'Monument', duration: '1-2 hours', bestTime: 'Morning', location: 'Rio de Janeiro' },
    { name: 'Sugarloaf Mountain', cost: 26, rating: 4.8, type: 'Natural Landmark', duration: '2-3 hours', bestTime: 'Sunset', location: 'Rio de Janeiro' },
    { name: 'Copacabana Beach', cost: 0, rating: 4.7, type: 'Beach', duration: 'Half day', bestTime: 'Morning', location: 'Rio de Janeiro' },
    { name: 'Iguazu Falls', cost: 17, rating: 4.9, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Morning', location: 'Foz do Iguaçu' },
    { name: 'Amazon Rainforest', cost: 100, rating: 4.9, type: 'Natural Landmark', duration: 'Multiple days', bestTime: 'Dry season', location: 'North Brazil' },
    { name: 'Ipanema Beach', cost: 0, rating: 4.7, type: 'Beach', duration: 'Half day', bestTime: 'Afternoon', location: 'Rio de Janeiro' },
    { name: 'Pelourinho', cost: 0, rating: 4.7, type: 'Historic District', duration: '2-3 hours', bestTime: 'Morning', location: 'Salvador' },
    { name: 'Fernando de Noronha', cost: 75, rating: 4.9, type: 'Island', duration: 'Multiple days', bestTime: 'Dry season', location: 'Pernambuco' },
    { name: 'Lençóis Maranhenses', cost: 50, rating: 4.9, type: 'Natural Landmark', duration: 'Full day', bestTime: 'June-September', location: 'Maranhão' },
    { name: 'Museum of Tomorrow', cost: 6, rating: 4.7, type: 'Museum', duration: '2-3 hours', bestTime: 'Weekday', location: 'Rio de Janeiro' },
    { name: 'Pantanal', cost: 100, rating: 4.8, type: 'Natural Landmark', duration: 'Multiple days', bestTime: 'Dry season', location: 'Mato Grosso' },
    { name: 'Brasilia Cathedral', cost: 0, rating: 4.7, type: 'Religious Site', duration: '1 hour', bestTime: 'Morning', location: 'Brasilia' },
    { name: 'Escadaria Selarón', cost: 0, rating: 4.7, type: 'Landmark', duration: '30 minutes', bestTime: 'Morning', location: 'Rio de Janeiro' },
    { name: 'Maracanã Stadium', cost: 20, rating: 4.6, type: 'Sports Venue', duration: '1-2 hours', bestTime: 'Match day', location: 'Rio de Janeiro' },
    { name: 'Ouro Preto', cost: 0, rating: 4.8, type: 'Historic Town', duration: 'Full day', bestTime: 'Morning', location: 'Minas Gerais' }
  ],
  'egypt': [
    { name: 'Pyramids of Giza', cost: 9, rating: 4.8, type: 'Historical Site', duration: 'Half day', bestTime: 'Morning', location: 'Giza' },
    { name: 'Egyptian Museum', cost: 10, rating: 4.7, type: 'Museum', duration: '3-4 hours', bestTime: 'Morning', location: 'Cairo' },
    { name: 'Luxor Temple', cost: 12, rating: 4.8, type: 'Archaeological Site', duration: '2-3 hours', bestTime: 'Evening', location: 'Luxor' },
    { name: 'Valley of the Kings', cost: 15, rating: 4.8, type: 'Archaeological Site', duration: 'Half day', bestTime: 'Morning', location: 'Luxor' },
    { name: 'Abu Simbel', cost: 15, rating: 4.9, type: 'Archaeological Site', duration: 'Half day', bestTime: 'Morning', location: 'Aswan' },
    { name: 'Khan el-Khalili', cost: 0, rating: 4.6, type: 'Market', duration: '2-3 hours', bestTime: 'Evening', location: 'Cairo' },
    { name: 'Karnak Temple', cost: 12, rating: 4.8, type: 'Archaeological Site', duration: '3-4 hours', bestTime: 'Morning', location: 'Luxor' },
    { name: 'Red Sea Diving', cost: 40, rating: 4.8, type: 'Adventure', duration: 'Half day', bestTime: 'Morning', location: 'Hurghada/Sharm El Sheikh' },
    { name: 'Nile Cruise', cost: 100, rating: 4.7, type: 'Tour', duration: 'Multiple days', bestTime: 'Winter', location: 'Luxor to Aswan' },
    { name: 'Philae Temple', cost: 12, rating: 4.7, type: 'Archaeological Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Aswan' },
    { name: 'White Desert', cost: 60, rating: 4.9, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Morning', location: 'Western Desert' },
    { name: 'Siwa Oasis', cost: 0, rating: 4.8, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Morning', location: 'Western Desert' },
    { name: 'Coptic Cairo', cost: 0, rating: 4.7, type: 'Historic District', duration: '2-3 hours', bestTime: 'Morning', location: 'Cairo' },
    { name: 'Alexandria Library', cost: 5, rating: 4.6, type: 'Cultural Site', duration: '2 hours', bestTime: 'Morning', location: 'Alexandria' },
    { name: 'Mount Sinai', cost: 5, rating: 4.8, type: 'Religious Site', duration: 'Full day', bestTime: 'Sunrise', location: 'Sinai Peninsula' }
  ],
  'india': [
    { name: 'Taj Mahal', cost: 15, rating: 4.9, type: 'Monument', duration: '2-3 hours', bestTime: 'Sunrise', location: 'Agra' },
    { name: 'Amber Fort', cost: 7, rating: 4.7, type: 'Historical Site', duration: '3-4 hours', bestTime: 'Morning', location: 'Jaipur' },
    { name: 'Varanasi Ghats', cost: 0, rating: 4.8, type: 'Religious Site', duration: 'Half day', bestTime: 'Dawn/Dusk', location: 'Varanasi' },
    { name: 'Golden Temple', cost: 0, rating: 4.9, type: 'Religious Site', duration: '2-3 hours', bestTime: 'Evening', location: 'Amritsar' },
    { name: 'Jama Masjid', cost: 0, rating: 4.7, type: 'Religious Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Delhi' },
    { name: 'Mehrangarh Fort', cost: 6, rating: 4.8, type: 'Historical Site', duration: '3-4 hours', bestTime: 'Morning', location: 'Jodhpur' },
    { name: 'Ajanta & Ellora Caves', cost: 10, rating: 4.8, type: 'Archaeological Site', duration: 'Full day', bestTime: 'Morning', location: 'Aurangabad' },
    { name: 'Kerala Backwaters', cost: 50, rating: 4.9, type: 'Natural Landmark', duration: 'Full day', bestTime: 'October-March', location: 'Kerala' },
    { name: 'Qutub Minar', cost: 7, rating: 4.7, type: 'Monument', duration: '1-2 hours', bestTime: 'Morning', location: 'Delhi' },
    { name: 'Humayun\'s Tomb', cost: 7, rating: 4.8, type: 'Monument', duration: '1-2 hours', bestTime: 'Morning', location: 'Delhi' },
    { name: 'Periyar National Park', cost: 10, rating: 4.7, type: 'National Park', duration: 'Full day', bestTime: 'Winter', location: 'Kerala' },
    { name: 'Fatehpur Sikri', cost: 7, rating: 4.7, type: 'Historical Site', duration: 'Half day', bestTime: 'Morning', location: 'Agra' },
    { name: 'Elephanta Caves', cost: 7, rating: 4.6, type: 'Archaeological Site', duration: 'Half day', bestTime: 'Morning', location: 'Mumbai' },
    { name: 'Hawa Mahal', cost: 2, rating: 4.6, type: 'Historical Site', duration: '1 hour', bestTime: 'Morning', location: 'Jaipur' },
    { name: 'Darjeeling Himalayan Railway', cost: 5, rating: 4.7, type: 'Railway', duration: 'Half day', bestTime: 'Morning', location: 'Darjeeling' }
  ],
  'portugal': [
    { name: 'Belém Tower', cost: 6, rating: 4.6, type: 'Monument', duration: '1 hour', bestTime: 'Morning', location: 'Lisbon' },
    { name: 'Jerónimos Monastery', cost: 10, rating: 4.8, type: 'Religious Site', duration: '2 hours', bestTime: 'Morning', location: 'Lisbon' },
    { name: 'Pena Palace', cost: 14, rating: 4.8, type: 'Palace', duration: '3 hours', bestTime: 'Morning', location: 'Sintra' },
    { name: 'Douro Valley', cost: 0, rating: 4.9, type: 'Wine Region', duration: 'Full day', bestTime: 'September-October', location: 'Northern Portugal' },
    { name: 'Algarve Beaches', cost: 0, rating: 4.8, type: 'Beach', duration: 'Full day', bestTime: 'Summer', location: 'Southern Portugal' },
    { name: 'Livraria Lello', cost: 5, rating: 4.6, type: 'Bookstore', duration: '1 hour', bestTime: 'Morning', location: 'Porto' },
    { name: 'Alfama District', cost: 0, rating: 4.7, type: 'Historic District', duration: '2-3 hours', bestTime: 'Daytime', location: 'Lisbon' },
    { name: 'Porto Cathedral', cost: 3, rating: 4.6, type: 'Religious Site', duration: '1 hour', bestTime: 'Morning', location: 'Porto' },
    { name: 'Cabo da Roca', cost: 0, rating: 4.7, type: 'Natural Landmark', duration: '1 hour', bestTime: 'Sunset', location: 'Sintra' },
    { name: 'Oceanário de Lisboa', cost: 19, rating: 4.8, type: 'Aquarium', duration: '2-3 hours', bestTime: 'Weekday', location: 'Lisbon' },
    { name: 'Óbidos', cost: 0, rating: 4.7, type: 'Historic Town', duration: 'Half day', bestTime: 'Morning', location: 'Central Portugal' },
    { name: 'Monastery of Batalha', cost: 6, rating: 4.8, type: 'Religious Site', duration: '2 hours', bestTime: 'Morning', location: 'Batalha' },
    { name: 'Quinta da Regaleira', cost: 10, rating: 4.8, type: 'Estate', duration: '2-3 hours', bestTime: 'Morning', location: 'Sintra' },
    { name: 'Benagil Cave', cost: 25, rating: 4.8, type: 'Natural Landmark', duration: '2 hours', bestTime: 'Morning', location: 'Algarve' },
    { name: 'Azores Islands', cost: 0, rating: 4.9, type: 'Natural Landmark', duration: 'Multiple days', bestTime: 'Summer', location: 'Atlantic Ocean' }
  ],
  'netherlands': [
    { name: 'Rijksmuseum', cost: 20, rating: 4.8, type: 'Museum', duration: '3-4 hours', bestTime: 'Weekday', location: 'Amsterdam' },
    { name: 'Anne Frank House', cost: 14, rating: 4.8, type: 'Museum', duration: '1-2 hours', bestTime: 'Early morning', location: 'Amsterdam' },
    { name: 'Keukenhof Gardens', cost: 19, rating: 4.8, type: 'Garden', duration: 'Half day', bestTime: 'April-May', location: 'Lisse' },
    { name: 'Van Gogh Museum', cost: 19, rating: 4.7, type: 'Museum', duration: '2-3 hours', bestTime: 'Weekday', location: 'Amsterdam' },
    { name: 'Canal Cruise', cost: 18, rating: 4.6, type: 'Tour', duration: '1 hour', bestTime: 'Afternoon', location: 'Amsterdam' },
    { name: 'Kinderdijk Windmills', cost: 11, rating: 4.7, type: 'Historic Site', duration: '2-3 hours', bestTime: 'Morning', location: 'South Holland' },
    { name: 'Zaanse Schans', cost: 0, rating: 4.7, type: 'Historic Site', duration: 'Half day', bestTime: 'Morning', location: 'North Holland' },
    { name: 'Vondelpark', cost: 0, rating: 4.7, type: 'Park', duration: '1-2 hours', bestTime: 'Afternoon', location: 'Amsterdam' },
    { name: 'Heineken Experience', cost: 21, rating: 4.5, type: 'Brewery Tour', duration: '2 hours', bestTime: 'Afternoon', location: 'Amsterdam' },
    { name: 'Rotterdam Market Hall', cost: 0, rating: 4.6, type: 'Market', duration: '1-2 hours', bestTime: 'Lunch time', location: 'Rotterdam' },
    { name: 'Leiden Canals', cost: 0, rating: 4.7, type: 'Natural Landmark', duration: '2 hours', bestTime: 'Afternoon', location: 'Leiden' },
    { name: 'Cube Houses', cost: 3, rating: 4.6, type: 'Architecture', duration: '1 hour', bestTime: 'Daytime', location: 'Rotterdam' },
    { name: 'Hoge Veluwe National Park', cost: 11, rating: 4.8, type: 'National Park', duration: 'Full day', bestTime: 'Summer', location: 'Gelderland' },
    { name: 'Royal Palace Amsterdam', cost: 10, rating: 4.6, type: 'Palace', duration: '1-2 hours', bestTime: 'Morning', location: 'Amsterdam' },
    { name: 'Giethoorn', cost: 0, rating: 4.8, type: 'Village', duration: 'Full day', bestTime: 'Summer', location: 'Overijssel' }
  ],
  'south_korea': [
    { name: 'Gyeongbokgung Palace', cost: 3, rating: 4.7, type: 'Palace', duration: '2-3 hours', bestTime: 'Morning', location: 'Seoul' },
    { name: 'N Seoul Tower', cost: 10, rating: 4.6, type: 'Observation Tower', duration: '1-2 hours', bestTime: 'Sunset', location: 'Seoul' },
    { name: 'Bukchon Hanok Village', cost: 0, rating: 4.7, type: 'Historic District', duration: '2-3 hours', bestTime: 'Morning', location: 'Seoul' },
    { name: 'Myeongdong', cost: 0, rating: 4.6, type: 'Shopping District', duration: '2-3 hours', bestTime: 'Evening', location: 'Seoul' },
    { name: 'Jeju Island', cost: 0, rating: 4.8, type: 'Island', duration: 'Multiple days', bestTime: 'Spring/Fall', location: 'Jeju' },
    { name: 'DMZ Tour', cost: 50, rating: 4.7, type: 'Tour', duration: 'Full day', bestTime: 'Morning', location: 'North of Seoul' },
    { name: 'Changdeokgung Palace', cost: 3, rating: 4.7, type: 'Palace', duration: '2-3 hours', bestTime: 'Morning', location: 'Seoul' },
    { name: 'Busan Haeundae Beach', cost: 0, rating: 4.7, type: 'Beach', duration: 'Half day', bestTime: 'Summer', location: 'Busan' },
    { name: 'Lotte World', cost: 50, rating: 4.6, type: 'Theme Park', duration: 'Full day', bestTime: 'Weekday', location: 'Seoul' },
    { name: 'Namsan Park', cost: 0, rating: 4.7, type: 'Park', duration: '2-3 hours', bestTime: 'Afternoon', location: 'Seoul' },
    { name: 'Bulguksa Temple', cost: 5, rating: 4.7, type: 'Religious Site', duration: '2 hours', bestTime: 'Morning', location: 'Gyeongju' },
    { name: 'Gamcheon Culture Village', cost: 0, rating: 4.7, type: 'Village', duration: '2-3 hours', bestTime: 'Morning', location: 'Busan' },
    { name: 'Insadong', cost: 0, rating: 4.6, type: 'Shopping District', duration: '2 hours', bestTime: 'Afternoon', location: 'Seoul' },
    { name: 'Seoraksan National Park', cost: 4, rating: 4.8, type: 'National Park', duration: 'Full day', bestTime: 'Fall', location: 'Gangwon' },
    { name: 'Hongdae', cost: 0, rating: 4.7, type: 'Entertainment District', duration: 'Evening', bestTime: 'Night', location: 'Seoul' }
  ],
  'vietnam': [
    { name: 'Ha Long Bay', cost: 50, rating: 4.9, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Spring/Fall', location: 'Northern Vietnam' },
    { name: 'Hoi An Ancient Town', cost: 6, rating: 4.8, type: 'Historic District', duration: 'Full day', bestTime: 'Evening', location: 'Central Vietnam' },
    { name: 'Cu Chi Tunnels', cost: 5, rating: 4.7, type: 'Historical Site', duration: 'Half day', bestTime: 'Morning', location: 'Ho Chi Minh City vicinity' },
    { name: 'Imperial City', cost: 6, rating: 4.7, type: 'Historical Site', duration: 'Half day', bestTime: 'Morning', location: 'Hue' },
    { name: 'Mekong Delta', cost: 20, rating: 4.7, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Dry season', location: 'Southern Vietnam' },
    { name: 'Hanoi Old Quarter', cost: 0, rating: 4.7, type: 'Historic District', duration: 'Half day', bestTime: 'Evening', location: 'Hanoi' },
    { name: 'Phong Nha Caves', cost: 10, rating: 4.9, type: 'Natural Landmark', duration: 'Full day', bestTime: 'Dry season', location: 'Central Vietnam' },
    { name: 'Sapa Rice Terraces', cost: 0, rating: 4.8, type: 'Natural Landmark', duration: 'Multiple days', bestTime: 'September-November', location: 'Northern Vietnam' },
    { name: 'War Remnants Museum', cost: 2, rating: 4.7, type: 'Museum', duration: '2-3 hours', bestTime: 'Morning', location: 'Ho Chi Minh City' },
    { name: 'Marble Mountains', cost: 2, rating: 4.6, type: 'Natural Landmark', duration: '2-3 hours', bestTime: 'Morning', location: 'Da Nang' },
    { name: 'Temple of Literature', cost: 3, rating: 4.6, type: 'Historical Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Hanoi' },
    { name: 'Phu Quoc Island', cost: 0, rating: 4.7, type: 'Island', duration: 'Multiple days', bestTime: 'November-March', location: 'Southern Vietnam' },
    { name: 'Ba Na Hills', cost: 30, rating: 4.6, type: 'Theme Park', duration: 'Full day', bestTime: 'Weekday', location: 'Da Nang' },
    { name: 'Ho Chi Minh Mausoleum', cost: 0, rating: 4.6, type: 'Monument', duration: '1 hour', bestTime: 'Morning', location: 'Hanoi' },
    { name: 'Perfume Pagoda', cost: 5, rating: 4.6, type: 'Religious Site', duration: 'Full day', bestTime: 'January-March', location: 'Hanoi vicinity' }
  ],
  'turkey': [
    { name: 'Hagia Sophia', cost: 25, rating: 4.8, type: 'Religious/Historical Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Istanbul' },
    { name: 'Blue Mosque', cost: 0, rating: 4.7, type: 'Religious Site', duration: '1 hour', bestTime: 'Morning', location: 'Istanbul' },
    { name: 'Cappadocia', cost: 25, rating: 4.9, type: 'Natural Landmark', duration: 'Multiple days', bestTime: 'April-June/September-October', location: 'Central Anatolia' },
    { name: 'Pamukkale', cost: 9, rating: 4.7, type: 'Natural Landmark', duration: 'Half day', bestTime: 'Morning', location: 'Western Turkey' },
    { name: 'Ephesus', cost: 12, rating: 4.8, type: 'Archaeological Site', duration: 'Half day', bestTime: 'Morning', location: 'Western Turkey' },
    { name: 'Topkapi Palace', cost: 18, rating: 4.7, type: 'Palace', duration: '3-4 hours', bestTime: 'Morning', location: 'Istanbul' },
    { name: 'Grand Bazaar', cost: 0, rating: 4.6, type: 'Market', duration: '2-3 hours', bestTime: 'Morning', location: 'Istanbul' },
    { name: 'Bosphorus Cruise', cost: 12, rating: 4.7, type: 'Tour', duration: '2 hours', bestTime: 'Sunset', location: 'Istanbul' },
    { name: 'Antalya Old Town', cost: 0, rating: 4.7, type: 'Historic District', duration: '2-3 hours', bestTime: 'Evening', location: 'Antalya' },
    { name: 'Hierapolis', cost: 9, rating: 4.7, type: 'Archaeological Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Pamukkale' },
    { name: 'Gallipoli', cost: 0, rating: 4.8, type: 'Historical Site', duration: 'Full day', bestTime: 'Morning', location: 'Northwestern Turkey' },
    { name: 'Mount Nemrut', cost: 5, rating: 4.8, type: 'Archaeological Site', duration: 'Half day', bestTime: 'Sunrise/Sunset', location: 'Eastern Turkey' },
    { name: 'Dolmabahce Palace', cost: 12, rating: 4.7, type: 'Palace', duration: '2-3 hours', bestTime: 'Morning', location: 'Istanbul' },
    { name: 'Lycian Rock Tombs', cost: 3, rating: 4.7, type: 'Archaeological Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Dalyan' },
    { name: 'Sumela Monastery', cost: 8, rating: 4.7, type: 'Religious Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Trabzon' }
  ],
  'morocco': [
    { name: 'Djemaa el-Fna', cost: 0, rating: 4.7, type: 'Market/Square', duration: '2-3 hours', bestTime: 'Evening', location: 'Marrakech' },
    { name: 'Bahia Palace', cost: 3, rating: 4.6, type: 'Palace', duration: '1-2 hours', bestTime: 'Morning', location: 'Marrakech' },
    { name: 'Chefchaouen Blue City', cost: 0, rating: 4.8, type: 'Town', duration: 'Full day', bestTime: 'Morning', location: 'Northern Morocco' },
    { name: 'Fes el Bali', cost: 0, rating: 4.7, type: 'Historic District', duration: 'Full day', bestTime: 'Morning', location: 'Fes' },
    { name: 'Majorelle Garden', cost: 7, rating: 4.7, type: 'Garden', duration: '1-2 hours', bestTime: 'Morning', location: 'Marrakech' },
    { name: 'Ait Benhaddou', cost: 2, rating: 4.8, type: 'Historical Site', duration: '2-3 hours', bestTime: 'Morning', location: 'Atlas Mountains' },
    { name: 'Hassan II Mosque', cost: 12, rating: 4.8, type: 'Religious Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Casablanca' },
    { name: 'Medersa Bou Inania', cost: 2, rating: 4.7, type: 'Religious Site', duration: '1 hour', bestTime: 'Morning', location: 'Fes' },
    { name: 'Volubilis', cost: 7, rating: 4.7, type: 'Archaeological Site', duration: '2 hours', bestTime: 'Morning', location: 'Near Meknes' },
    { name: 'Todra Gorge', cost: 0, rating: 4.7, type: 'Natural Landmark', duration: '2-3 hours', bestTime: 'Morning', location: 'Atlas Mountains' },
    { name: 'Essaouira', cost: 0, rating: 4.7, type: 'Coastal Town', duration: 'Full day', bestTime: 'Morning', location: 'Western Morocco' },
    { name: 'Sahara Desert Tour', cost: 50, rating: 4.8, type: 'Natural Landmark', duration: 'Multiple days', bestTime: 'Spring/Fall', location: 'Southern Morocco' },
    { name: 'Chouara Tannery', cost: 1, rating: 4.5, type: 'Cultural Site', duration: '30 minutes', bestTime: 'Morning', location: 'Fes' },
    { name: 'El Badi Palace', cost: 2, rating: 4.6, type: 'Historical Site', duration: '1-2 hours', bestTime: 'Morning', location: 'Marrakech' },
    { name: 'Rabat Old Town', cost: 0, rating: 4.6, type: 'Historic District', duration: '2-3 hours', bestTime: 'Morning', location: 'Rabat' }
  ]}
  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#A569BD'];

  const analyzeExpenses = () => {
    if (!budget || !country || !days) return;
    
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const countryInfo = countryData[country.toLowerCase()] || countryData['usa'];
      const daysNum = parseInt(days);
      const budgetNum = parseInt(budget);
      
      // Calculate expenses based on days
      const accommodationTotal = countryInfo.accommodation * daysNum;
      const foodTotal = countryInfo.food * daysNum;
      const transportationTotal = countryInfo.transportation * daysNum;
      const attractionsTotal = countryInfo.attractions * daysNum;
      const miscTotal = countryInfo.misc * daysNum;
      
      const totalExpenses = accommodationTotal + foodTotal + transportationTotal + attractionsTotal + miscTotal;
      const remainingBudget = budgetNum - totalExpenses;
      
      // Filter attractions that fit in budget
      const attractions = attractionData[country.toLowerCase()] || attractionData['usa'];
      const affordableAttractions = attractions.filter(attr => attr.cost <= remainingBudget / 2); // Assuming multiple visits
      
      setAnalysis({
        totalBudget: budgetNum,
        expenseData: [
          { name: 'Accommodation', value: accommodationTotal },
          { name: 'Food', value: foodTotal },
          { name: 'Transportation', value: transportationTotal },
          { name: 'Attractions', value: attractionsTotal },
          { name: 'Miscellaneous', value: miscTotal }
        ],
        totalExpenses,
        remainingBudget,
        affordableAttractions: affordableAttractions.sort((a, b) => b.rating - a.rating),
        isBudgetSufficient: remainingBudget >= 0
      });
      
      setLoading(false);
      setStep(2); // Move to results page after analysis is complete
    }, 1000);
  };

  // Go back to input page
  const handleBack = () => {
    setStep(1);
  };

  // Store the analysis in sessionStorage
  useEffect(() => {
    const savedAnalysis = sessionStorage.getItem("budget-analysis");
    if (savedAnalysis) {
      setAnalysis(JSON.parse(savedAnalysis));
    }
  }, []);

  useEffect(() => {
    if (analysis) {
      sessionStorage.setItem("budget-analysis", JSON.stringify(analysis));
    }
  }, [analysis]);

  return (
    <div className="fixed top-[17%] rounded-xl h-[80%] left-[10%] w-[80%] bg-black/15 flex flex-col ">
            <div className="mt-6 ml-[74%] h-[10%] text-3xl flex-end font-pixel mb-6 bg-gradient-to-r from-violet-400 to-orange-500 bg-clip-text text-transparent">
                <p className="flex flex-row">
                    PENNY PATH
                </p>
            </div>
            <div className='flex flex-col items-center justify-center overflow-y-auto scrollbar-none'>
      {step === 1 && (
        <div className="rounded-xl w-3/4 bg-black/15 p-6 backdrop-blur-sm border border-purple-500/30">
          <div className="mb-6 tracking-widest bg-gradient-to-r from-violet-400 to-orange-500 bg-clip-text text-transparent font-pixel">
            Route Details
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2 text-purple-100 font-pixel text-xs">
                <span className="text-orange-300 mr-2">📊</span>
                <span>Budget Amount</span>
              </div>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full p-3 rounded bg-black/20 border border-orange-400/30 text-orange-300 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-pixel text-xs"
                placeholder="Enter your total budget in USD"
              />
            </div>
            
            <div>
              <div className="flex items-center mb-2 text-purple-100 font-pixel text-xs">
                <span className="text-orange-300 mr-2">🌎</span>
                <span>Destination Country</span>
              </div>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-3 rounded bg-black/20 border border-orange-400/30 text-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-pixel text-xs"
              >
                <option value="">Select a country</option>
                <option value="australia" className='bg-black/20'>Australia</option>
                <option value="brazil">Brazil</option>
                <option value="canada">Canada</option>
                <option value="egypt">Egypt</option>
                <option value="france">France</option>
                <option value="germany">Germany</option>
                <option value="greece">Greece</option>
                <option value="india">India</option>
                <option value="italy">Italy</option>
                <option value="japan">Japan</option>
                <option value="mexico">Mexico</option>
                <option value="singapore">Singapore</option>
                <option value="spain">Spain</option>
                <option value="thailand">Thailand</option>
                <option value="uk">United Kingdom</option>
                <option value="usa">United States</option>
              </select>
            </div>
            
            <div>
              <div className="flex items-center mb-2 text-purple-100 font-pixel text-xs">
                <span className="text-orange-300 mr-2">⏱</span>
                <span>Number of Days</span>
              </div>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full p-3 rounded bg-black/20 border border-orange-400/30 text-orange-300 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-pixel text-xs"
                placeholder="Duration of your trip"
              />
            </div>
          </div>
          
          <button
            onClick={analyzeExpenses}
            className="w-full p-3 mt-6 rounded bg-purple-500/40 hover:bg-purple-600/40 text-orange-300 font-pixel text-xs tracking-wider transition-colors border border-orange-400/30"
          >
            Continue to Budget Analysis
          </button>
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="rounded-xl w-3/4 mt-4 bg-black/15 p-6 backdrop-blur-sm border border-purple-500/30 text-center">
          <div className="inline-block">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce delay-200"></div>
            </div>
            <span className="block mt-4 text-orange-300 font-pixel text-xs">Computing travel budget...</span>
          </div>
        </div>
      )}
      
      {/* Results Page - Step 2 */}
      {step === 2 && analysis && !loading && (
        <div className="rounded-xl bg-black/15 mt-[30%] w-6/7 backdrop-blur-sm border border-purple-500/30 p-6">
          <div className={`p-4 mb-6 rounded ${analysis.isBudgetSufficient ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'} border`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-orange-200 mb-1 font-pixel text-xs">Total Budget:</p>
                <p className="text-xl text-purple-100 font-pixel">${analysis.totalBudget}</p>
              </div>
              <div>
                <p className="text-orange-200 mb-1 font-pixel text-xs">Estimated Expenses:</p>
                <p className="text-xl text-purple-100 font-pixel">${analysis.totalExpenses}</p>
              </div>
              <div>
                <p className="text-orange-200 mb-1 font-pixel text-xs">Remaining Budget:</p>
                <p className={`text-xl ${analysis.remainingBudget >= 0 ? 'text-green-400' : 'text-red-400'} font-pixel`}>
                  ${analysis.remainingBudget}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-orange-200 mb-3 font-pixel text-xs">Expense Breakdown</div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analysis.expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analysis.expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <div className="text-orange-200 mb-3 font-pixel text-xs">Expense Details</div>
              <div className="space-y-2">
                {analysis.expenseData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border-b border-purple-700/30 font-pixel text-xs text-purple-100">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span>{item.name}</span>
                    </div>
                    <span>${item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-2 border-b border-purple-700/30 font-bold font-pixel text-xs text-purple-100">
                  <span>Total</span>
                  <span>${analysis.totalExpenses}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Attractions */}
          <div className="mt-6">
            <div className="text-orange-200 mb-3 font-pixel text-xs">Recommended Attractions</div>
            
            {analysis.affordableAttractions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.affordableAttractions.slice(0, 6).map((attraction, index) => (
                  <div key={index} className="p-3 bg-black/20 rounded border border-orange-400/30 font-pixel text-xs">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-purple-100">{attraction.name}</h4>
                      <span className="text-yellow-300">{attraction.rating} ★</span>
                    </div>
                    <div className="mt-2">
                      <span className={attraction.cost === 0 ? 'text-green-400' : 'text-orange-300'}>
                        {attraction.cost === 0 ? 'Free Entry' : `$${attraction.cost} per person`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-4 bg-red-900/30 rounded border border-red-500/30 font-pixel text-xs text-red-300">
                No attractions available within your remaining budget. Consider increasing your budget or reducing your stay.
              </p>
            )}
          </div>

          {/* Budget Tips */}
          <div className="mt-6">
            <div className="text-orange-200 mb-3 font-pixel text-xs">Budget Tips</div>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-orange-300 mr-2">💡</span>
                <span className="font-pixel text-xs text-purple-100">Book accommodations with kitchen facilities to save on food expenses.</span>
              </div>
              <div className="flex items-start">
                <span className="text-orange-300 mr-2">💡</span>
                <span className="font-pixel text-xs text-purple-100">Look for city passes that bundle multiple attractions at a discount.</span>
              </div>
              <div className="flex items-start">
                <span className="text-orange-300 mr-2">💡</span>
                <span className="font-pixel text-xs text-purple-100">Use public transportation instead of taxis to save on transportation costs.</span>
              </div>
              <div className="flex items-start">
                <span className="text-orange-300 mr-2">💡</span>
                <span className="font-pixel text-xs text-purple-100">Research free activities and attractions to maximize your experience.</span>
              </div>
              {analysis.remainingBudget < 0 && (
                <div className="flex items-start">
                  <span className="text-red-300 mr-2">⚠</span>
                  <span className="text-red-300 font-pixel text-xs">Your current budget appears insufficient. Consider extending your budget by approximately ${Math.abs(analysis.remainingBudget)} or reducing your stay.</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="tracking-widest bg-gradient-to-r from-violet-400 to-orange-500 bg-clip-text text-transparent font-pixel"></div>
            <button 
              onClick={handleBack} 
              className="px-4 py-2 rounded bg-purple-500/40 hover:bg-purple-600/40 text-orange-300 font-pixel text-xs tracking-wider transition-colors border border-orange-400/30 flex items-center"
            >
              <span className="mr-1">←</span> Back
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}