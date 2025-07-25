"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, XCircle } from "lucide-react"

export default function RecipeFilterPanel() {
  const [searchTerm, setSearchTerm] = useState("")

  const handleClearFilters = () => {
    setSearchTerm("")
    // In a real application, you would also reset all checkbox states here
    // For demonstration, we only reset the search term.
  }

  return (
    <div className="w-full max-w-xs space-y-6 p-4 border-r bg-background">
      <h2 className="text-2xl font-bold">Filters</h2>

      {/* Search Bar */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-8"
        />
        <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Filter Categories */}
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="cuisine">
          <AccordionTrigger className="text-base font-semibold">Cuisine</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2 py-2">
              <Label htmlFor="cuisine-italian" className="flex items-center gap-2 font-normal cursor-pointer">
                <Checkbox id="cuisine-italian" /> Italian
              </Label>
              <Label htmlFor="cuisine-mexican" className="flex items-center gap-2 font-normal cursor-pointer">
                <Checkbox id="cuisine-mexican" /> Mexican
              </Label>
              <Label htmlFor="cuisine-asian" className="flex items-center gap-2 font-normal cursor-pointer">
                <Checkbox id="cuisine-asian" /> Asian
              </Label>
              <Label htmlFor="cuisine-indian" className="flex items-center gap-2 font-normal cursor-pointer">
                <Checkbox id="cuisine-indian" /> Indian
              </Label>
              <Label htmlFor="cuisine-mediterranean" className="flex items-center gap-2 font-normal cursor-pointer">
                <Checkbox id="cuisine-mediterranean" /> Mediterranean
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dietary">
          <AccordionTrigger className="text-base font-semibold">Dietary Restrictions</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2 py-2">
              <Label htmlFor="dietary-vegetarian" className="flex items-center gap-2 font-normal cursor-pointer">
                <Checkbox id="dietary-vegetarian" /> Vegetarian
              </Label>
              <Label htmlFor="dietary-vegan" className="flex items-center gap-2 font-normal cursor-pointer">
                <Checkbox id="dietary-vegan" /> Vegan
              </Label>
              <Label htmlFor="dietary-gluten-free" className="flex items-center gap-2 font-normal cursor-pointer">
                <Checkbox id="dietary-gluten-free" /> Gluten-Free
              </Label>
              <Label htmlFor="dietary-dairy-free" className="flex items-center gap-2 font-normal cursor-pointer">
                <Checkbox id="dietary-dairy-free" /> Dairy-Free
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="meal-type">
          <AccordionTrigger className="text-base font-semibold">Meal Type</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2 py-2">
              <Label htmlFor="meal-breakfast" className="flex items-center gap-2 font-normal cursor-pointer">
                <Checkbox id="meal-breakfast" /> Breakfast
              </Label>
              <Label htmlFor="meal-lunch" className="flex items-center gap-2 font-normal cursor-pointer">
                <Checkbox id="meal-lunch" /> Lunch
              </Label>
              <Label htmlFor="meal-dinner" className="flex items-center gap-2 font-normal cursor-pointer">
                <Checkbox id="meal-dinner" /> Dinner
              </Label>
              <Label htmlFor="meal-dessert" className="flex items-center gap-2 font-normal cursor-pointer">
                <Checkbox id="meal-dessert" /> Dessert
              </Label>
              <Label htmlFor="meal-snack" className="flex items-center gap-2 font-normal cursor-pointer">
                <Checkbox id="meal-snack" /> Snack
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Clear Filters Button */}
      <Button variant="outline" className="w-full bg-transparent" onClick={handleClearFilters}>
        <XCircle className="w-4 h-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  )
}
