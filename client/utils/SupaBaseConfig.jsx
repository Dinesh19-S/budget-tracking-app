import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://xxajwaqvwtixcnmlxncn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4YWp3YXF2d3RpeGNubWx4bmNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjgyOTcsImV4cCI6MjA0ODYwNDI5N30.-VKBSKAR-S5GZfkLtjUcrEBKYexfjMZi0uaf6Tker1I"
);
