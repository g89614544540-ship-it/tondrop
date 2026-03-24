import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://idpzpzxjwtlzljcsqkil.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkcHpwenhqd3RsemxqY3Nxa2lsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI4Nzk4MSwiZXhwIjoyMDg5ODYzOTgxfQ.SqCzBod47lKZPvadzUBhYQ5SF_Ywd8ouIpzvGwINx4c'
);

export default supabase;