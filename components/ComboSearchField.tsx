"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchableComboboxProps<T> {
  label: string;
  options: T[];
  field: any;
  loading?: boolean;
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string;
}

const SearchableCombobox = <T,>({
  label,
  options,
  field,
  loading = false,
  getOptionLabel,
  getOptionValue,
}: SearchableComboboxProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    field.onChange(value); // Set the selected value
    setIsOpen(false); // Close the popover
  };

  return (
    <FormItem className="flex flex-col">
      <FormLabel>{label}</FormLabel>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between",
                !field.value && "text-muted-foreground"
              )}
              onClick={() => setIsOpen((prev) => !prev)} // Toggle popover on click
            >
              {field.value
                ? getOptionLabel(
                    options.find(
                      (option) => getOptionValue(option) === field.value
                    ) as T
                  )
                : `إختر ${label}`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0 w-[500px]">
          <Command>
            <CommandInput placeholder={`البحث عن ${label}...`} />
            <CommandList>
              <CommandEmpty>لم يتم العثور على نتائج</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={getOptionValue(option)}
                    value={getOptionValue(option)}
                    onSelect={() => handleSelect(getOptionValue(option))}
                  >
                    {getOptionLabel(option)}
                    <Check
                      className={cn(
                        "ml-auto",
                        getOptionValue(option) === field.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
};

export default SearchableCombobox;
