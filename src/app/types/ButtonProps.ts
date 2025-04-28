import React from "react";

export interface ButtonProps {
  variant?: "default" | "secundary";
  text?: string;
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
  className?: string;
  icon?: string;
}
