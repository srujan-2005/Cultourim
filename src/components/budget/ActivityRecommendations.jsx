import React, { useState } from 'react';
import { Activity, Destination } from './data/destinations';
import { CalendarDays, Search, Tag } from 'lucide-react';

// Calculate ActivityRecommendations component with provided props
const ActivityRecommendations = ({ destination, budget }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calculate activity budget (15% of total)
  const activityBudget = budget * 0.15;
  
  // Filter activities based on selected category and search term
  const filteredActivities = destination.averageCosts.activities.filter(activity => {
    const matchesCategory = filter === 'all' || activity.category === filter;
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Sort activities by affordability (those within budget first)
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    // First, put affordable activities first
    const aAffordable = a.cost <= activityBudget;
    const bAffordable = b.cost <= activityBudget;
    
    if (aAffordable && !bAffordable) return -1;
    if (!aAffordable && bAffordable) return 1;
    
    // Then sort by cost (low to high)
    return a.cost - b.cost;
  });
  
  // Category colors
  const categoryColors = {
    culture: 'bg-blue-100 text-blue-800',
    nature: 'bg-green-100 text-green-800',
    adventure: 'bg-orange-100 text-orange-800',
    relaxation: 'bg-purple-100 text-purple-800',
    food: 'bg-red-100 text-red-800',
  };
  
  return (
    <div className="card mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Recommended Activities</h2>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === 'all' 
              ? 'bg-navy text-white' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('culture')}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === 'culture' 
              ? 'bg-blue-600 text-white' 
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          Culture
        </button>
        <button
          onClick={() => setFilter('nature')}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === 'nature' 
              ? 'bg-green-600 text-white' 
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          Nature
        </button>
        <button
          onClick={() => setFilter('adventure')}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === 'adventure' 
              ? 'bg-orange-600 text-white' 
              : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
          }`}
        >
          Adventure
        </button>
        <button
          onClick={() => setFilter('relaxation')}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === 'relaxation' 
              ? 'bg-purple-600 text-white' 
              : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
          }`}
        >
          Relaxation
        </button>
        <button
          onClick={() => setFilter('food')}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === 'food' 
              ? 'bg-red-600 text-white' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          Food
        </button>
      </div>
      
      <div className="space-y-4">
        {sortedActivities.length > 0 ? (
          sortedActivities.map((activity, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                activity.cost <= activityBudget 
                  ? 'border-teal/20 bg-teal/5' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{activity.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <div className="flex items-center mt-2 gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${categoryColors[activity.category]}`}>
                      {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-lg ${
                    activity.cost <= activityBudget ? 'text-teal' : 'text-gray-400'
                  }`}>
                    ${activity.cost}
                  </span>
                  <div className="mt-1">
                    {activity.cost === 0 ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Free</span>
                    ) : activity.cost <= activityBudget ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Within Budget</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Over Budget</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No activities found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityRecommendations;