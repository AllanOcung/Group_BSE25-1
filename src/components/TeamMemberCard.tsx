import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Globe } from "lucide-react";

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  skills: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

const TeamMemberCard = ({ 
  name, 
  role, 
  bio, 
  avatar, 
  skills, 
  socialLinks 
}: TeamMemberCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02] text-center">
      <CardContent className="p-6 space-y-4">
        <div className="relative mx-auto w-24 h-24">
          <img 
            src={avatar} 
            alt={name}
            className="w-full h-full rounded-full object-cover ring-4 ring-background shadow-medium group-hover:shadow-strong transition-all duration-300"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-primary font-medium text-sm">{role}</p>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {bio}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{skills.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-center gap-2 pt-2">
          {socialLinks.github && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Github className="h-4 w-4" />
            </Button>
          )}
          {socialLinks.linkedin && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Linkedin className="h-4 w-4" />
            </Button>
          )}
          {socialLinks.twitter && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Twitter className="h-4 w-4" />
            </Button>
          )}
          {socialLinks.website && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Globe className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;