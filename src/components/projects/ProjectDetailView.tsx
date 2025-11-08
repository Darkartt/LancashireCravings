"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ImageLightbox } from "@/components/gallery/ImageLightbox";
import {
  Clock,
  Ruler,
  TreePine,
  Sparkles,
  Quote,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { Project } from "@/lib/media-types";

interface ProjectDetailViewProps {
  project: Project;
  projectMedia: any[];
  relatedProjects?: Project[];
}

export function ProjectDetailView({ project, projectMedia, relatedProjects = [] }: ProjectDetailViewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filter media by category
  const allImages = projectMedia.filter((item) => item.type === "image");
  const processImages = projectMedia.filter((item) => item.category === "process");

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const getDifficultyVariant = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "default";
      case "intermediate":
        return "secondary";
      case "expert":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl border-2 border-border">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                onClick={() => openLightbox(0)}
              />
            </div>
            {project.mediaCount.images > 1 && (
              <Button
                variant="secondary"
                className="absolute bottom-4 right-4"
                onClick={() => openLightbox(0)}
              >
                View All {project.mediaCount.images} Photos
              </Button>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <Badge variant="outline" className="text-sm capitalize">
                {project.category.replace("-", " ")}
              </Badge>
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Completion Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">{project.completionTime}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Difficulty
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={getDifficultyVariant(project.difficulty)} className="text-sm">
                    {project.difficulty || "Intermediate"}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Materials */}
            {project.materials && project.materials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TreePine className="w-5 h-5 text-primary" />
                    Materials Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.materials.map((material, index) => (
                      <Badge key={index} variant="secondary">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Commission CTA */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Interested in a Custom Piece?</CardTitle>
                <CardDescription>
                  Commission a similar masterpiece tailored to your vision
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/commission">
                    Request Commission <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Tabbed Content */}
      <section className="container mx-auto px-4 pb-16">
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="gallery">
              Gallery ({allImages.length})
            </TabsTrigger>
            <TabsTrigger value="process">
              Process ({processImages.length})
            </TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="relative aspect-square rounded-lg overflow-hidden shadow-md cursor-pointer group"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Process Tab */}
          <TabsContent value="process" className="mt-8">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processImages.map((item: any, index: number) => (
                  <Card key={item.id} className="overflow-hidden group cursor-pointer" onClick={() => openLightbox(index)}>
                    <div className="relative aspect-video">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">{item.alt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-primary" />
                    Project Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Difficulty Level</p>
                      <Badge variant={getDifficultyVariant(project.difficulty)}>
                        {project.difficulty || "Intermediate"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Completion Time</p>
                      <p className="font-medium">{project.completionTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Photos</p>
                      <p className="font-medium">{project.mediaCount.images}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Videos</p>
                      <p className="font-medium">{project.mediaCount.videos}</p>
                    </div>
                  </div>

                  {project.materials && project.materials.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Materials</p>
                        <div className="flex flex-wrap gap-2">
                          {project.materials.map((material, index) => (
                            <Badge key={index} variant="secondary">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {project.client && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Commissioned By</p>
                        <p className="font-medium">{project.client}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Client Testimonial */}
              {project.client && (
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Quote className="w-5 h-5 text-primary" />
                      Client Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="italic text-muted-foreground mb-4">
                      "The craftsmanship and attention to detail in this piece exceeded all expectations.
                      A true masterpiece that will be cherished for generations."
                    </blockquote>
                    <p className="text-sm font-medium">— {project.client}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <>
          <Separator className="my-12" />
          <section className="container mx-auto px-4 pb-16">
            <div className="mb-8">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
                Related Projects
              </h2>
              <p className="text-muted-foreground">
                Explore more masterpieces in the {project.category} category
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.slice(0, 3).map((relatedProject) => (
                <Card key={relatedProject.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/projects/${relatedProject.slug}`}>
                    <div className="relative aspect-square">
                      <Image
                        src={relatedProject.coverImage}
                        alt={relatedProject.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize text-xs">
                          {relatedProject.category.replace("-", " ")}
                        </Badge>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-xl">{relatedProject.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {relatedProject.description}
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Lightbox */}
      <ImageLightbox
        images={allImages.map((item: any) => ({
          src: item.src,
          alt: item.alt,
          category: item.category,
        }))}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </div>
  );
}
