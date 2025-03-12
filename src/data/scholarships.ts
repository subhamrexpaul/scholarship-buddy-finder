
import { Scholarship, StudyLevel } from "../types";

export const scholarships: Scholarship[] = [
  {
    id: "1",
    name: "Global Excellence Scholarship",
    provider: "International Education Foundation",
    description: "A prestigious scholarship for outstanding international students pursuing higher education abroad.",
    eligibility: {
      nationality: ["All"],
      minGPA: 3.7,
      fieldOfStudy: ["All"],
      studyLevel: [StudyLevel.Undergraduate, StudyLevel.Graduate]
    },
    amount: {
      value: 20000,
      currency: "USD",
      type: "annual"
    },
    deadline: "2023-12-15T23:59:59Z",
    applicationLink: "https://example.com/global-excellence",
    tags: ["International", "Merit-based", "Full Coverage"],
    featured: true
  },
  {
    id: "2",
    name: "Women in STEM Scholarship",
    provider: "TechForward Foundation",
    description: "Supporting women pursuing degrees in Science, Technology, Engineering, and Mathematics fields.",
    eligibility: {
      nationality: ["All"],
      minGPA: 3.5,
      fieldOfStudy: ["Computer Science", "Engineering", "Mathematics", "Physics"],
      studyLevel: [StudyLevel.Undergraduate, StudyLevel.Graduate]
    },
    amount: {
      value: 15000,
      currency: "USD",
      type: "annual"
    },
    deadline: "2024-01-31T23:59:59Z",
    applicationLink: "https://example.com/women-in-stem",
    tags: ["STEM", "Women", "Diversity"],
    featured: true
  },
  {
    id: "3",
    name: "Future Leaders Grant",
    provider: "Global Leadership Initiative",
    description: "Providing financial support to students with demonstrated leadership potential and community involvement.",
    eligibility: {
      nationality: ["All"],
      minGPA: 3.2,
      fieldOfStudy: ["Business", "Public Policy", "International Relations"],
      studyLevel: [StudyLevel.Undergraduate, StudyLevel.Graduate]
    },
    amount: {
      value: 10000,
      currency: "USD",
      type: "annual"
    },
    deadline: "2024-02-28T23:59:59Z",
    applicationLink: "https://example.com/future-leaders",
    tags: ["Leadership", "Community Service"]
  },
  {
    id: "4",
    name: "Environmental Studies Fellowship",
    provider: "Green Planet Foundation",
    description: "Supporting the next generation of environmental scientists, conservationists, and policy experts.",
    eligibility: {
      nationality: ["All"],
      minGPA: 3.4,
      fieldOfStudy: ["Environmental Science", "Conservation", "Sustainable Development"],
      studyLevel: [StudyLevel.Graduate, StudyLevel.Doctorate]
    },
    amount: {
      value: 25000,
      currency: "USD",
      type: "annual"
    },
    deadline: "2024-03-15T23:59:59Z",
    applicationLink: "https://example.com/environmental-fellowship",
    tags: ["Environment", "Research", "Sustainability"]
  },
  {
    id: "5",
    name: "First Generation Student Scholarship",
    provider: "Breakthrough Education Alliance",
    description: "Dedicated to supporting first-generation college students achieve their academic dreams.",
    eligibility: {
      nationality: ["All"],
      minGPA: 3.0,
      fieldOfStudy: ["All"],
      studyLevel: [StudyLevel.Undergraduate]
    },
    amount: {
      value: 8000,
      currency: "USD",
      type: "annual"
    },
    deadline: "2024-04-01T23:59:59Z",
    applicationLink: "https://example.com/first-gen-scholarship",
    tags: ["First Generation", "Need-based", "Inclusive"]
  },
  {
    id: "6",
    name: "Global Health Research Grant",
    provider: "World Health Initiative",
    description: "Funding for graduate and doctoral students conducting research in global health challenges.",
    eligibility: {
      nationality: ["All"],
      minGPA: 3.6,
      fieldOfStudy: ["Medicine", "Public Health", "Epidemiology", "Health Policy"],
      studyLevel: [StudyLevel.Graduate, StudyLevel.Doctorate]
    },
    amount: {
      value: 30000,
      currency: "USD",
      type: "annual"
    },
    deadline: "2024-02-15T23:59:59Z",
    applicationLink: "https://example.com/global-health",
    tags: ["Health", "Research", "Global Impact"]
  },
  {
    id: "7",
    name: "Creative Arts Excellence Award",
    provider: "Arts Forward Foundation",
    description: "Recognizing and supporting outstanding talent in various creative disciplines.",
    eligibility: {
      nationality: ["All"],
      minGPA: 3.2,
      fieldOfStudy: ["Fine Arts", "Music", "Theater", "Film", "Creative Writing"],
      studyLevel: [StudyLevel.Undergraduate, StudyLevel.Graduate]
    },
    amount: {
      value: 12000,
      currency: "USD",
      type: "annual"
    },
    deadline: "2024-03-31T23:59:59Z",
    applicationLink: "https://example.com/arts-excellence",
    tags: ["Arts", "Creative", "Portfolio-based"]
  },
  {
    id: "8",
    name: "Tech Innovation Scholarship",
    provider: "FutureTech Industries",
    description: "Supporting students developing innovative solutions using technology.",
    eligibility: {
      nationality: ["All"],
      minGPA: 3.5,
      fieldOfStudy: ["Computer Science", "Data Science", "Artificial Intelligence", "Software Engineering"],
      studyLevel: [StudyLevel.Undergraduate, StudyLevel.Graduate]
    },
    amount: {
      value: 18000,
      currency: "USD",
      type: "annual"
    },
    deadline: "2024-01-15T23:59:59Z",
    applicationLink: "https://example.com/tech-innovation",
    tags: ["Technology", "Innovation", "Entrepreneurship"],
    featured: true
  }
];

export const savedScholarships = [
  {
    scholarshipId: "1",
    userId: "user-123",
    dateAdded: "2023-10-01T10:30:00Z",
    status: "Planning to Apply" as const,
    notes: "Need to prepare essay and get recommendation letters"
  },
  {
    scholarshipId: "4",
    userId: "user-123",
    dateAdded: "2023-10-05T14:45:00Z",
    status: "Applied" as const,
    notes: "Submitted application, waiting for response"
  }
];
