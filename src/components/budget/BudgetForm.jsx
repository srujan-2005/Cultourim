
import React, { useState } from 'react';
import { destinations } from '../data/destinations';

const BudgetForm = ({ onBudgetSubmit }) => {
  const [budget, setBudget] = useState(1000);
  const [destinationId, setDestinationId] = useState('bali');
  const [days, setDays] = useState(7);

  const handleSubmit = (e) => {
    e.preventDefault();
    onBudgetSubmit(budget, destinationId, days);
  };

  return (
    <div className="card" id="budget">
      <h2 className="text-2xl font-bold mb-6 text-center">Plan Your Budget</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="budget" className="block mb-2 font-medium">
            Total Budget (USD)
          </label>
          <input
            type="number"
            id="budget"
            min="100"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="input-field"
            required
          />
        </div>
        
        <div>
          <label htmlFor="destination" className="block mb-2 font-medium">
            Destination
          </label>
          <select
            id="destination"
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className="input-field"
            required
          >
            {destinations.map((destination) => (
              <option key={destination.id} value={destination.id}>
                {destination.name}, {destination.country}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="days" className="block mb-2 font-medium">
            Number of Days
          </label>
          <input
            type="number"
            id="days"
            min="1"
            max="30"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="input-field"
            required
          />
        </div>
        
        <button type="submit" className="btn-primary w-full mt-6">
          Calculate My Budget
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;