"use client";

import React, { useState } from "react";

const STATUS_STYLES = {
  pending: "bg-yellow-200 text-yellow-800",
  canceled: "bg-red-200 text-red-800",
  completed: "bg-green-200 text-green-800",
};

const NEXT_STATUS = {
  pending: "completed",
  completed: "canceled",
  canceled: "pending",
};

export default function StatusBadge({ initialStatus, onChange }) {
  const [status, setStatus] = useState(initialStatus);

  const handleClick = () => {
    const nextStatus = NEXT_STATUS[status];
    setStatus(nextStatus);

    // Notificar al padre del cambio
    if (onChange) {
      onChange(nextStatus);
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full cursor-pointer ${STATUS_STYLES[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
