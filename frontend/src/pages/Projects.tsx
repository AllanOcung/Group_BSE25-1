import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = ["all", "web", "mobile", "ai", "design"];

  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include user authentication, payment integration, and admin dashboard.",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      techStack: ["React", "Node.js", "PostgreSQL", "Stripe"],
      githubUrl: "#",
      liveUrl: "#",
      author: "Sarah Chen",
      authorAvatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    },
    {
      title: "AI Task Manager",
      description:
        "Smart task management app powered by AI for automated categorization and priority suggestions. Built with Next.js and OpenAI API.",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      techStack: ["Next.js", "OpenAI", "Prisma", "TypeScript"],
      githubUrl: "#",
      liveUrl: "#",
      author: "Alex Rodriguez",
      authorAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    {
      title: "Mobile Banking App",
      description:
        "Secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial analytics.",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
      techStack: ["React Native", "Firebase", "Plaid API"],
      githubUrl: "#",
      liveUrl: "#",
      author: "Marcus Johnson",
      authorAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
    {
      title: "Design System Library",
      description:
        "Comprehensive design system built with React and Storybook, featuring reusable components and design tokens for consistent UIs.",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
      techStack: ["React", "Storybook", "CSS-in-JS", "Figma"],
      githubUrl: "#",
      liveUrl: "#",
      author: "Emma Wilson",
      authorAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    },
    {
      title: "Social Media Dashboard",
      description:
        "Analytics dashboard for social media management with real-time data visualization, scheduling tools, and performance metrics.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      techStack: ["Vue.js", "D3.js", "Express", "MongoDB"],
      githubUrl: "#",
      liveUrl: "#",
      author: "David Kim",
      authorAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    },
    {
      title: "Fitness Tracking App",
      description:
        "Comprehensive fitness tracking mobile app with workout planning, progress monitoring, and social features for motivation.",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      techStack: ["Flutter", "Firebase", "Google Fit API"],
      githubUrl: "#",
      liveUrl: "#",
      author: "Lisa Park",
      authorAvatar:
        "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop&crop=face",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-secondary">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Our Projects
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Explore innovative projects built by our talented team members.
                From web applications to mobile apps and AI solutions.
              </p>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="sm:w-auto">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="py-8 border-b">
          <div className="container">
            <div className="flex flex-wrap gap-2 justify-center">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Projects
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
