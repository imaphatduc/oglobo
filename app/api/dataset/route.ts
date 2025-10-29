// export const dynamic = "force-static";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const year = searchParams.get("year") ?? "2020";

  const indicator = searchParams.get("indicator");

  if (!indicator) {
    return NextResponse.json({ data: [] });
  }

  const url = `https://data360api.worldbank.org/data360/data?DATABASE_ID=WB_WDI&INDICATOR=${indicator}&TIME_PERIOD=${year}&skip=0`;

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });

  const { value: data } = await res.json();

  return NextResponse.json(data);
}
