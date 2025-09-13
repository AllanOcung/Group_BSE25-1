import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProjectCard from "@/components/ProjectCard";
import BlogCard from "@/components/BlogCard";
import TeamMemberCard from "@/components/TeamMemberCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Palette, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Mock data for featured projects
  const featuredProjects = [
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
  ];

  // Mock data for recent blog posts
  const recentPosts = [
    {
      title: "Building Scalable React Applications: Best Practices for 2024",
      excerpt:
        "Learn the latest patterns and practices for building maintainable React applications that can scale with your team and user base.",
      coverImage:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      author: "Emma Wilson",
      authorAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      publishedAt: "Dec 15, 2024",
      readTime: "8 min read",
      tags: ["React", "JavaScript", "Best Practices"],
      slug: "scalable-react-applications",
    },
    {
      title: "The Future of Web Development: Trends to Watch",
      excerpt:
        "Explore the emerging trends in web development, from AI integration to new frameworks and tools that are shaping the industry.",
      coverImage:
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop",
      author: "David Kim",
      authorAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      publishedAt: "Dec 12, 2024",
      readTime: "6 min read",
      tags: ["Web Development", "Trends", "AI"],
      slug: "future-web-development",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <HeroSection />

        {/* Featured Projects Section */}
        <section className="py-20 bg-gradient-secondary">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover amazing projects built by our talented community
                members
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>

            <div className="text-center">
              <Link to="/projects">
                <Button variant="outline" size="lg">
                  View All Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What We Do
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're passionate about creating innovative solutions across
                different domains
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center">
                  <Code2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Web Development</h3>
                <p className="text-muted-foreground">
                  Full-stack web applications using modern technologies and best
                  practices
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Mobile Apps</h3>
                <p className="text-muted-foreground">
                  Cross-platform mobile applications that deliver exceptional
                  user experiences
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center">
                  <Palette className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">UI/UX Design</h3>
                <p className="text-muted-foreground">
                  Beautiful and intuitive designs that prioritize user
                  experience and accessibility
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Blog Posts Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Latest Insights
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Read our latest blog posts about development, design, and
                industry trends
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {recentPosts.map((post, index) => (
                <BlogCard key={index} {...post} />
              ))}
            </div>

            <div className="text-center">
              <Link to="/blog">
                <Button variant="outline" size="lg">
                  Read All Posts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Join Our Team?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Connect with like-minded creators, showcase your work, and
              collaborate on exciting projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="hero"
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Join Our Community
              </Button>
              <Link to="/team">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Meet the Team
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
