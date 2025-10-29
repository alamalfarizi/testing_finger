import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// --- Supabase setup ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST() {
  const url = "https://developer.fingerspot.io/api/get_attlog";

  const payload = {
    trans_id: "1",
    cloud_id: process.env.C2625841D7371B38, // isi dari dashboard Fingerspot
    start_date: "2025-10-20", // nanti bisa ubah ke dynamic (today)
    end_date: "2025-10-29",
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.L3GMYQN92NAG52HP}`, // token API kamu
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    // --- contoh: simpan ke Supabase ---
    if (Array.isArray(data.data)) {
      const { error } = await supabase.from("attendance").insert(
        data.data.map((d: any) => ({
          user_id: d.pin,          // field dari response Fingerspot
          scan_time: d.date_time,  // format: YYYY-MM-DD HH:mm:ss
          mode: d.verifymode,      // mode masuk/pulang
        }))
      );

      if (error) throw error;
    }

    return NextResponse.json({ success: true, count: data.data?.length || 0 });
  } catch (err: any) {
    console.error("Error fetching data:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
