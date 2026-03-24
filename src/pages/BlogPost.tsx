import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SEOHead from "@/components/SEOHead";
import { blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${post.title} | Orbita Bags`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
      />
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimatedSection>
            <Link to="/blog">
              <Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Volver al blog
              </Button>
            </Link>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("es-CL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 leading-tight">
              {post.title}
            </h1>

            <div className="aspect-video bg-secondary rounded-xl overflow-hidden mb-10">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>

            <article
              className="prose prose-lg max-w-none
                prose-headings:text-foreground prose-headings:font-bold
                prose-h2:text-[1.75rem] prose-h2:md:text-3xl prose-h2:mt-20 prose-h2:mb-6 prose-h2:pt-8 prose-h2:border-t prose-h2:border-border
                prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-14 prose-h3:mb-5
                prose-p:text-muted-foreground prose-p:leading-[1.85] prose-p:mb-7 prose-p:text-base prose-p:md:text-lg
                prose-strong:text-foreground prose-strong:font-semibold
                prose-a:text-primary prose-a:font-medium prose-a:underline prose-a:underline-offset-4 prose-a:decoration-primary/40 hover:prose-a:decoration-primary hover:prose-a:text-primary/80
                prose-ul:my-8 prose-ul:space-y-3 prose-ul:list-disc prose-ul:pl-6
                prose-li:text-muted-foreground prose-li:leading-[1.8] prose-li:text-base prose-li:md:text-lg
                prose-em:text-muted-foreground/80
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
