
import { Scholarship, UserProfile, StudyLevel } from '@/types';

// Calculate a match score based on how well a scholarship matches a user's profile
export const getRecommendedScholarships = (
  scholarships: Scholarship[],
  userProfile: UserProfile
): { scholarship: Scholarship; score: number }[] => {
  const recommendations = scholarships.map(scholarship => {
    let score = 0;
    let factors = 0;
    
    // Study level match
    if (scholarship.eligibility.studyLevel) {
      factors++;
      if (scholarship.eligibility.studyLevel.includes(userProfile.academicInfo.studyLevel)) {
        score += 1;
      }
    }
    
    // GPA match
    if (scholarship.eligibility.minGPA) {
      factors++;
      if (userProfile.academicInfo.gpa >= scholarship.eligibility.minGPA) {
        score += 1;
      }
    }
    
    // Nationality match
    if (scholarship.eligibility.nationality && 
        scholarship.eligibility.nationality[0] !== 'All') {
      factors++;
      if (scholarship.eligibility.nationality.includes(userProfile.personalInfo.citizenship)) {
        score += 1;
      }
    }
    
    // Field of study match
    if (scholarship.eligibility.fieldOfStudy && 
        scholarship.eligibility.fieldOfStudy[0] !== 'All') {
      factors++;
      const userMajor = userProfile.academicInfo.major.toLowerCase();
      if (scholarship.eligibility.fieldOfStudy.some(
        field => field.toLowerCase() === userMajor || field === 'All'
      )) {
        score += 1;
      }
    }
    
    // Convert to percentage
    const matchPercentage = factors > 0 
      ? Math.round((score / factors) * 100) 
      : 100; // If no eligibility factors, consider it a full match
    
    return {
      scholarship,
      score: matchPercentage
    };
  });
  
  // Sort by score (highest first)
  return recommendations
    .filter(rec => rec.score > 50) // Only include reasonable matches
    .sort((a, b) => b.score - a.score);
};

// Calculate days remaining until deadline
export const calculateDaysRemaining = (deadline: string): number => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Check if a scholarship is eligible for a user
export const isEligibleForScholarship = (
  scholarship: Scholarship,
  userProfile: UserProfile
): boolean => {
  // Check study level
  if (scholarship.eligibility.studyLevel && 
      !scholarship.eligibility.studyLevel.includes(userProfile.academicInfo.studyLevel)) {
    return false;
  }
  
  // Check GPA requirement
  if (scholarship.eligibility.minGPA && 
      userProfile.academicInfo.gpa < scholarship.eligibility.minGPA) {
    return false;
  }
  
  // Check nationality requirement
  if (scholarship.eligibility.nationality && 
      scholarship.eligibility.nationality[0] !== 'All' &&
      !scholarship.eligibility.nationality.includes(userProfile.personalInfo.citizenship)) {
    return false;
  }
  
  // Check field of study
  if (scholarship.eligibility.fieldOfStudy && 
      scholarship.eligibility.fieldOfStudy[0] !== 'All') {
    const userMajor = userProfile.academicInfo.major.toLowerCase();
    if (!scholarship.eligibility.fieldOfStudy.some(
      field => field.toLowerCase() === userMajor || field === 'All'
    )) {
      return false;
    }
  }
  
  return true;
};
