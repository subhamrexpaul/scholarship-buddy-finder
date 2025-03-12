
import React, { useState, useEffect } from 'react';
import { scholarships } from '@/data/scholarships';
import ScholarshipCard from '@/components/ScholarshipCard';
import SearchFilters from '@/components/SearchFilters';
import { Scholarship, StudyLevel } from '@/types';
import { getRecommendedScholarships } from '@/utils/recommendations';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ScholarshipsPage = () => {
  const { currentUser, userProfile } = useAuth();
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>(scholarships);
  const [recommendedScholarships, setRecommendedScholarships] = useState<{scholarship: Scholarship, score: number}[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // If user is logged in and has a complete profile, generate recommendations
    if (currentUser && userProfile) {
      const recommendations = getRecommendedScholarships(scholarships, userProfile);
      setRecommendedScholarships(recommendations);
    }
    
    // In a real app, we would fetch the user's saved scholarships from the backend
    if (currentUser) {
      // Mock saved scholarships for demonstration
      setSavedScholarships(['1', '4']); // Example IDs
    }
  }, [currentUser, userProfile]);

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
    setActiveTab("all");
  };

  const handleSaveScholarship = (id: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save scholarships",
      });
      return;
    }
    
    if (savedScholarships.includes(id)) {
      // Remove from saved
      setSavedScholarships(savedScholarships.filter(scholarshipId => scholarshipId !== id));
    } else {
      // Add to saved
      setSavedScholarships([...savedScholarships, id]);
    }
  };

  let displayedScholarships = filteredScholarships;
  
  if (activeTab === "recommended") {
    displayedScholarships = recommendedScholarships.map(rec => rec.scholarship);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={!!currentUser} userName={currentUser?.name} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Available Scholarships</h1>
        
        <div className="mb-8">
          <SearchFilters onSearch={handleSearch} />
        </div>
        
        {currentUser && userProfile && recommendedScholarships.length > 0 && (
          <Tabs 
            defaultValue="all" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-8"
          >
            <TabsList>
              <TabsTrigger value="all">All Scholarships</TabsTrigger>
              <TabsTrigger value="recommended">Recommended For You</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedScholarships.length > 0 ? (
            displayedScholarships.map((scholarship) => {
              const isRecommended = activeTab === "recommended";
              const matchScore = isRecommended 
                ? recommendedScholarships.find(rec => rec.scholarship.id === scholarship.id)?.score
                : undefined;
              
              return (
                <ScholarshipCard 
                  key={scholarship.id}
                  scholarship={scholarship}
                  isSaved={savedScholarships.includes(scholarship.id)}
                  onSave={handleSaveScholarship}
                  matchScore={matchScore}
                />
              );
            })
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-xl text-muted-foreground">No scholarships match your search criteria.</p>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipsPage;
