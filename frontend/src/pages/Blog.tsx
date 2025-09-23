import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, User, Tag } from "lucide-react";
import { useState } from "react";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const blogPosts = [
    {
      title: "Building Scalable React Applications: Best Practices for 2024",
      excerpt:
        "Learn the latest patterns and practices for building maintainable React applications that can scale with your team and user base. We'll cover component architecture, state management, and performance optimization.",
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
        "Explore the emerging trends in web development, from AI integration to new frameworks and tools that are shaping the industry. Discover what's coming next in the world of frontend development.",
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
    {
      title: "Machine Learning in Mobile Apps: A Practical Guide",
      excerpt:
        "Discover how to integrate machine learning capabilities into mobile applications. We'll cover TensorFlow Lite, Core ML, and practical implementation strategies for common ML use cases.",
      coverImage:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
      author: "Alex Rodriguez",
      authorAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      publishedAt: "Dec 10, 2024",
      readTime: "12 min read",
      tags: ["Mobile", "Machine Learning", "AI"],
      slug: "ml-mobile-apps",
    },
    {
      title: "Design Systems: Building Consistent User Experiences",
      excerpt:
        "Learn how to create and maintain design systems that ensure consistency across your products. We'll explore tools, processes, and best practices for scalable design.",
      coverImage:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      author: "Emma Wilson",
      authorAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      publishedAt: "Dec 8, 2024",
      readTime: "10 min read",
      tags: ["Design", "UI/UX", "Design Systems"],
      slug: "design-systems-guide",
    },
    {
      title: "DevOps Best Practices for Small Teams",
      excerpt:
        "Implement DevOps practices without enterprise complexity. Learn about CI/CD, infrastructure as code, and monitoring strategies that work for small development teams.",
      coverImage:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop",
      author: "David Kim",
      authorAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      publishedAt: "Dec 5, 2024",
      readTime: "9 min read",
      tags: ["DevOps", "CI/CD", "Infrastructure"],
      slug: "devops-small-teams",
    },
    {
      title: "The Art of API Design: Creating Developer-Friendly Interfaces",
      excerpt:
        "Master the principles of good API design. From RESTful conventions to GraphQL schemas, learn how to create APIs that developers love to use.",
      coverImage:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      author: "Jordan Martinez",
      authorAvatar:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face",
      publishedAt: "Dec 3, 2024",
      readTime: "7 min read",
      tags: ["API", "Backend", "Development"],
      slug: "api-design-principles",
    },
  ];

  const categories = [
    { name: "All Posts", count: blogPosts.length },
    { name: "Development", count: 4 },
    { name: "Design", count: 2 },
    { name: "DevOps", count: 1 },
    { name: "AI/ML", count: 2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Blog
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Insights, tutorials, and thoughts from our team of developers,
              designers, and industry experts.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <aside className="lg:col-span-1 space-y-8">
                {/* Categories */}
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Categories
                  </h3>
                  <ul className="space-y-2">
                    {categories.map((category, index) => (
                      <li key={index}>
                        <button className="flex items-center justify-between w-full text-left py-2 px-3 rounded-md hover:bg-muted transition-colors">
                          <span className="text-sm">{category.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {category.count}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent Posts */}
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Recent Posts</h3>
                  <ul className="space-y-3">
                    {blogPosts.slice(0, 4).map((post, index) => (
                      <li key={index}>
                        <a href="#" className="block group">
                          <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {post.publishedAt}
                          </p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* Blog Posts */}
              <div className="lg:col-span-3">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Latest Articles</h2>
                  <p className="text-muted-foreground">
                    Stay up to date with the latest trends and best practices in
                    tech.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogPosts.map((post, index) => (
                    <BlogCard key={index} {...post} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-12">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="default" size="sm">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-secondary">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest articles and updates
              delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button variant="hero">Subscribe</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
