import { datasets } from "~/dataset";
import { NextResponse } from "next/server";
import { getData_WB } from "./getData_WB";
import { getData_IMF } from "./getData_IMF";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const year = searchParams.get("year") ?? "2020";

  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ data: [] });
  }

  let data;

  if (code.startsWith("WB")) {
    data = await getData_WB(code, year);
  }

  if (code.startsWith("IMF")) {
    data = getData_IMF(code, year);
  }

  return NextResponse.json({ data });
}
