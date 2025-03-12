
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, UserProfile, StudyLevel, FinancialBackground } from '@/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for session on mount and set up auth state listener
  useEffect(() => {
    // Get initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await handleUserAuthenticated(session.user);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await handleUserAuthenticated(session.user);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setUserProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUserAuthenticated = async (authUser: any) => {
    try {
      // Fetch user profile from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      // Create user object from auth user and profile
      const user: User = {
        id: authUser.id,
        name: profileData.name,
        email: profileData.email,
        profileCompleted: profileData.profile_completed
      };

      setCurrentUser(user);

      // If profile is completed, fetch academic and personal info
      if (profileData.profile_completed) {
        await fetchUserProfile(authUser.id);
      }
    } catch (error) {
      console.error('Error processing authenticated user:', error);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch academic info
      const { data: academicData, error: academicError } = await supabase
        .from('academic_info')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (academicError && academicError.code !== 'PGRST116') {
        console.error('Error fetching academic info:', academicError);
        return;
      }

      // Fetch personal info
      const { data: personalData, error: personalError } = await supabase
        .from('personal_info')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (personalError && personalError.code !== 'PGRST116') {
        console.error('Error fetching personal info:', personalError);
        return;
      }

      // Create user profile object
      if (academicData && personalData) {
        const profile: UserProfile = {
          userId: userId,
          academicInfo: {
            gpa: academicData.gpa,
            major: academicData.major,
            studyLevel: academicData.study_level as StudyLevel,
            institution: academicData.institution
          },
          personalInfo: {
            citizenship: personalData.citizenship,
            financialBackground: personalData.financial_background as FinancialBackground,
            extracurriculars: personalData.extracurriculars
          }
        };

        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Success",
        description: "You are now signed in",
      });
      return true;
    } catch (error: any) {
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Success",
        description: "Your account has been created",
      });
      return true;
    } catch (error: any) {
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

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Success",
        description: "You have been signed out",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "An error occurred while signing out",
        variant: "destructive"
      });
    }
  };

  const updateUserProfile = async (profile: Partial<UserProfile>): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      // Update academic info
      if (profile.academicInfo) {
        const { data: existingAcademic } = await supabase
          .from('academic_info')
          .select('id')
          .eq('user_id', currentUser.id);

        const academicExists = existingAcademic && existingAcademic.length > 0;
        
        if (academicExists) {
          // Update existing record
          const { error } = await supabase
            .from('academic_info')
            .update({
              gpa: profile.academicInfo.gpa,
              major: profile.academicInfo.major,
              study_level: profile.academicInfo.studyLevel,
              institution: profile.academicInfo.institution,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', currentUser.id);
            
          if (error) {
            console.error('Error updating academic info:', error);
            throw error;
          }
        } else {
          // Insert new record
          const { error } = await supabase
            .from('academic_info')
            .insert({
              user_id: currentUser.id,
              gpa: profile.academicInfo.gpa,
              major: profile.academicInfo.major,
              study_level: profile.academicInfo.studyLevel,
              institution: profile.academicInfo.institution
            });
            
          if (error) {
            console.error('Error inserting academic info:', error);
            throw error;
          }
        }
      }
      
      // Update personal info
      if (profile.personalInfo) {
        const { data: existingPersonal } = await supabase
          .from('personal_info')
          .select('id')
          .eq('user_id', currentUser.id);

        const personalExists = existingPersonal && existingPersonal.length > 0;
        
        if (personalExists) {
          // Update existing record
          const { error } = await supabase
            .from('personal_info')
            .update({
              citizenship: profile.personalInfo.citizenship,
              financial_background: profile.personalInfo.financialBackground,
              extracurriculars: profile.personalInfo.extracurriculars,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', currentUser.id);
            
          if (error) {
            console.error('Error updating personal info:', error);
            throw error;
          }
        } else {
          // Insert new record
          const { error } = await supabase
            .from('personal_info')
            .insert({
              user_id: currentUser.id,
              citizenship: profile.personalInfo.citizenship,
              financial_background: profile.personalInfo.financialBackground,
              extracurriculars: profile.personalInfo.extracurriculars
            });
            
          if (error) {
            console.error('Error inserting personal info:', error);
            throw error;
          }
        }
      }
      
      // Update profile completion status
      const { error } = await supabase
        .from('profiles')
        .update({
          profile_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);
        
      if (error) {
        console.error('Error updating profile status:', error);
        throw error;
      }
      
      // Refresh user data
      await fetchUserProfile(currentUser.id);
      
      // Update current user
      setCurrentUser({
        ...currentUser,
        profileCompleted: true
      });
      
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
