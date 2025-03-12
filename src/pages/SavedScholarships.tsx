
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScholarshipCard from '@/components/ScholarshipCard';
import Navbar from '@/components/Navbar';
import { SavedScholarship, ScholarshipStatus, Scholarship } from '@/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SavedScholarshipsPage = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading: authLoading } = useAuth();
  const [userSavedScholarships, setUserSavedScholarships] = useState<SavedScholarship[]>([]);
  const [scholarshipDetails, setScholarshipDetails] = useState<Record<string, Scholarship>>({});
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!authLoading && !currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access saved scholarships",
        variant: "destructive"
      });
      navigate('/sign-in');
      return;
    }
    
    // Get user's saved scholarships
    const fetchSavedScholarships = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('saved_scholarships')
          .select('*')
          .eq('user_id', currentUser.id);
        
        if (error) {
          console.error('Error fetching saved scholarships:', error);
          toast({
            title: "Error",
            description: "Failed to load saved scholarships",
            variant: "destructive"
          });
          return;
        }
        
        if (data) {
          // Convert to SavedScholarship type
          const savedScholarships: SavedScholarship[] = data.map(item => ({
            scholarshipId: item.scholarship_id,
            userId: item.user_id,
            dateAdded: item.date_added,
            status: item.status as ScholarshipStatus,
            notes: item.notes
          }));
          
          setUserSavedScholarships(savedScholarships);
          
          // Fetch details for all saved scholarships
          if (savedScholarships.length > 0) {
            const scholarshipIds = savedScholarships.map(s => s.scholarshipId);
            await fetchScholarshipDetails(scholarshipIds);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedScholarships();
  }, [currentUser, authLoading, navigate]);
  
  const fetchScholarshipDetails = async (ids: string[]) => {
    try {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .in('id', ids);
      
      if (error) {
        console.error('Error fetching scholarship details:', error);
        return;
      }
      
      if (data) {
        const detailsMap: Record<string, Scholarship> = {};
        
        data.forEach(item => {
          detailsMap[item.id] = {
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
          };
        });
        
        setScholarshipDetails(detailsMap);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleStatusChange = async (scholarshipId: string, newStatus: ScholarshipStatus) => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('saved_scholarships')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', currentUser.id)
        .eq('scholarship_id', scholarshipId);
      
      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
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
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleRemove = async (scholarshipId: string) => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('saved_scholarships')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('scholarship_id', scholarshipId);
      
      if (error) {
        console.error('Error removing scholarship:', error);
        toast({
          title: "Error",
          description: "Failed to remove scholarship",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      const updatedScholarships = userSavedScholarships.filter(
        saved => saved.scholarshipId !== scholarshipId
      );
      
      setUserSavedScholarships(updatedScholarships);
      
      toast({
        title: "Scholarship removed",
        description: "The scholarship has been removed from your saved list",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const filteredScholarships = currentTab === "all" 
    ? userSavedScholarships 
    : userSavedScholarships.filter(saved => saved.status === currentTab);
  
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isLoggedIn={!!currentUser} userName={currentUser?.name} />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
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
                  const scholarship = scholarshipDetails[saved.scholarshipId];
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
