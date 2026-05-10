'use client';

import { useState } from 'react';
import { X, Plus, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Settings() {
  const [fullName, setFullName] = useState('Arjun Malhotra');
  const [email, setEmail] = useState('arjun.travels@worldexplorer.com');
  const [language, setLanguage] = useState('English (United States)');
  const [timezone, setTimezone] = useState('IST (UTC +5:30)');
  const [savedDestinations, setSavedDestinations] = useState(['Mumbai', 'Kolkata', 'Bali', 'Tokyo', 'Paris']);
  const [newDestination, setNewDestination] = useState('');

  const handleAddDestination = () => {
    if (newDestination.trim()) {
      setSavedDestinations([...savedDestinations, newDestination]);
      setNewDestination('');
    }
  };

  const handleRemoveDestination = (index: number) => {
    setSavedDestinations(savedDestinations.filter((_, i) => i !== index));
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', { fullName, email, language, timezone });
    // TODO: Add backend API call
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Delete account');
      // TODO: Add backend API call
    }
  };

  return (
    <div className="ml-40 p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-slate-600 mt-2">Manage your profile information and travel preferences.</p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 bg-teal-100 rounded-full border-4 border-gray-200 flex items-center justify-center">
            <User size={56} className="text-teal-600" />
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
            <p className="text-gray-600 mt-1">{email}</p>
            <div className="flex gap-2 mt-3">
              <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
                PREMIUM MEMBER
              </span>
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                EARLY EXPLORER
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Full Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Email Address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language Preference</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            >
              <option>English (United States)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Hindi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            >
              <option>IST (UTC +5:30)</option>
              <option>UTC</option>
              <option>EST (UTC -5:00)</option>
              <option>PST (UTC -8:00)</option>
              <option>GMT (UTC +0:00)</option>
              <option>CET (UTC +1:00)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Saved Destinations */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Saved Destinations</h3>
        <p className="text-gray-600 text-sm mb-4">Cities and regions you're currently watching for deals</p>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {savedDestinations.map((destination, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              {destination}
              <button
                onClick={() => handleRemoveDestination(index)}
                className="ml-1 hover:text-gray-900 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newDestination}
            onChange={(e) => setNewDestination(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddDestination()}
            placeholder="Add a destination"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <button
            onClick={handleAddDestination}
            className="inline-flex items-center gap-2 px-4 py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
          >
            <Plus size={18} />
            Add Destination
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSaveChanges}
          className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2"
        >
          Save Changes
        </button>
        <button
          onClick={handleDeleteAccount}
          className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-1 font-medium"
        >
          <Trash2 size={18} />
          Delete Account
        </button>
      </div>
    </div>
  );
}
