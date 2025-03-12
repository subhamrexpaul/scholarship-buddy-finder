
import React, { useState } from 'react';
import { scholarships } from '@/data/scholarships';
import ScholarshipCard from '@/components/ScholarshipCard';
import SearchFilters from '@/components/SearchFilters';
import { Scholarship, StudyLevel } from '@/types';

const ScholarshipsPage = () => {
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>(scholarships);

  const handleSearch = (filters: {
    keyword: string;
    studyLevel?: StudyLevel | "";
    minAmount: number;
    maxAmount: number;
    isDeadlineSoon: boolean;
  }) => {
    const filtered = scholarships.filter((scholarship) => {
      // Filter by keyword (name, provider, or description)
      const keywordMatch = filters.keyword === "" || 
        scholarship.name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        scholarship.provider.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        scholarship.description.toLowerCase().includes(filters.keyword.toLowerCase());
      
      // Filter by study level
      const studyLevelMatch = !filters.studyLevel || 
        !scholarship.eligibility.studyLevel || 
        scholarship.eligibility.studyLevel.includes(filters.studyLevel as StudyLevel);
      
      // Filter by amount
      const amountMatch = 
        scholarship.amount.value >= filters.minAmount && 
        scholarship.amount.value <= filters.maxAmount;
      
      // Filter by deadline (within 30 days)
      const deadlineDate = new Date(scholarship.deadline);
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      const deadlineMatch = !filters.isDeadlineSoon || 
        (deadlineDate >= today && deadlineDate <= thirtyDaysFromNow);
      
      return keywordMatch && studyLevelMatch && amountMatch && deadlineMatch;
    });
    
    setFilteredScholarships(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Available Scholarships</h1>
      
      <div className="mb-8">
        <SearchFilters onSearch={handleSearch} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScholarships.length > 0 ? (
          filteredScholarships.map((scholarship) => (
            <ScholarshipCard 
              key={scholarship.id}
              scholarship={scholarship}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-xl text-muted-foreground">No scholarships match your search criteria.</p>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipsPage;
