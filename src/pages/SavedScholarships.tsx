
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScholarshipCard from '@/components/ScholarshipCard';
import Navbar from '@/components/Navbar';
import { savedScholarships } from '@/data/scholarships';
import { scholarships } from '@/data/scholarships';
import { SavedScholarship, ScholarshipStatus, Scholarship } from '@/types';
import { toast } from '@/hooks/use-toast';

const SavedScholarshipsPage = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useAuth();
  const [userSavedScholarships, setUserSavedScholarships] = useState<SavedScholarship[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("all");
  
  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access saved scholarships",
        variant: "destructive"
      });
      navigate('/sign-in');
      return;
    }
    
    // Get user's saved scholarships
    if (currentUser) {
      // In a real app, this would be an API call
      const userSaved = savedScholarships.filter(
        saved => saved.userId === currentUser.id
      );
      setUserSavedScholarships(userSaved as SavedScholarship[]);
    }
  }, [currentUser, isLoading, navigate]);
  
  const getScholarshipById = (id: string): Scholarship | undefined => {
    return scholarships.find(scholarship => scholarship.id === id);
  };
  
  const handleStatusChange = (scholarshipId: string, newStatus: ScholarshipStatus) => {
    // In a real app, this would be an API call
    const updatedScholarships = userSavedScholarships.map(saved => {
      if (saved.scholarshipId === scholarshipId) {
        return { ...saved, status: newStatus };
      }
      return saved;
    });
    
    setUserSavedScholarships(updatedScholarships);
    
    toast({
      title: "Status updated",
      description: `Scholarship status changed to ${newStatus}`,
    });
  };
  
  const handleRemove = (scholarshipId: string) => {
    // In a real app, this would be an API call
    const updatedScholarships = userSavedScholarships.filter(
      saved => saved.scholarshipId !== scholarshipId
    );
    
    setUserSavedScholarships(updatedScholarships);
    
    toast({
      title: "Scholarship removed",
      description: "The scholarship has been removed from your saved list",
    });
  };
  
  const filteredScholarships = currentTab === "all" 
    ? userSavedScholarships 
    : userSavedScholarships.filter(saved => saved.status === currentTab);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={!!currentUser} userName={currentUser?.name} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Saved Scholarships</h1>
        
        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value={ScholarshipStatus.Planning}>Planning to Apply</TabsTrigger>
            <TabsTrigger value={ScholarshipStatus.Applied}>Applied</TabsTrigger>
            <TabsTrigger value={ScholarshipStatus.Accepted}>Accepted</TabsTrigger>
            <TabsTrigger value={ScholarshipStatus.Rejected}>Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value={currentTab} className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScholarships.length > 0 ? (
                filteredScholarships.map((saved) => {
                  const scholarship = getScholarshipById(saved.scholarshipId);
                  if (!scholarship) return null;
                  
                  return (
                    <div key={saved.scholarshipId} className="relative">
                      <ScholarshipCard
                        scholarship={scholarship}
                        isSaved={true}
                        savedStatus={saved.status}
                      />
                      
                      <div className="mt-4 flex flex-col gap-2">
                        <select 
                          value={saved.status}
                          onChange={(e) => handleStatusChange(saved.scholarshipId, e.target.value as ScholarshipStatus)}
                          className="block w-full rounded-md border border-gray-300 p-2 bg-white text-sm"
                        >
                          <option value={ScholarshipStatus.Planning}>Planning to Apply</option>
                          <option value={ScholarshipStatus.Applied}>Applied</option>
                          <option value={ScholarshipStatus.Accepted}>Accepted</option>
                          <option value={ScholarshipStatus.Rejected}>Rejected</option>
                        </select>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                          onClick={() => handleRemove(saved.scholarshipId)}
                        >
                          Remove from saved
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-xl text-muted-foreground mb-4">
                    {currentTab === "all" 
                      ? "You don't have any saved scholarships yet."
                      : `You don't have any scholarships with status "${currentTab}".`
                    }
                  </p>
                  
                  <Button 
                    onClick={() => navigate('/scholarships')}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Browse Scholarships
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SavedScholarshipsPage;
