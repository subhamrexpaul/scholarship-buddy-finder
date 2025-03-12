
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background circle decorations */}
      <div 
        className="absolute top-0 -right-36 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" 
        aria-hidden="true"
      />
      <div 
        className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" 
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-block mb-6">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                AI-Powered Scholarship Matching
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Find the Perfect Scholarships 
              <span className="text-blue-500 block">Tailored to You</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Discover scholarships that match your unique academic profile, personal background, and career goals — all powered by advanced AI matching technology.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button 
                asChild
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600 min-w-[160px] shadow-md"
              >
                <Link to="/sign-up">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="min-w-[160px]"
              >
                <Link to="/scholarships">
                  Browse Scholarships
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero image with animation */}
          <div 
            className={`mt-16 relative transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="glass-effect p-2 md:p-4 rounded-2xl shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000"
                alt="Students using scholarship finder app" 
                className="w-full h-auto rounded-xl" 
              />
            </div>
            
            {/* Floating card elements */}
            <div className="absolute -top-6 -left-6 md:top-12 md:-left-8 glass-effect py-2 px-4 rounded-lg shadow-soft animation-delay-300 animate-fade-in hidden md:block">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-scholarship-low rounded-full"></div>
                <span className="text-sm font-medium">98% Match Rate</span>
              </div>
            </div>
            
            <div className="absolute top-1/3 -right-4 md:-right-8 glass-effect py-2 px-4 rounded-lg shadow-soft animation-delay-500 animate-fade-in hidden md:block">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">$50,000+ in Awards</span>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
