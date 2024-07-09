import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabase";
import { NextResponse } from "next/server";

export const POST = async (req: any, res: NextApiResponse) => {
  const { match, table } = await req.json();
  const { error, data } = await supabase.from(table).delete().match(match);
  return NextResponse.json({ error, data });
};
