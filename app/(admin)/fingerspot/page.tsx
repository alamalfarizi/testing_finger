// app/test-fingerspot/page.tsx
"use client";
import { useState } from "react";

export default function TestFingerspot() {
  const [res, setRes] = useState("");

  const handleClick = async () => {
    const result = await fetch("/api/fingerspot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FINGERSPOT_TOKEN}`,
      },
      body: JSON.stringify({
        cloud_id: "C2625841D7371B38",
        start_date: "2025-10-28",
        end_date: "2025-10-29",
      }),
    });

    const data = await result.json();
    setRes(JSON.stringify(data, null, 2));
  };

  return (
    <div className="p-6 text-black">
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Coba Fetch Data Fingerspot
      </button>
      <pre className="mt-4 bg-gray-100 p-3 rounded">{res}</pre>
    </div>
  );
}
