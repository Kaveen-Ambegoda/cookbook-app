"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, XCircle } from "lucide-react"

// Define the types for the filter state
export type RecipeFilters = {
  searchTerm: string
  // Specific category filters, allowing multi-selection
  mealType: string[]
  cuisine: string[]
  diet: string[]
  occasion: string[]
  skillLevel: string[]
  cookingTimeMax: number | ""
  caloriesMax: number | ""
  proteinMin: number | ""
  fatMin: number | ""
  carbsMin: number | ""
}

interface FilterSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  filters: RecipeFilters
  onFiltersChange: (newFilters: RecipeFilters) => void
  // Pass categories from page.tsx, and new options
  mealTypeOptions: string[]
  cuisineOptions: string[]
  dietOptions: string[]
  occasionOptions: string[]
  skillLevelOptions: string[]
}

export default function FilterSheet({
  isOpen,
  onOpenChange,
  filters,
  onFiltersChange,
  mealTypeOptions,
  cuisineOptions,
  dietOptions,
  occasionOptions,
  skillLevelOptions,
}: FilterSheetProps) {
  // Internal state for the sheet, which will be synced with the parent's state on apply/clear
  const [localFilters, setLocalFilters] = useState<RecipeFilters>(filters)

  // Sync local state with parent state when parent state changes (e.g., on clear filters from parent)
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  // Generic handler for multi-select checkboxes
  const handleMultiSelectChange = (field: keyof RecipeFilters, value: string, checked: boolean) => {
    setLocalFilters((prev) => {
      const currentArray = (prev[field] as string[]) || []
      const newArray = checked ? [...currentArray, value] : currentArray.filter((item) => item !== value)
      return { ...prev, [field]: newArray }
    })
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    onOpenChange(false) // Close the sheet after applying
  }

  const handleClearFilters = () => {
    const clearedFilters: RecipeFilters = {
      searchTerm: "",
      mealType: [],
      cuisine: [],
      diet: [],
      occasion: [],
      skillLevel: [],
      cookingTimeMax: "",
      caloriesMax: "",
      proteinMin: "",
      fatMin: "",
      carbsMin: "",
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters) // Also update parent state
    onOpenChange(false) // Close the sheet after clearing
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm p-4 flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Filter Recipes</SheetTitle>
          <SheetDescription>Apply filters to find the perfect recipe.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Search Bar */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search recipes..."
              value={localFilters.searchTerm}
              onChange={(e) => setLocalFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
              className="pr-8"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Filter Categories (General) - if still used distinctly from specific types */}
          <Accordion type="multiple" className="w-full" defaultValue={["categories"]}>

            {/* New Accordion Items for specific categories from RecipeForm */}
            <AccordionItem value="meal-type">
              <AccordionTrigger className="text-base font-semibold">Meal Type</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2 py-2">
                  {mealTypeOptions.map((option) => (
                    <Label
                      key={option}
                      htmlFor={`meal-type-${option}`}
                      className="flex items-center gap-2 font-normal cursor-pointer"
                    >
                      <Checkbox
                        id={`meal-type-${option}`}
                        checked={(localFilters.mealType || []).includes(option)}
                        onCheckedChange={(checked) => handleMultiSelectChange("mealType", option, !!checked)}
                      />{" "}
                      {option}
                    </Label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cuisine">
              <AccordionTrigger className="text-base font-semibold">Cuisine</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2 py-2">
                  {cuisineOptions.map((option) => (
                    <Label
                      key={option}
                      htmlFor={`cuisine-${option}`}
                      className="flex items-center gap-2 font-normal cursor-pointer"
                    >
                      <Checkbox
                        id={`cuisine-${option}`}
                        checked={(localFilters.cuisine || []).includes(option)}
                        onCheckedChange={(checked) => handleMultiSelectChange("cuisine", option, !!checked)}
                      />{" "}
                      {option}
                    </Label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="diet">
              <AccordionTrigger className="text-base font-semibold">Dietary Restrictions</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2 py-2">
                  {dietOptions.map((option) => (
                    <Label
                      key={option}
                      htmlFor={`diet-${option}`}
                      className="flex items-center gap-2 font-normal cursor-pointer"
                    >
                      <Checkbox
                        id={`diet-${option}`}
                        checked={(localFilters.diet || []).includes(option)}
                        onCheckedChange={(checked) => handleMultiSelectChange("diet", option, !!checked)}
                      />{" "}
                      {option}
                    </Label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="occasion">
              <AccordionTrigger className="text-base font-semibold">Occasion</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2 py-2">
                  {occasionOptions.map((option) => (
                    <Label
                      key={option}
                      htmlFor={`occasion-${option}`}
                      className="flex items-center gap-2 font-normal cursor-pointer"
                    >
                      <Checkbox
                        id={`occasion-${option}`}
                        checked={(localFilters.occasion || []).includes(option)}
                        onCheckedChange={(checked) => handleMultiSelectChange("occasion", option, !!checked)}
                      />{" "}
                      {option}
                    </Label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="skill-level">
              <AccordionTrigger className="text-base font-semibold">Skill Level</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2 py-2">
                  {skillLevelOptions.map((option) => (
                    <Label
                      key={option}
                      htmlFor={`skill-level-${option}`}
                      className="flex items-center gap-2 font-normal cursor-pointer"
                    >
                      <Checkbox
                        id={`skill-level-${option}`}
                        checked={(localFilters.skillLevel || []).includes(option)}
                        onCheckedChange={(checked) => handleMultiSelectChange("skillLevel", option, !!checked)}
                      />{" "}
                      {option}
                    </Label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cooking-time">
              <AccordionTrigger className="text-base font-semibold">Cooking Time (Max Minutes)</AccordionTrigger>
              <AccordionContent>
                <Input
                  type="number"
                  placeholder="e.g., 60"
                  value={localFilters.cookingTimeMax}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      cookingTimeMax: e.target.value === "" ? "" : Number.parseInt(e.target.value),
                    }))
                  }
                  min="1"
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="nutrition">
              <AccordionTrigger className="text-base font-semibold">Nutrition (Min per serving)</AccordionTrigger>
              <AccordionContent className="grid gap-3 py-2">
                <div>
                  <Label htmlFor="calories-max" className="text-sm">
                    Max Calories
                  </Label>
                  <Input
                    id="calories-max"
                    type="number"
                    placeholder="e.g., 500"
                    value={localFilters.caloriesMax}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        caloriesMax: e.target.value === "" ? "" : Number.parseInt(e.target.value),
                      }))
                    }
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="protein-min" className="text-sm">
                    Min Protein (g)
                  </Label>
                  <Input
                    id="protein-min"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 10"
                    value={localFilters.proteinMin}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        proteinMin: e.target.value === "" ? "" : Number.parseFloat(e.target.value),
                      }))
                    }
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="fat-min" className="text-sm">
                    Min Fat (g)
                  </Label>
                  <Input
                    id="fat-min"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 5"
                    value={localFilters.fatMin}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        fatMin: e.target.value === "" ? "" : Number.parseFloat(e.target.value),
                      }))
                    }
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="carbs-min" className="text-sm">
                    Min Carbs (g)
                  </Label>
                  <Input
                    id="carbs-min"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 20"
                    value={localFilters.carbsMin}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        carbsMin: e.target.value === "" ? "" : Number.parseFloat(e.target.value),
                      }))
                    }
                    min="0"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {/* Action Buttons */}
        <div className="mt-auto pt-4 border-t flex gap-2">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={handleClearFilters}>
            <XCircle className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
