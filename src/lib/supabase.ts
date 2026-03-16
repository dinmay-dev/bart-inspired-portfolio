import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://pwbhrnxmhxtmjshwvccn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3YmhybnhtaHh0bWpzaHd2Y2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDMxMTgsImV4cCI6MjA4OTA3OTExOH0.4URujnB9opUR0VqWpCR85n1RZ4L4SN_8SqK2Q_ab7jg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
