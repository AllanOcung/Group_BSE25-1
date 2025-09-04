import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamMemberCard from "@/components/TeamMemberCard";

const Team = () => {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      bio: "Passionate full-stack developer with 5+ years experience building scalable web applications. Loves React, Node.js, and cloud architecture.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
      skills: ["React", "Node.js", "AWS", "PostgreSQL", "TypeScript"],
      socialLinks: {
        github: "#",
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Alex Rodriguez",
      role: "AI/ML Engineer",
      bio: "Machine learning engineer specializing in NLP and computer vision. PhD in Computer Science with focus on deep learning applications.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      skills: ["Python", "TensorFlow", "PyTorch", "OpenAI", "MLOps"],
      socialLinks: {
        github: "#",
        linkedin: "#",
        website: "#"
      }
    },
    {
      name: "Marcus Johnson",
      role: "Mobile Developer",
      bio: "Expert mobile developer with experience in both native iOS/Android and cross-platform development using React Native and Flutter.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      skills: ["React Native", "Swift", "Kotlin", "Flutter", "Firebase"],
      socialLinks: {
        github: "#",
        linkedin: "#"
      }
    },
    {
      name: "Emma Wilson",
      role: "UI/UX Designer",
      bio: "Creative designer with a passion for creating beautiful, user-centered digital experiences. Specializes in design systems and accessibility.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      skills: ["Figma", "Adobe CC", "Design Systems", "Prototyping", "User Research"],
      socialLinks: {
        github: "#",
        linkedin: "#",
        website: "#"
      }
    },
    {
      name: "David Kim",
      role: "DevOps Engineer",
      bio: "DevOps specialist focused on automation, CI/CD, and cloud infrastructure. Helps teams deploy fast and scale efficiently.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      skills: ["Docker", "Kubernetes", "AWS", "Terraform", "Jenkins"],
      socialLinks: {
        github: "#",
        linkedin: "#"
      }
    },
    {
      name: "Lisa Park",
      role: "Product Manager",
      bio: "Experienced product manager who bridges the gap between business goals and technical implementation. Passionate about user-centric product development.",
      avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&h=200&fit=crop&crop=face",
      skills: ["Product Strategy", "User Research", "Agile", "Analytics", "Roadmapping"],
      socialLinks: {
        linkedin: "#",
        twitter: "#",
        website: "#"
      }
    },
    {
      name: "Jordan Martinez",
      role: "Backend Developer",
      bio: "Backend engineer specializing in microservices architecture, API design, and database optimization. Expert in Python and Go.",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face",
      skills: ["Python", "Go", "PostgreSQL", "Redis", "Microservices"],
      socialLinks: {
        github: "#",
        linkedin: "#"
      }
    },
    {
      name: "Priya Patel",
      role: "Frontend Developer",
      bio: "Frontend developer passionate about creating performant, accessible web applications. Specializes in modern JavaScript frameworks and CSS.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
      skills: ["React", "Vue.js", "CSS", "TypeScript", "Testing"],
      socialLinks: {
        github: "#",
        linkedin: "#",
        twitter: "#"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet Our Team
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We're a diverse group of passionate creators, developers, and designers 
              working together to build amazing digital experiences.
            </p>
          </div>
        </section>

        {/* Team Stats */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">120+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">5+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Core Team</h2>
              <p className="text-lg text-muted-foreground">
                Get to know the talented individuals behind our success
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <TeamMemberCard key={index} {...member} />
              ))}
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="py-20 bg-gradient-primary">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Want to Join Our Team?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion 
              for creating exceptional digital experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors">
                View Open Positions
              </button>
              <button className="border border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-colors">
                Get in Touch
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Team;