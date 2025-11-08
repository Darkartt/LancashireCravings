"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommissionFormData } from "@/lib/validations/commission";
import { Upload, X, Image as ImageIcon, FileWarning } from "lucide-react";

interface Step3ReferencesProps {
  form: UseFormReturn<CommissionFormData>;
}

export function Step3References({ form }: Step3ReferencesProps) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadError("");
    const maxFiles = 5;
    const maxSizeMB = 5;

    if (files.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const newPreviews: string[] = [];
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setUploadError(`File ${file.name} is too large. Maximum size is ${maxSizeMB}MB`);
        return;
      }

      if (!file.type.startsWith("image/")) {
        setUploadError(`File ${file.name} is not an image`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === fileArray.length) {
          setPreviewImages(newPreviews);
          form.setValue("referenceImages", newPreviews);
          form.setValue("hasReferences", true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const updated = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updated);
    form.setValue("referenceImages", updated);
    if (updated.length === 0) {
      form.setValue("hasReferences", false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Optional:</strong> Share images that inspire your vision or show similar pieces.
          This helps us understand your aesthetic preferences and design direction.
        </p>
      </div>

      {/* File Upload */}
      <FormField
        control={form.control}
        name="hasReferences"
        render={() => (
          <FormItem>
            <FormLabel className="text-base font-semibold flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-accent" />
              Design Reference Images
            </FormLabel>
            <FormControl>
              <div className="space-y-4">
                {/* Upload Button */}
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="relative cursor-pointer"
                    asChild
                  >
                    <label>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Images
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    <Badge variant="secondary" className="mr-2">Max 5 images</Badge>
                    <Badge variant="secondary">Max 5MB each</Badge>
                  </div>
                </div>

                {uploadError && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                    <FileWarning className="w-4 h-4" />
                    {uploadError}
                  </div>
                )}

                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previewImages.map((preview, index) => (
                      <Card key={index} className="relative group overflow-hidden">
                        <CardContent className="p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt={`Reference ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {previewImages.length === 0 && (
                  <Card className="border-dashed border-2 border-muted-foreground/25">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
                      <p className="text-sm text-muted-foreground">
                        No images uploaded yet
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You can skip this step if you don't have reference images
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </FormControl>
            <FormDescription>
              Upload photos of pieces you admire, sketches, or any visual references
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Reference Notes */}
      <FormField
        control={form.control}
        name="referenceNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Additional Notes About References
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Tell us about the reference images... What specific elements do you like? What aspects should we incorporate or avoid?"
                className="min-h-[120px] text-base resize-y"
              />
            </FormControl>
            <FormDescription>
              Help us understand what resonates with you in these references
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
