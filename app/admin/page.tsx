'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Match {
    id: string;
    match_number: number;
    home_team: string;
    away_team: string;
    actual_home_goals: number | null;
    actual_away_goals: number | null;
    status: string;
}

export default function AdminPage() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [results, setResults] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = async () => {
        try {
            const { data, error } = await supabase.from('matches').select('*').eq('phase', 'group').order('match_number', { ascending: true });
            if (error) throw error;
            setMatches(data || []);
            const initialResults: any = {};
            (data || []).forEach((m: any) => {
                initialResults[m.id] = { home: m.actual_home_goals || 0, away: m.actual_away_goals || 0 };
            });
            setResults(initialResults);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleResultChange = (matchId: string, team: string, value: string) => {
        setResults((prev: any) => ({ ...prev, [matchId]: { ...prev[matchId], [team]: parseInt(value) || 0 } }));
    };

    const saveResult = async (match: Match) => {
        setSaving(true);
        try {
            const res = results[match.id] || { home: 0, away: 0 };
            const { error } = await supabase.from('matches').update({ actual_home_goals: res.home, actual_away_goals: res.away, status: 'finished' }).eq('id', match.id);
            if (error) throw error;
            await calculatePoints(match.id, res.home, res.away);
            alert('Resultado guardado y puntos calculados!');
            loadMatches();
        } catch (err) {
            console.error('Error:', err);
            alert('Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const calculatePoints = async (matchId: string, homeGoals: number, awayGoals: number) => {
        try {
            const { data: predictions, error: predError } = await supabase.from('predictions').select('*').eq('match_id', matchId);
            if (predError) throw predError;

            for (const pred of predictions || []) {
                let points = 0;
                let isCorrect = false;
                let isExact = false;

                if (pred.predicted_home_goals === homeGoals && pred.predicted_away_goals === awayGoals) {
                    points = 3;
                    isCorrect = true;
                    isExact = true;
                } else if ((pred.predicted_home_goals > pred.predicted_away_goals && homeGoals > awayGoals) || (pred.predicted_home_goals < pred.predicted_away_goals && homeGoals < awayGoals) || (pred.predicted_home_goals === pred.predicted_away_goals && homeGoals === awayGoals)) {
                    points = 1;
                    isCorrect = true;
                }

                await supabase.from('predictions').update({ points_awarded: points, is_correct: isCorrect, is_exact_score: isExact }).eq('id', pred.id);

                const { data: userPreds } = await supabase.from('predictions').select('points_awarded').eq('user_id', pred.user_id);
                const totalPoints = (userPreds || []).reduce((sum: number, p: any) => sum + (p.points_awarded || 0), 0);
                await supabase.from('users').update({ total_points: totalPoints }).eq('id', pred.user_id);
            }
        } catch (err) {
            console.error('Error calculando puntos:', err);
        }
    };

    if (loading) {
        return <div style={{ backgroundColor: '#22c55e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Cargando...</p></div>;
    }

    return (
        <div style={{ backgroundColor: '#22c55e', minHeight: '100vh', padding: '20px' }}>
            <h1 style={{ fontSize: '20px', color: 'black', marginBottom: '30px' }}>ADMIN - CARGAR RESULTADOS</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                {matches.map((match) => (
                    <div key={match.id} style={{ backgroundColor: '#9ca3af', border: '3px solid black', padding: '15px', boxShadow: '5px 5px 0 rgba(0,0,0,0.3)' }}>
                        <div style={{ fontSize: '10px', marginBottom: '10px' }}>Partido {match.match_number}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '15px', fontSize: '14px' }}>
                            <div>{match.home_team}</div>
                            <div style={{ fontSize: '12px' }}>vs</div>
                            <div>{match.away_team}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input type="number" min="0" value={results[match.id]?.home || 0} onChange={(e) => handleResultChange(match.id, 'home', e.target.value)} style={{ flex: 1, padding: '8px', border: '2px solid black', textAlign: 'center', fontSize: '12px' }} />
                            <span>-</span>
                            <input type="number" min="0" value={results[match.id]?.away || 0} onChange={(e) => handleResultChange(match.id, 'away', e.target.value)} style={{ flex: 1, padding: '8px', border: '2px solid black', textAlign: 'center', fontSize: '12px' }} />
                        </div>
                        <button onClick={() => saveResult(match)} disabled={saving} style={{ width: '100%', padding: '10px', backgroundColor: '#22c55e', border: '3px solid black', fontSize: '11px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: saving ? 0.6 : 1 }}>
                            {saving ? 'GUARDANDO...' : 'GUARDAR RESULTADO'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}