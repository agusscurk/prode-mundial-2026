import { createClient } from '@supabase/supabase-js';

const supabaseUrl = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : '';
const supabaseAnonKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : '';

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export type User = {
    id: string;
    email: string;
    name: string;
    document: string;
    champion_prediction: string;
    total_points: number;
    created_at: string;
};

export type Match = {
    id: string;
    match_number: number;
    home_team: string;
    away_team: string;
    home_flag: string;
    away_flag: string;
    scheduled_time: string;
    status: 'pending' | 'locked' | 'finished';
    actual_home_goals?: number;
    actual_away_goals?: number;
    phase: 'group' | 'round16' | 'quarterfinal' | 'semifinal' | 'final';
    group?: string;
};

export type Prediction = {
    id: string;
    user_id: string;
    match_id: string;
    predicted_home_goals: number;
    predicted_away_goals: number;
    points_awarded: number;
    created_at: string;
    updated_at: string;
};