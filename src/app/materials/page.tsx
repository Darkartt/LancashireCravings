"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TreePine,
  Leaf,
  Award,
  Shield,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { woodTypes, finishTypes } from "@/lib/data";
import Link from "next/link";

export default function MaterialsPage() {
  const [selectedWood, setSelectedWood] = useState(woodTypes[0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Premium Materials & Sustainability
          </h1>
          <p className="text-lg text-muted-foreground">
            We source only the finest sustainable hardwoods and apply expert finishing techniques
            to create pieces that last generations.
          </p>
        </div>

        {/* Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Award className="w-12 h-12 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">FSC Certified</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All our wood is Forest Stewardship Council certified, ensuring responsible sourcing.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Leaf className="w-12 h-12 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Sustainable Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We plant two trees for every one we use, contributing to forest regeneration.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Zero Waste</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Scraps are repurposed into smaller items or donated to local artisans.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Wood Species Selector */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
            Wood Species Guide
          </h2>
          <p className="text-muted-foreground">
            Explore our selection of premium hardwoods, each with unique characteristics and beauty.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wood List */}
          <div className="lg:col-span-1 space-y-3">
            {woodTypes.map((wood) => (
              <Card
                key={wood.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedWood.id === wood.id
                    ? "border-2 border-primary shadow-lg ring-2 ring-primary/20"
                    : "border-border"
                }`}
                onClick={() => setSelectedWood(wood)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{wood.name}</CardTitle>
                    {selectedWood.id === wood.id && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      £{wood.price}/bf
                    </Badge>
                    <Badge
                      variant={
                        wood.sustainability === "high"
                          ? "default"
                          : wood.sustainability === "medium"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {wood.sustainability} sustainability
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Wood Details */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <TreePine className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle className="text-2xl">{selectedWood.name}</CardTitle>
                    <CardDescription>Premium hardwood species</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Placeholder */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TreePine className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedWood.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Key Characteristics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedWood.characteristics.map((char, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{char}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert className="bg-primary/10 border-primary/20">
                  <Leaf className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    <strong>Sustainability:</strong> This wood has{" "}
                    <strong>{selectedWood.sustainability}</strong> sustainability rating.
                    All our hardwoods are FSC certified and responsibly sourced.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Starting from</p>
                    <p className="text-2xl font-bold text-primary">
                      £{selectedWood.price}
                      <span className="text-sm font-normal text-muted-foreground">/board foot</span>
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="/commission">
                      Commission with {selectedWood.name.split(" ")[0]}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Finish Types */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
            Finishing Options
          </h2>
          <p className="text-muted-foreground">
            Choose the perfect finish to protect and enhance your piece's natural beauty.
          </p>
        </div>

        <Tabs defaultValue={finishTypes[0].id} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
            {finishTypes.map((finish) => (
              <TabsTrigger key={finish.id} value={finish.id} className="text-xs md:text-sm">
                {finish.name.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {finishTypes.map((finish) => (
            <TabsContent key={finish.id} value={finish.id} className="mt-8">
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <div>
                      <CardTitle className="text-2xl">{finish.name}</CardTitle>
                      <CardDescription>Professional finishing technique</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">{finish.description}</p>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Durability</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${finish.durability * 10}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{finish.durability}/10</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Maintenance</h4>
                      <Badge
                        variant={
                          finish.maintenance === "low"
                            ? "default"
                            : finish.maintenance === "medium"
                            ? "secondary"
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {finish.maintenance} maintenance
                      </Badge>
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      All our finishes are food-safe, non-toxic, and environmentally friendly.
                      Perfect for both decorative and functional pieces.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">
              Ready to Create Your Masterpiece?
            </CardTitle>
            <CardDescription className="text-base">
              Commission a custom piece using your preferred wood and finish
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/commission">
                Request Commission
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
