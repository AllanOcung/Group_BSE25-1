import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Eye } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  author: string;
  authorAvatar: string;
}

const ProjectCard = ({
  title,
  description,
  image,
  techStack,
  githubUrl,
  liveUrl,
  author,
  authorAvatar,
}: ProjectCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02]">
      <div className="aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg leading-tight">{title}</h3>
          <div className="flex gap-2">
            {githubUrl && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Github className="h-4 w-4" />
              </Button>
            )}
            {liveUrl && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {techStack.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {techStack.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{techStack.length - 3}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={authorAvatar}
              alt={author}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-muted-foreground">{author}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
