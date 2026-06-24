
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { destinations, getDestinationById } from '../data/destinations';
import { fetchCountryData } from '../utils/countryApi';
import { useToast } from '../hooks/use-toast';
import BudgetBreakdown from './BudgetBreakdown';
import { 
  DollarSign, MapPin, Calendar, Compass, 
  Plane, RefreshCcw
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

const TravelBudgetPlanner = () => {
  const { toast } = useToast();
  
  // Budget form state
  const [budget, setBudget] = useState(1000);
  const [destinationId, setDestinationId] = useState('bali');
  const [days, setDays] = useState(7);
  
  // Results state
  const [planCreated, setPlanCreated] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  
  // Fetch country data from the API
  const { data: countryData, isLoading, isError } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountryData
  });
  
  // Update destinations with API data when available
  useEffect(() => {
    if (countryData && countryData.length > 0) {
      // Map API country data to our destinations where possible
      destinations.forEach(destination => {
        const matchingCountry = countryData.find(
          country => 
            country.name.common.toLowerCase() === destination.country.toLowerCase() ||
            country.name.official.toLowerCase() === destination.country.toLowerCase()
        );
        
        if (matchingCountry) {
          // Update destination with real-time data
          if (matchingCountry.currencies) {
            const currencyCode = Object.keys(matchingCountry.currencies)[0];
            const currency = matchingCountry.currencies[currencyCode];
            
            destination.currency = currency.name;
            destination.currencyCode = currencyCode;
            destination.currencySymbol = currency.symbol;
          }
          
          if (matchingCountry.flags && matchingCountry.flags.svg) {
            destination.flagUrl = matchingCountry.flags.svg;
          }
          
          if (matchingCountry.capital && matchingCountry.capital.length > 0) {
            destination.capital = matchingCountry.capital[0];
          }
          
          if (matchingCountry.languages) {
            destination.languages = Object.values(matchingCountry.languages);
          }
          
          destination.population = matchingCountry.population;
          destination.region = matchingCountry.region;
        }
      });
    }
  }, [countryData]);
  
  // Handle budget form submission
  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    
    const destination = getDestinationById(destinationId);
    
    if (!destination) {
      toast({
        title: "Error",
        description: "Selected destination not found.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedDestination(destination);
    setPlanCreated(true);
    
    // Scroll to results on mobile
    setTimeout(() => {
      const resultsSection = document.getElementById('results-section');
      if (resultsSection && window.innerWidth < 768) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    toast({
      title: "Budget Plan Created!",
      description: `Your ${days}-day trip to ${destination.name} with $${budget} budget is ready.`,
    });
  };
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal/5">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-teal to-blue-500 bg-clip-text text-transparent">
            Travel Budget Planner
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Plan your perfect trip with a budget that works for you. Explore destinations, calculate costs, and make the most of your travel experience.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Budget Form */}
          <div>
            <div className="card backdrop-blur-sm bg-white/80 border border-gray-100 shadow-xl rounded-xl overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-teal/5 to-blue-500/10">
                <h2 className="text-2xl font-bold mb-6 text-center">Plan Your Budget</h2>
                
                <form onSubmit={handleBudgetSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="budget" className="mb-2 font-medium flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-teal" />
                      Total Budget (USD)
                    </label>
                    <input
                      type="number"
                      id="budget"
                      min="100"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="input-field focus:ring-teal focus:border-teal"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="destination" className=" mb-2 font-medium flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-teal" />
                      Destination
                    </label>
                    
                    <div className="relative">
                      <select
                        id="destination"
                        value={destinationId}
                        onChange={(e) => setDestinationId(e.target.value)}
                        className="input-field focus:ring-teal focus:border-teal pr-10"
                        required
                      >
                        {destinations.map((destination) => (
                          <option key={destination.id} value={destination.id}>
                            {destination.name}, {destination.country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="days" className=" mb-2 font-medium flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-teal" />
                      Number of Days
                    </label>
                    <input
                      type="number"
                      id="days"
                      min="1"
                      max="30"
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="input-field focus:ring-teal focus:border-teal"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn-primary w-full mt-6 flex items-center justify-center gap-2 transition-all hover:shadow-lg bg-gradient-to-r from-teal to-blue-500 text-white py-3 px-4 rounded-lg"
                  >
                    <Compass className="w-4 h-4" />
                    Calculate My Budget
                  </button>
                </form>
              </div>
              
              {/* Trip Options Section */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/80">
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 p-2 hover:bg-gray-100 rounded-md">
                    <span>Trip Options</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 pt-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="guided" />
                      <label htmlFor="guided" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Guided tours included
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="insurance" />
                      <label htmlFor="insurance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Travel insurance
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="family" />
                      <label htmlFor="family" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Family-friendly activities
                      </label>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="md:col-span-2" id="results-section">
            {planCreated && selectedDestination ? (
              <>
                <div className="border-l-4 border-teal px-4 py-3 bg-gradient-to-r from-teal/5 to-blue-500/5 mb-8 rounded-r-lg shadow-md">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Plane className="w-5 h-5 text-teal" />
                    Your Trip to {selectedDestination.name}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {days} days with a budget of ${budget.toLocaleString()}
                  </p>
                </div>
                
                <BudgetBreakdown 
                  destination={selectedDestination} 
                  budget={budget} 
                  days={days} 
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 bg-gradient-to-br from-white to-teal/5 rounded-lg shadow-md border border-gray-100">
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-teal to-blue-500 bg-clip-text text-transparent">
                    Start Planning Your Trip
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Enter your budget and destination details on the left to get personalized recommendations and a budget breakdown.
                  </p>
                  <div className="bg-teal/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plane className="h-8 w-8 text-teal" />
                  </div>
                  {isLoading ? (
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                      <RefreshCcw className="animate-spin h-4 w-4" />
                      Loading destination data...
                    </p>
                  ) : isError ? (
                    <p className="text-sm text-red-500">
                      Could not load all destination data. Some features may be limited.
                    </p>
                  ) : (
                    <p className="text-sm text-teal">
                      {destinations.length} destinations available for planning
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelBudgetPlanner;