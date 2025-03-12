import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import About from '@/components/About';
import FeatureCard from '@/components/FeatureCard';
import ScholarshipCard from '@/components/ScholarshipCard';
import { Button } from '@/components/ui/button';
import { scholarships } from '@/data/scholarships';
import { Brain, Search, Filter, BookmarkCheck, ChevronRight, Award, ArrowRight } from 'lucide-react';

const featuresData = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Our intelligent algorithm finds scholarships perfectly tailored to your academic profile and personal background.'
  },
  {
    icon: Search,
    title: 'Advanced Search',
    description: 'Easily search through thousands of scholarships with powerful filters to find exactly what you need.'
  },
  {
    icon: Filter,
    title: 'Smart Filtering',
    description: 'Filter scholarships by deadline, amount, eligibility criteria, and more to narrow down your options.'
  },
  {
    icon: BookmarkCheck,
    title: 'Application Tracking',
    description: 'Keep track of your scholarship applications in one place, from planning to acceptance.'
  }
];

const Index = () => {
  const [isLoggedIn] = useState(false);
  const [featuredScholarships, setFeaturedScholarships] = useState([]);
  const [visibleSections, setVisibleSections] = useState({
    features: false,
    scholarships: false,
    cta: false
  });

  useEffect(() => {
    setFeaturedScholarships(scholarships.filter(s => s.featured).slice(0, 3));
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const featuresSectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleSections(prev => ({ ...prev, features: true }));
      }
    }, observerOptions);
    
    const scholarshipsSectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleSections(prev => ({ ...prev, scholarships: true }));
      }
    }, observerOptions);
    
    const ctaSectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleSections(prev => ({ ...prev, cta: true }));
      }
    }, observerOptions);
    
    const featuresSection = document.getElementById('features-section');
    const scholarshipsSection = document.getElementById('scholarships-section');
    const ctaSection = document.getElementById('cta-section');
    
    if (featuresSection) featuresSectionObserver.observe(featuresSection);
    if (scholarshipsSection) scholarshipsSectionObserver.observe(scholarshipsSection);
    if (ctaSection) ctaSectionObserver.observe(ctaSection);
    
    return () => {
      if (featuresSection) featuresSectionObserver.unobserve(featuresSection);
      if (scholarshipsSection) scholarshipsSectionObserver.unobserve(scholarshipsSection);
      if (ctaSection) ctaSectionObserver.unobserve(ctaSection);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} userName="John Doe" />
      
      <main>
        <HeroSection />
        <HowItWorks />
        <About />
        
        {/* Features Section */}
        <section 
          id="features-section"
          className="py-20 bg-white relative overflow-hidden"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className={`transition-all duration-700 ${visibleSections.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Find and Apply for Scholarships <span className="text-blue-500">Effortlessly</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our platform streamlines the scholarship discovery and application process, so you can focus on your education.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuresData.map((feature, index) => (
                <div 
                  key={feature.title}
                  className={`transition-all duration-700 delay-${index * 100} ${
                    visibleSections.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Scholarships Section */}
        <section 
          id="scholarships-section"
          className="py-20 bg-gray-50/50 relative"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className={`transition-all duration-700 ${visibleSections.scholarships ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Featured <span className="text-blue-500">Scholarships</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Discover some of our most popular scholarships currently available.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {featuredScholarships.map((scholarship, index) => (
                <div 
                  key={scholarship.id}
                  className={`transition-all duration-700 delay-${index * 100} ${
                    visibleSections.scholarships ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <ScholarshipCard
                    scholarship={scholarship}
                    matchScore={Math.floor(Math.random() * 15) + 85}
                  />
                </div>
              ))}
            </div>
            
            <div className={`text-center transition-all duration-700 delay-300 ${
              visibleSections.scholarships ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="group"
              >
                <Link to="/scholarships">
                  View All Scholarships
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section 
          id="cta-section"
          className="py-20 bg-white relative overflow-hidden"
        >
          <div 
            className="absolute top-0 -right-36 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" 
            aria-hidden="true"
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className={`max-w-3xl mx-auto glass-effect rounded-2xl p-8 md:p-12 transition-all duration-700 ${
              visibleSections.cta ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="text-center">
                <Award className="h-16 w-16 text-blue-500 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Find Your Perfect Scholarship?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Create your profile now and get personalized scholarship recommendations tailored just for you.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Link to="/sign-up">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img 
                src="/lovable-uploads/ec629fd5-ba51-4d2d-a871-4231af6e9393.png" 
                alt="iSchoolConnect" 
                className="h-8" 
              />
              <p className="text-sm text-muted-foreground mt-2">
                © 2023 Scholarship Buddy. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <Link to="/" className="text-muted-foreground hover:text-blue-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/" className="text-muted-foreground hover:text-blue-500 transition-colors">
                Terms of Service
              </Link>
              <Link to="/" className="text-muted-foreground hover:text-blue-500 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
