import { Antenna, Crosshair, Joystick, Rocket } from "lucide-react";
import { FaSuitcase, FaUser } from "react-icons/fa6";
import { GrInspect, GrTools } from "react-icons/gr";
import { FiTool } from "react-icons/fi";
import { FaFighterJet } from "react-icons/fa";
import { FaJetFighterUp } from "react-icons/fa6";

export const majorvalue = [
  {
    id: 1,
    name: "مدير",
    icon: FaSuitcase,
  },
  {
    id: 2,
    name: "مشرف",
    icon: GrInspect,
  },
  {
    id: 3,
    name: "موظف",
    icon: FaUser,
  },
  {
    id: 4,
    name: "مشغل",
    icon: Joystick,
  },
  {
    id: 5,
    name: "تسليح",
    icon: Rocket,
  },
  {
    id: 6,
    name: "ميكانيكي",
    icon: FiTool,
  },
  {
    id: 7,
    name: "كاميرا",
    icon: Crosshair,
  },
  {
    id: 8,
    name: "إلكتروني",
    icon: Antenna,
  },
];

export const teamvalue = [
  {
    id: 1,
    name: "Akinci",
    icon: FaFighterJet,
  },
  {
    id: 2,
    name: "TB2",
    icon: FaJetFighterUp,
  },
];
