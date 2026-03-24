import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fkdnuaiiqmgbhkpstucq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZG51YWlpcW1nYmhrcHN0dWNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjczNjIzOCwiZXhwIjoyMDU4MzEyMjM4fQ.j6n77CZGBKO3wPwMBBWqYkQEMcMH3DnStk3YLmyRY1Q'
);

export default supabase;