import { Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SEOHead from "@/components/SEOHead";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog | Orbita Bags — Bolsas Compostables en Chile"
        description="Artículos sobre sustentabilidad, compostaje y packaging ecológico para ecommerce en Chile."
        path="/blog"
      />
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <Link to="/">
              <Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Volver al inicio
              </Button>
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-12">
              Ideas, guías y novedades sobre packaging sustentable y ecommerce responsable.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <AnimatedSection key={post.slug} delay={index * 0.1}>
                <Link to={`/blog/${post.slug}`} className="group block h-full">
                  <Card className="overflow-hidden h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <div className="aspect-video bg-secondary flex items-center justify-center overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString("es-CL", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
