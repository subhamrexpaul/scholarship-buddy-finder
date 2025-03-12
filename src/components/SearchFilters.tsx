
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
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StudyLevel } from "@/types";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface SearchFiltersProps {
  onSearch: (filters: {
    keyword: string;
    studyLevel?: StudyLevel | "";
    minAmount: number;
    maxAmount: number;
    isDeadlineSoon: boolean;
  }) => void;
}

const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [keyword, setKeyword] = useState("");
  const [studyLevel, setStudyLevel] = useState<StudyLevel | "">("");
  const [amountRange, setAmountRange] = useState([0, 50000]);
  const [isDeadlineSoon, setIsDeadlineSoon] = useState(false);
  
  const handleSearch = () => {
    onSearch({
      keyword,
      studyLevel,
      minAmount: amountRange[0],
      maxAmount: amountRange[1],
      isDeadlineSoon,
    });
  };
  
  const handleReset = () => {
    setKeyword("");
    setStudyLevel("");
    setAmountRange([0, 50000]);
    setIsDeadlineSoon(false);
    
    onSearch({
      keyword: "",
      studyLevel: "",
      minAmount: 0,
      maxAmount: 50000,
      isDeadlineSoon: false,
    });
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search scholarships by name, provider, or keywords"
            className="pl-10 bg-muted/30 border-0"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="study-level">Study Level</Label>
                  <Select
                    value={studyLevel}
                    onValueChange={(value) => setStudyLevel(value as StudyLevel | "")}
                  >
                    <SelectTrigger id="study-level">
                      <SelectValue placeholder="Any level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any level</SelectItem>
                      <SelectItem value={StudyLevel.Undergraduate}>Undergraduate</SelectItem>
                      <SelectItem value={StudyLevel.Graduate}>Graduate</SelectItem>
                      <SelectItem value={StudyLevel.Doctorate}>Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Award Amount</Label>
                    <span className="text-sm text-muted-foreground">
                      ${amountRange[0].toLocaleString()} - ${amountRange[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 50000]}
                    value={amountRange}
                    onValueChange={setAmountRange}
                    max={50000}
                    step={1000}
                    className="py-2"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="deadline-soon"
                    checked={isDeadlineSoon}
                    onChange={(e) => setIsDeadlineSoon(e.target.checked)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <Label htmlFor="deadline-soon" className="cursor-pointer">
                    Deadline within 30 days
                  </Label>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="gap-1"
                  >
                    <X className="h-4 w-4" />
                    Reset
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSearch}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
