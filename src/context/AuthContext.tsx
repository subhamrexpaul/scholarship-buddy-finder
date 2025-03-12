
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, UserProfile, StudyLevel, FinancialBackground } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data - in a real app, this would be stored in a database
let mockUsers: User[] = [
  {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    profileCompleted: true
  }
];

let mockProfiles: UserProfile[] = [
  {
    userId: 'user-123',
    academicInfo: {
      gpa: 3.8,
      major: 'Computer Science',
      studyLevel: StudyLevel.Undergraduate,
      institution: 'Example University'
    },
    personalInfo: {
      citizenship: 'United States',
      financialBackground: FinancialBackground.Medium,
      extracurriculars: ['Coding Club', 'Volunteer Work']
    }
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      
      // Fetch the user profile
      const profile = mockProfiles.find(p => p.userId === user.id);
      if (profile) {
        setUserProfile(profile);
      }
    }
    
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, you would validate against a backend
      // This is a mock implementation
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive"
        });
        return false;
      }
      
      // Set the current user
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Fetch the user profile
      const profile = mockProfiles.find(p => p.userId === user.id);
      if (profile) {
        setUserProfile(profile);
      }
      
      toast({
        title: "Success",
        description: "You are now signed in",
      });
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: "An error occurred while signing in",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        toast({
          title: "Error",
          description: "A user with this email already exists",
          variant: "destructive"
        });
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        profileCompleted: false
      };
      
      // Add to mock database
      mockUsers = [...mockUsers, newUser];
      
      // Set the current user
      setCurrentUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: "Success",
        description: "Your account has been created",
      });
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Error",
        description: "An error occurred while creating your account",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setUserProfile(null);
    toast({
      title: "Success",
      description: "You have been signed out",
    });
  };

  const updateUserProfile = async (profile: Partial<UserProfile>): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      let existingProfile = mockProfiles.find(p => p.userId === currentUser.id);
      
      if (existingProfile) {
        // Update existing profile
        const updatedProfile = {
          ...existingProfile,
          ...profile,
          academicInfo: {
            ...existingProfile.academicInfo,
            ...(profile.academicInfo || {})
          },
          personalInfo: {
            ...existingProfile.personalInfo,
            ...(profile.personalInfo || {})
          }
        };
        
        mockProfiles = mockProfiles.map(p => 
          p.userId === currentUser.id ? updatedProfile : p
        );
        
        setUserProfile(updatedProfile);
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          userId: currentUser.id,
          academicInfo: {
            gpa: profile.academicInfo?.gpa || 0,
            major: profile.academicInfo?.major || '',
            studyLevel: profile.academicInfo?.studyLevel || StudyLevel.Undergraduate,
            institution: profile.academicInfo?.institution
          },
          personalInfo: {
            citizenship: profile.personalInfo?.citizenship || '',
            financialBackground: profile.personalInfo?.financialBackground,
            extracurriculars: profile.personalInfo?.extracurriculars
          }
        };
        
        mockProfiles = [...mockProfiles, newProfile];
        setUserProfile(newProfile);
      }
      
      // Update user's profileCompleted status
      const updatedUser = { ...currentUser, profileCompleted: true };
      mockUsers = mockUsers.map(u => u.id === currentUser.id ? updatedUser : u);
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Success",
        description: "Your profile has been updated",
      });
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating your profile",
        variant: "destructive"
      });
      return false;
    }
  };

  const value = {
    currentUser,
    userProfile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
