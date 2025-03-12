
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StudyLevel, FinancialBackground } from '@/types';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, updateUserProfile, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    academicInfo: {
      gpa: '',
      major: '',
      studyLevel: '' as StudyLevel | '',
      institution: ''
    },
    personalInfo: {
      citizenship: '',
      financialBackground: '' as FinancialBackground | '',
      extracurriculars: ''
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access your profile",
        variant: "destructive"
      });
      navigate('/sign-in');
      return;
    }
    
    // Populate form with existing profile data if available
    if (userProfile) {
      setFormData({
        academicInfo: {
          gpa: userProfile.academicInfo.gpa.toString(),
          major: userProfile.academicInfo.major,
          studyLevel: userProfile.academicInfo.studyLevel,
          institution: userProfile.academicInfo.institution || ''
        },
        personalInfo: {
          citizenship: userProfile.personalInfo.citizenship,
          financialBackground: userProfile.personalInfo.financialBackground || '',
          extracurriculars: userProfile.personalInfo.extracurriculars?.join(', ') || ''
        }
      });
    }
  }, [currentUser, userProfile, isLoading, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('academic.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        academicInfo: {
          ...prev.academicInfo,
          [field]: value
        }
      }));
    } else if (name.startsWith('personal.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value
        }
      }));
    }
  };
  
  const handleSelectChange = (value: string, section: string, field: string) => {
    if (section === 'academic') {
      setFormData(prev => ({
        ...prev,
        academicInfo: {
          ...prev.academicInfo,
          [field]: value
        }
      }));
    } else if (section === 'personal') {
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value
        }
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert GPA to number
      const gpa = parseFloat(formData.academicInfo.gpa);
      if (isNaN(gpa)) {
        toast({
          title: "Invalid GPA",
          description: "Please enter a valid GPA",
          variant: "destructive"
        });
        return;
      }
      
      // Convert extracurriculars to array
      const extracurriculars = formData.personalInfo.extracurriculars
        ? formData.personalInfo.extracurriculars.split(',').map(item => item.trim())
        : [];
      
      const success = await updateUserProfile({
        academicInfo: {
          gpa,
          major: formData.academicInfo.major,
          studyLevel: formData.academicInfo.studyLevel as StudyLevel,
          institution: formData.academicInfo.institution
        },
        personalInfo: {
          citizenship: formData.personalInfo.citizenship,
          financialBackground: formData.personalInfo.financialBackground as FinancialBackground,
          extracurriculars
        }
      });
      
      if (success) {
        navigate('/scholarships');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={!!currentUser} userName={currentUser?.name} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              This information helps us find scholarships that match your background
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Academic Information</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="academic.gpa">GPA</Label>
                      <Input
                        id="academic.gpa"
                        name="academic.gpa"
                        type="text"
                        placeholder="e.g. 3.5"
                        value={formData.academicInfo.gpa}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="academic.major">Major/Field of Study</Label>
                      <Input
                        id="academic.major"
                        name="academic.major"
                        type="text"
                        placeholder="e.g. Computer Science"
                        value={formData.academicInfo.major}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="academic.studyLevel">Study Level</Label>
                      <Select
                        value={formData.academicInfo.studyLevel}
                        onValueChange={(value) => 
                          handleSelectChange(value, 'academic', 'studyLevel')
                        }
                      >
                        <SelectTrigger id="academic.studyLevel">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={StudyLevel.Undergraduate}>Undergraduate</SelectItem>
                          <SelectItem value={StudyLevel.Graduate}>Graduate</SelectItem>
                          <SelectItem value={StudyLevel.Doctorate}>Doctorate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="academic.institution">Institution (Optional)</Label>
                      <Input
                        id="academic.institution"
                        name="academic.institution"
                        type="text"
                        placeholder="Your university or college"
                        value={formData.academicInfo.institution}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="personal.citizenship">Citizenship/Nationality</Label>
                      <Input
                        id="personal.citizenship"
                        name="personal.citizenship"
                        type="text"
                        placeholder="e.g. United States"
                        value={formData.personalInfo.citizenship}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="personal.financialBackground">Financial Background</Label>
                      <Select
                        value={formData.personalInfo.financialBackground}
                        onValueChange={(value) => 
                          handleSelectChange(value, 'personal', 'financialBackground')
                        }
                      >
                        <SelectTrigger id="personal.financialBackground">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={FinancialBackground.Low}>Low Income</SelectItem>
                          <SelectItem value={FinancialBackground.Medium}>Middle Income</SelectItem>
                          <SelectItem value={FinancialBackground.High}>High Income</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="personal.extracurriculars">
                      Extracurricular Activities (Optional, separate with commas)
                    </Label>
                    <Input
                      id="personal.extracurriculars"
                      name="personal.extracurriculars"
                      type="text"
                      placeholder="e.g. Sports, Volunteer work, Clubs"
                      value={formData.personalInfo.extracurriculars}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Profile"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
