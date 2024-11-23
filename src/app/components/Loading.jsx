import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );
}
