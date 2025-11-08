"use client";

import { UseFormReturn } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CommissionFormData } from "@/lib/validations/commission";
import { woodTypes, finishTypes } from "@/lib/data";
import { TreePine, Sparkles, Ruler, LeafyGreen } from "lucide-react";

interface Step4MaterialsProps {
  form: UseFormReturn<CommissionFormData>;
}

export function Step4Materials({ form }: Step4MaterialsProps) {
  const selectedWood = woodTypes.find((w) => w.id === form.watch("woodType"));
  const selectedFinish = finishTypes.find((f) => f.id === form.watch("finishType"));
  const dimensionUnit = form.watch("dimensions.unit");

  return (
    <div className="space-y-8">
      {/* Wood Type Selection */}
      <FormField
        control={form.control}
        name="woodType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold flex items-center gap-2">
              <TreePine className="w-5 h-5 text-accent" />
              Wood Selection *
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select your preferred wood type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {woodTypes.map((wood) => (
                  <SelectItem key={wood.id} value={wood.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{wood.name}</span>
                      <Badge variant="outline" className="text-xs">
                        £{wood.price}/board ft
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Choose the wood species that best suits your project
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Wood Details Card */}
      {selectedWood && (
        <Card className="bg-muted/30 border-border">
          <CardContent className="pt-6 space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">{selectedWood.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedWood.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedWood.characteristics.map((char, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {char}
                </Badge>
              ))}
              <Badge
                variant={
                  selectedWood.sustainability === "high"
                    ? "default"
                    : selectedWood.sustainability === "medium"
                    ? "secondary"
                    : "outline"
                }
                className="text-xs flex items-center gap-1"
              >
                <LeafyGreen className="w-3 h-3" />
                {selectedWood.sustainability} sustainability
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Finish Type Selection */}
      <FormField
        control={form.control}
        name="finishType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Finish Selection *
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select your preferred finish" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {finishTypes.map((finish) => (
                  <SelectItem key={finish.id} value={finish.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{finish.name}</span>
                      <Badge variant="outline" className="text-xs">
                        Durability: {finish.durability}/10
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The finish protects and enhances the wood's natural beauty
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Finish Details Card */}
      {selectedFinish && (
        <Card className="bg-muted/30 border-border">
          <CardContent className="pt-6 space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">{selectedFinish.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedFinish.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Durability: {selectedFinish.durability}/10
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {selectedFinish.maintenance} maintenance
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Dimensions (Optional) */}
      <div className="space-y-4">
        <FormLabel className="text-lg font-semibold flex items-center gap-2">
          <Ruler className="w-5 h-5 text-accent" />
          Approximate Dimensions (Optional)
        </FormLabel>
        <p className="text-sm text-muted-foreground">
          If you have specific size requirements, provide approximate dimensions
        </p>

        {/* Unit Selection */}
        <FormField
          control={form.control}
          name="dimensions.unit"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="cm" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Centimeters (cm)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="inches" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Inches (in)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Dimension Inputs */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="dimensions.length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                    className="text-base"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  {dimensionUnit}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dimensions.width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                    className="text-base"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  {dimensionUnit}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dimensions.height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                    className="text-base"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  {dimensionUnit}
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Additional Requirements */}
      <FormField
        control={form.control}
        name="additionalRequirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Additional Material Requirements
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Any special considerations? (e.g., FSC certified only, specific grain pattern, outdoor durability, food-safe finish, etc.)"
                className="min-h-[100px] text-base resize-y"
              />
            </FormControl>
            <FormDescription>
              Let us know about any special material or finish requirements
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
