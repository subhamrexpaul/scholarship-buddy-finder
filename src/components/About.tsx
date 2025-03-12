
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Award, Globe } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          About <span className="text-blue-500">Us</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Empowering Students Worldwide</h3>
            <p className="text-muted-foreground mb-6">
              Our mission is to make education accessible to everyone by connecting students 
              with scholarship opportunities worldwide. We leverage advanced technology to 
              provide personalized scholarship matches and streamline the application process.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>10K+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <span>500+ Universities</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" />
                <span>1000+ Scholarships</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <span>Global Access</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Our Commitment</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-500">✓</span>
                </div>
                <p className="text-muted-foreground">Curated and verified scholarship opportunities</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-500">✓</span>
                </div>
                <p className="text-muted-foreground">AI-powered personalized recommendations</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-500">✓</span>
                </div>
                <p className="text-muted-foreground">Regular updates with new opportunities</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-500">✓</span>
                </div>
                <p className="text-muted-foreground">Dedicated support throughout the process</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
