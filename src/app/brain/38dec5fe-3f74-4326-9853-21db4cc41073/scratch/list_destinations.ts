
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bvvgstdcmbevdvbnkqru.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2dmdzdGRjbWJldmR2Ym5rcXJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjY4Nzk1MCwiZXhwIjoyMDg4MjYzOTUwfQ.8y5UeQQGhet4DE30NxV4k34z8deojBlDFsHFWU_qmd0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function listDestinations() {
  const { data, error } = await supabase
    .from('destinations')
    .select('name, title')
  
  if (error) {
    console.error(error)
  } else {
    console.log(JSON.stringify(data, null, 2))
  }
}

listDestinations()
