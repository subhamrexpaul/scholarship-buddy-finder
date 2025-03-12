
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scholarship, ScholarshipStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  GraduationCap,
  Globe,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  isSaved?: boolean;
  savedStatus?: ScholarshipStatus;
  onSave?: (id: string) => void;
  matchScore?: number;
}

const ScholarshipCard = ({
  scholarship,
  isSaved = false,
  savedStatus,
  onSave,
  matchScore,
}: ScholarshipCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(isSaved);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Format deadline date
  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadlineString: string) => {
    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(scholarship.deadline);
  const isDeadlineSoon = daysRemaining <= 14 && daysRemaining > 0;
  const isDeadlinePassed = daysRemaining <= 0;

  // Format currency amount
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSaveScholarship = () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save scholarships",
        variant: "destructive"
      });
      navigate('/sign-in');
      return;
    }

    setIsBookmarked(!isBookmarked);
    
    if (!isBookmarked) {
      toast({
        title: "Scholarship saved",
        description: "Scholarship has been added to your saved list",
      });
    } else {
      toast({
        title: "Scholarship removed",
        description: "Scholarship has been removed from your saved list",
      });
    }
    
    // Call parent onSave if provided
    if (onSave) {
      onSave(scholarship.id);
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 h-full flex flex-col",
        isHovered && "shadow-medium translate-y-[-4px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold line-clamp-2">
            {scholarship.name}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-blue-500"
                  onClick={handleSaveScholarship}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isBookmarked ? "Remove from saved" : "Save scholarship"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {scholarship.provider}
        </div>
        
        {matchScore && (
          <div className="mt-2">
            <Badge 
              variant="outline" 
              className="bg-blue-50 text-blue-700 border-blue-200 font-medium"
            >
              {matchScore}% Match
            </Badge>
          </div>
        )}
        
        {isSaved && savedStatus && (
          <div className="mt-2">
            <Badge 
              variant="outline" 
              className={cn(
                "font-medium",
                savedStatus === "Planning to Apply" && "bg-blue-50 text-blue-700 border-blue-200",
                savedStatus === "Applied" && "bg-yellow-50 text-yellow-700 border-yellow-200",
                savedStatus === "Accepted" && "bg-green-50 text-green-700 border-green-200",
                savedStatus === "Rejected" && "bg-red-50 text-red-700 border-red-200"
              )}
            >
              {savedStatus}
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4 flex-grow">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {scholarship.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 mr-3">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <span className="text-muted-foreground">Study Level: </span>
              <span className="font-medium">
                {scholarship.eligibility.studyLevel?.join(", ") || "All Levels"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 mr-3">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <span className="text-muted-foreground">Nationality: </span>
              <span className="font-medium">
                {scholarship.eligibility.nationality?.[0] === "All" 
                  ? "All Countries" 
                  : scholarship.eligibility.nationality?.join(", ") || "Not specified"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 mr-3">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <span className="text-muted-foreground">Deadline: </span>
              <span 
                className={cn(
                  "font-medium",
                  isDeadlinePassed && "text-red-500",
                  isDeadlineSoon && !isDeadlinePassed && "text-yellow-600"
                )}
              >
                {formatDeadline(scholarship.deadline)}
                {isDeadlinePassed 
                  ? " (Closed)" 
                  : isDeadlineSoon 
                  ? ` (${daysRemaining} days left)` 
                  : ""}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-1">
          {scholarship.tags?.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="text-xs font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">
          {formatAmount(scholarship.amount.value, scholarship.amount.currency)}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            / {scholarship.amount.type}
          </span>
        </div>
        
        <Button asChild className="bg-blue-500 hover:bg-blue-600">
          <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer">
            Apply
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScholarshipCard;
