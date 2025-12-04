import { createClient } from '@supabase/supabase-js';

// ⚠️ IMPORTANT : REMPLACEZ CES VALEURS PAR CELLES DE VOTRE PROJET SUPABASE
// Allez dans votre Dashboard Supabase -> Settings -> API
// L'URL doit être valide (commençant par https://) pour éviter le crash de l'application.
const supabaseUrl = 'https://ktsyqxkihiexfbksnpyl.supabase.co';
const supabaseAnonKey = 'sb_publishable_B0fX1XUuLxu0JnpznejCLA_QcdT_a0B';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);