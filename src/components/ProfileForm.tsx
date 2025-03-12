
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudyLevel, FinancialBackground, UserProfile } from "@/types";

interface ProfileFormProps {
  existingProfile?: UserProfile;
  onSubmit: (profile: UserProfile) => void;
}

const ProfileForm = ({ existingProfile, onSubmit }: ProfileFormProps) => {
  const [profile, setProfile] = useState<UserProfile>(
    existingProfile || {
      userId: "user-123", // This would come from auth in a real app
      academicInfo: {
        gpa: 0,
        major: "",
        studyLevel: StudyLevel.Undergraduate,
      },
      personalInfo: {
        citizenship: "",
      },
    }
  );

  const handleChange = (
    section: "academicInfo" | "personalInfo",
    field: string,
    value: any
  ) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>
              Tell us about your academic background to help us find relevant scholarships.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA (0.0 - 4.0)</Label>
                <Input
                  id="gpa"
                  type="number"
                  min="0"
                  max="4"
                  step="0.1"
                  value={profile.academicInfo.gpa}
                  onChange={(e) =>
                    handleChange(
                      "academicInfo",
                      "gpa",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="Enter your GPA"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="study-level">Study Level</Label>
                <Select
                  value={profile.academicInfo.studyLevel}
                  onValueChange={(value) =>
                    handleChange("academicInfo", "studyLevel", value)
                  }
                  required
                >
                  <SelectTrigger id="study-level">
                    <SelectValue placeholder="Select study level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={StudyLevel.Undergraduate}>
                      Undergraduate
                    </SelectItem>
                    <SelectItem value={StudyLevel.Graduate}>Graduate</SelectItem>
                    <SelectItem value={StudyLevel.Doctorate}>
                      Doctorate
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="major">Major/Field of Study</Label>
                <Input
                  id="major"
                  value={profile.academicInfo.major}
                  onChange={(e) =>
                    handleChange("academicInfo", "major", e.target.value)
                  }
                  placeholder="Enter your major"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="institution">
                  Institution (Optional)
                </Label>
                <Input
                  id="institution"
                  value={profile.academicInfo.institution || ""}
                  onChange={(e) =>
                    handleChange("academicInfo", "institution", e.target.value)
                  }
                  placeholder="Enter your institution"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              This information helps us match you with scholarships based on your background.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="citizenship">Country of Citizenship</Label>
                <Select
                  value={profile.personalInfo.citizenship}
                  onValueChange={(value) =>
                    handleChange("personalInfo", "citizenship", value)
                  }
                  required
                >
                  <SelectTrigger id="citizenship">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="CAN">Canada</SelectItem>
                    <SelectItem value="GBR">United Kingdom</SelectItem>
                    <SelectItem value="AUS">Australia</SelectItem>
                    <SelectItem value="IND">India</SelectItem>
                    <SelectItem value="CHN">China</SelectItem>
                    <SelectItem value="JPN">Japan</SelectItem>
                    <SelectItem value="GER">Germany</SelectItem>
                    <SelectItem value="FRA">France</SelectItem>
                    <SelectItem value="ITA">Italy</SelectItem>
                    {/* In a real app, this would be a complete list */}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="financial-background">
                  Financial Background (Optional)
                </Label>
                <Select
                  value={profile.personalInfo.financialBackground || ""}
                  onValueChange={(value) =>
                    handleChange(
                      "personalInfo",
                      "financialBackground",
                      value || undefined
                    )
                  }
                >
                  <SelectTrigger id="financial-background">
                    <SelectValue placeholder="Select financial background" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FinancialBackground.Low}>
                      Low Income
                    </SelectItem>
                    <SelectItem value={FinancialBackground.Medium}>
                      Middle Income
                    </SelectItem>
                    <SelectItem value={FinancialBackground.High}>
                      High Income
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="extracurriculars">
                  Extracurricular Activities (Optional)
                </Label>
                <Input
                  id="extracurriculars"
                  value={profile.personalInfo.extracurriculars?.join(", ") || ""}
                  onChange={(e) =>
                    handleChange(
                      "personalInfo",
                      "extracurriculars",
                      e.target.value ? e.target.value.split(", ") : undefined
                    )
                  }
                  placeholder="Enter activities separated by commas"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Example: Student government, volunteer work, sports, etc.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600"
            >
              Save Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default ProfileForm;
