
export interface User {
  id: string;
  name: string;
  email: string;
  profileCompleted: boolean;
}

export interface UserProfile {
  userId: string;
  academicInfo: {
    gpa: number;
    major: string;
    studyLevel: StudyLevel;
    institution?: string;
  };
  personalInfo: {
    citizenship: string;
    financialBackground?: FinancialBackground;
    extracurriculars?: string[];
  };
}

export enum StudyLevel {
  Undergraduate = "Undergraduate",
  Graduate = "Graduate",
  Doctorate = "Doctorate"
}

export enum FinancialBackground {
  Low = "Low",
  Medium = "Medium",
  High = "High"
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  description: string;
  eligibility: {
    nationality?: string[];
    minGPA?: number;
    fieldOfStudy?: string[];
    studyLevel?: StudyLevel[];
  };
  amount: {
    value: number;
    currency: string;
    type: "one-time" | "annual" | "semester";
  };
  deadline: string; // ISO date string
  applicationLink: string;
  tags?: string[];
  featured?: boolean;
}

export enum ScholarshipStatus {
  Planning = "Planning to Apply",
  Applied = "Applied",
  Accepted = "Accepted",
  Rejected = "Rejected"
}

export interface SavedScholarship {
  scholarshipId: string;
  userId: string;
  dateAdded: string; // ISO date string
  status: ScholarshipStatus;
  notes?: string;
}
