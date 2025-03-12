
import React, { useState, useEffect } from 'react';
import ScholarshipCard from '@/components/ScholarshipCard';
import SearchFilters from '@/components/SearchFilters';
import { Scholarship, StudyLevel } from '@/types';
import { getRecommendedScholarships } from '@/utils/recommendations';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

const ScholarshipsPage = () => {
  const { currentUser, userProfile } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [recommendedScholarships, setRecommendedScholarships] = useState<{scholarship: Scholarship, score: number}[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch scholarships from Supabase
    const fetchScholarships = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from('scholarships').select('*');
        
        if (error) {
          console.error('Error fetching scholarships:', error);
          toast({
            title: "Error",
            description: "Failed to load scholarships",
            variant: "destructive"
          });
          return;
        }
        
        // Transform data to match Scholarship type
        const formattedScholarships: Scholarship[] = data.map(item => ({
          id: item.id,
          name: item.name,
          provider: item.provider,
          description: item.description,
          eligibility: item.eligibility,
          amount: item.amount,
          deadline: item.deadline,
          applicationLink: item.application_link,
          tags: item.tags,
          featured: item.featured
        }));
        
        setScholarships(formattedScholarships);
        setFilteredScholarships(formattedScholarships);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  useEffect(() => {
    // If user is logged in and has a complete profile, generate recommendations
    if (currentUser && userProfile && scholarships.length > 0) {
      const recommendations = getRecommendedScholarships(scholarships, userProfile);
      setRecommendedScholarships(recommendations);
    }
    
    // Fetch user's saved scholarships if logged in
    const fetchSavedScholarships = async () => {
      if (!currentUser) return;
      
      try {
        const { data, error } = await supabase
          .from('saved_scholarships')
          .select('scholarship_id')
          .eq('user_id', currentUser.id);
        
        if (error) {
          console.error('Error fetching saved scholarships:', error);
          return;
        }
        
        if (data) {
          setSavedScholarships(data.map(item => item.scholarship_id));
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchSavedScholarships();
  }, [currentUser, userProfile, scholarships]);

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

  const handleSaveScholarship = async (id: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save scholarships",
      });
      return;
    }
    
    try {
      if (savedScholarships.includes(id)) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_scholarships')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('scholarship_id', id);
          
        if (error) {
          console.error('Error removing scholarship:', error);
          toast({
            title: "Error",
            description: "Failed to remove scholarship",
            variant: "destructive"
          });
          return;
        }
        
        setSavedScholarships(savedScholarships.filter(scholarshipId => scholarshipId !== id));
        
        toast({
          title: "Scholarship removed",
          description: "Scholarship has been removed from your saved list",
        });
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_scholarships')
          .insert({
            user_id: currentUser.id,
            scholarship_id: id,
            status: 'Planning to Apply'
          });
          
        if (error) {
          console.error('Error saving scholarship:', error);
          toast({
            title: "Error",
            description: "Failed to save scholarship",
            variant: "destructive"
          });
          return;
        }
        
        setSavedScholarships([...savedScholarships, id]);
        
        toast({
          title: "Scholarship saved",
          description: "Scholarship has been added to your saved list",
        });
      }
    } catch (error) {
      console.error('Error handling save:', error);
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
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ScholarshipsPage;
