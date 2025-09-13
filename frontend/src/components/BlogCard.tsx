import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

interface BlogCardProps {
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  slug: string;
}

const BlogCard = ({
  title,
  excerpt,
  coverImage,
  author,
  authorAvatar,
  publishedAt,
  readTime,
  tags,
  slug,
}: BlogCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02] cursor-pointer">
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <CardHeader className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-3">{excerpt}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <img
            src={authorAvatar}
            alt={author}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-muted-foreground">{author}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {publishedAt}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readTime}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary p-0"
          >
            Read More
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
