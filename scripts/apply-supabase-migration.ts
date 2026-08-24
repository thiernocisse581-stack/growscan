import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

let envUrl = "";
let envKey = "";

try {
  const envContent = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of envContent.split("\n")) {
    if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
      envUrl = line.split("=")[1].trim();
    }
    if (line.startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY=")) {
      envKey = line.split("=")[1].trim();
    }
  }
} catch (e) {}

const supabaseUrl = envUrl || "https://mstvejqcygcmsirlvgwo.supabase.co";
const supabaseAnonKey = envKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdHZlanFjeWdjbXNpcmx2Z3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMzA2NjMsImV4cCI6MjEwMjkwNjY2M30.gnxc528OUIJRe9jd3wmoqTqpWKklErYgj4-BDrx69qg";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log("⚡ Verification des tables Supabase sur :", supabaseUrl);

  try {
    const { data: profiles, error: pErr } = await supabase.from("profiles").select("count").limit(1);
    console.log("Table profiles :", pErr ? `Non créée (${pErr.message})` : "✅ Opérationnelle");

    const { data: orders, error: oErr } = await supabase.from("orders").select("count").limit(1);
    console.log("Table orders :", oErr ? `Non créée (${oErr.message})` : "✅ Opérationnelle");

    const { data: transactions, error: tErr } = await supabase.from("transactions").select("count").limit(1);
    console.log("Table transactions :", tErr ? `Non créée (${tErr.message})` : "✅ Opérationnelle");

    const { data: reports, error: rErr } = await supabase.from("reports").select("count").limit(1);
    console.log("Table reports :", rErr ? `Non créée (${rErr.message})` : "✅ Opérationnelle");

    console.log("\nFichier de migration généré dans : supabase/migrations/20260822000000_init_growscan.sql");
  } catch (err) {
    console.error("Erreur lors de la vérification :", err);
  }
}

main();
