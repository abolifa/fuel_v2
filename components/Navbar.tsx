import React from "react";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";
import { ModeToggle } from "./theme-toggle";

const Navbar = () => {
  return (
    <div className="w-full h-16 border-b flex items-center justify-between px-10">
      <div className="relative w-72">
        <Input placeholder="Search" className="w-full" />
        <SearchIcon className="absolute h-4 w-4 top-1/2 transform -translate-y-1/2 left-2" />
      </div>

      <ModeToggle />
    </div>
  );
};

export default Navbar;
