import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xslfediakvgfugphdpzk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbGZlZGlha3ZnZnVncGhkcHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5MDQ5ODEsImV4cCI6MjA0MDQ4MDk4MX0.9ctt8sQ1IZwGgIhF4yqSYj78-DFnIGXect0LQcv2pPU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)