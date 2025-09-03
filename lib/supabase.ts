import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cgtlqpqvanuqnpbpdqev.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNndGxxcHF2YW51cW5wYnBkcWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTgyODAsImV4cCI6MjA3MjQ5NDI4MH0.asYPcE4JlIYKnocNn4exXS2HAGuawQoeBxspTYnIr_U'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
