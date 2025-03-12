
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It <span className="text-blue-500">Works</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-500">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
            <p className="text-muted-foreground">Complete your academic and personal information to get personalized scholarship matches.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-500">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Discover Scholarships</h3>
            <p className="text-muted-foreground">Browse through our curated list of scholarships or get AI-powered recommendations based on your profile.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-500">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Applications</h3>
            <p className="text-muted-foreground">Save scholarships, track your application status, and manage deadlines all in one place.</p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="group"
            asChild
          >
            <a href="#features-section">
              Learn More
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
