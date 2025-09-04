import { Button } from "@/components/ui/button";
import { ArrowRight, Users, FolderOpen, BookOpen } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-24 md:py-32">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Showcase Your
            <span className="block bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Creative Journey
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
            A collaborative platform where talented creators showcase their projects, 
            share insights, and build amazing things together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-gray-100">
              Explore Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
              Join Our Team
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-blue-200">Team Members</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 mx-auto mb-4">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">120+</div>
              <div className="text-blue-200">Projects</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">80+</div>
              <div className="text-blue-200">Blog Posts</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;