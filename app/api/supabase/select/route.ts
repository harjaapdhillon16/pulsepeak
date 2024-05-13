import { supabase } from "../../utils/supabase";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export const POST = async (req: any) => {
  const { match = undefined, table } = await req.json();
  if (match) {
    const { error, data } = await supabase.from(table).select("*").match(match);
    return NextResponse.json({ error, data });
  } else {
    const { error, data } = await supabase.from(table).select();
    return NextResponse.json({ error, data });
  }
};
