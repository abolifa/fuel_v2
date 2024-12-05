import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

const UserNav = () => {
  return (
    <div className="w-full flex items-center justify-start gap-2">
      <Avatar>
        <AvatarImage src="" alt="" />
        <AvatarFallback>PT</AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-start justify-start gap-0">
        <h1 className="text-md font-bold">حساب النقلية</h1>
        <p className="text-sm text-muted-foreground">admin@gmail.com</p>
      </div>
    </div>
  );
};

export default UserNav;
