"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const UserNav = () => {
  const {} = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const response = await axios.get("/api/user");
      return response.data;
    },
  });
  return (
    <div className="w-full flex items-center justify-center gap-2">
      <Avatar>
        <AvatarImage src="" alt="" />
        <AvatarFallback>PT</AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-start justify-start gap-0">
        <h1 className="text-md font-bold">حساب النقلية</h1>
        <p className="text-sm text-muted-foreground">{""}</p>
      </div>
    </div>
  );
};

export default UserNav;
