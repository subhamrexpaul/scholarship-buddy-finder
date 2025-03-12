
import React from 'react';
import { scholarships } from '@/data/scholarships';
import ScholarshipCard from '@/components/ScholarshipCard';
import SearchFilters from '@/components/SearchFilters';

const ScholarshipsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Available Scholarships</h1>
      
      <div className="mb-8">
        <SearchFilters />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scholarships.map((scholarship) => (
          <ScholarshipCard 
            key={scholarship.id}
            scholarship={scholarship}
          />
        ))}
      </div>
    </div>
  );
};

export default ScholarshipsPage;
