
import { Scholarship, UserProfile } from "../types";

export const getRecommendedScholarships = (
  scholarships: Scholarship[],
  userProfile?: UserProfile
): Scholarship[] => {
  if (!userProfile) {
    // If no profile, return featured scholarships
    return scholarships.filter(s => s.featured);
  }

  // Basic scoring algorithm
  const scoredScholarships = scholarships.map(scholarship => {
    let score = 0;
    const { academicInfo, personalInfo } = userProfile;

    // GPA Match
    if (scholarship.eligibility.minGPA && academicInfo.gpa >= scholarship.eligibility.minGPA) {
      score += 10;
      
      // Bonus for exceeding minimum GPA by 0.5 or more
      if (academicInfo.gpa >= (scholarship.eligibility.minGPA + 0.5)) {
        score += 5;
      }
    } else if (scholarship.eligibility.minGPA && academicInfo.gpa < scholarship.eligibility.minGPA) {
      score -= 20; // Significant penalty for not meeting minimum GPA
    }

    // Field of Study Match
    if (
      scholarship.eligibility.fieldOfStudy && 
      (scholarship.eligibility.fieldOfStudy.includes(academicInfo.major) || 
      scholarship.eligibility.fieldOfStudy.includes("All"))
    ) {
      score += 15;
    }

    // Study Level Match
    if (
      scholarship.eligibility.studyLevel && 
      scholarship.eligibility.studyLevel.includes(academicInfo.studyLevel)
    ) {
      score += 15;
    } else if (scholarship.eligibility.studyLevel && !scholarship.eligibility.studyLevel.includes(academicInfo.studyLevel)) {
      score -= 30; // Major penalty for wrong study level
    }

    // Nationality/Citizenship Match
    if (
      scholarship.eligibility.nationality && 
      (scholarship.eligibility.nationality.includes(personalInfo.citizenship) || 
      scholarship.eligibility.nationality.includes("All"))
    ) {
      score += 10;
    } else if (scholarship.eligibility.nationality && !scholarship.eligibility.nationality.includes(personalInfo.citizenship)) {
      score -= 20; // Penalty for citizenship mismatch
    }

    // Featured scholarships get a small boost
    if (scholarship.featured) {
      score += 5;
    }

    return {
      scholarship,
      score
    };
  });

  // Sort by score (highest first) and filter out very poor matches
  return scoredScholarships
    .filter(item => item.score > 0) // Only include positive scores
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .map(item => item.scholarship); // Return just the scholarship objects
};
