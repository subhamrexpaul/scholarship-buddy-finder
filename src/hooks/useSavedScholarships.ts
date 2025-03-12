
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { savedScholarships as initialSavedScholarships } from '@/data/scholarships';
import { SavedScholarship, ScholarshipStatus } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useSavedScholarships = () => {
  const { currentUser } = useAuth();
  const [savedScholarships, setSavedScholarships] = useState<SavedScholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved scholarships on mount
  useEffect(() => {
    const loadSavedScholarships = () => {
      if (!currentUser) {
        setSavedScholarships([]);
        setIsLoading(false);
        return;
      }

      try {
        // In a real app, this would be an API call
        const userSaved = initialSavedScholarships.filter(
          saved => saved.userId === currentUser.id
        );
        setSavedScholarships(userSaved);
      } catch (error) {
        console.error('Error loading saved scholarships:', error);
        toast({
          title: "Error",
          description: "Failed to load your saved scholarships",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedScholarships();
  }, [currentUser]);

  // Save a scholarship
  const saveScholarship = (scholarshipId: string): boolean => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save scholarships",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Check if already saved
      const alreadySaved = savedScholarships.some(
        saved => saved.scholarshipId === scholarshipId && saved.userId === currentUser.id
      );

      if (alreadySaved) {
        toast({
          title: "Already saved",
          description: "This scholarship is already in your saved list",
        });
        return false;
      }

      // Create new saved scholarship
      const newSavedScholarship: SavedScholarship = {
        scholarshipId,
        userId: currentUser.id,
        dateAdded: new Date().toISOString(),
        status: ScholarshipStatus.Planning,
      };

      // In a real app, this would be an API call
      setSavedScholarships([...savedScholarships, newSavedScholarship]);

      toast({
        title: "Success",
        description: "Scholarship saved to your list",
      });
      return true;
    } catch (error) {
      console.error('Error saving scholarship:', error);
      toast({
        title: "Error",
        description: "Failed to save the scholarship",
        variant: "destructive"
      });
      return false;
    }
  };

  // Remove a scholarship from saved
  const removeSavedScholarship = (scholarshipId: string): boolean => {
    if (!currentUser) return false;

    try {
      // In a real app, this would be an API call
      setSavedScholarships(
        savedScholarships.filter(saved => 
          !(saved.scholarshipId === scholarshipId && saved.userId === currentUser.id)
        )
      );

      toast({
        title: "Success",
        description: "Scholarship removed from your list",
      });
      return true;
    } catch (error) {
      console.error('Error removing scholarship:', error);
      toast({
        title: "Error",
        description: "Failed to remove the scholarship",
        variant: "destructive"
      });
      return false;
    }
  };

  // Update scholarship status
  const updateScholarshipStatus = (
    scholarshipId: string, 
    status: ScholarshipStatus
  ): boolean => {
    if (!currentUser) return false;

    try {
      const scholarshipIndex = savedScholarships.findIndex(
        saved => saved.scholarshipId === scholarshipId && saved.userId === currentUser.id
      );

      if (scholarshipIndex === -1) return false;

      const updatedScholarships = [...savedScholarships];
      updatedScholarships[scholarshipIndex] = {
        ...updatedScholarships[scholarshipIndex],
        status
      };

      // In a real app, this would be an API call
      setSavedScholarships(updatedScholarships);

      toast({
        title: "Success",
        description: `Scholarship status updated to ${status}`,
      });
      return true;
    } catch (error) {
      console.error('Error updating scholarship status:', error);
      toast({
        title: "Error",
        description: "Failed to update the scholarship status",
        variant: "destructive"
      });
      return false;
    }
  };

  // Check if a scholarship is saved
  const isScholarshipSaved = (scholarshipId: string): boolean => {
    if (!currentUser) return false;
    
    return savedScholarships.some(
      saved => saved.scholarshipId === scholarshipId && saved.userId === currentUser.id
    );
  };

  // Get all saved scholarship IDs
  const getSavedScholarshipIds = (): string[] => {
    if (!currentUser) return [];
    
    return savedScholarships
      .filter(saved => saved.userId === currentUser.id)
      .map(saved => saved.scholarshipId);
  };

  // Get saved scholarship status
  const getSavedScholarshipStatus = (scholarshipId: string): ScholarshipStatus | undefined => {
    if (!currentUser) return undefined;
    
    const saved = savedScholarships.find(
      saved => saved.scholarshipId === scholarshipId && saved.userId === currentUser.id
    );
    
    return saved?.status;
  };

  return {
    savedScholarships: savedScholarships.filter(s => s.userId === currentUser?.id),
    isLoading,
    saveScholarship,
    removeSavedScholarship,
    updateScholarshipStatus,
    isScholarshipSaved,
    getSavedScholarshipIds,
    getSavedScholarshipStatus
  };
};
