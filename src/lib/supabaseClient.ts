import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bawanuusktkjmlniedlu.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhd2FudXVza3Rram1sbmllZGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODg3MTUsImV4cCI6MjA2NjE2NDcxNX0.ERK2N1GqeKfrCd2n5coqiYEGMFnfx_IXZGKz0Kpm_Bg"

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 