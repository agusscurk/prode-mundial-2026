'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface User {
    id: string;
    name: string;
    document: string;
}

interface Match {
    id: string;
    match_number: number;
    home_team: string;
    away_team: string;
    scheduled_time: string;
    status: string;
}

export default function HomePage() {
    const [user, setUser] = useState<User | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [predictions, setPredictions] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        const userData = JSON.parse(storedUser);
        setUser(userData);
        loadMatches();
    }, [router]);

    const loadMatches = async () => {
        try {
            const { data, error } = await supabase.from('matches').select('*').eq('phase', 'group').order('scheduled_time', { ascending: true });
            if (error) throw error;
            setMatches(data || []);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const isMatchLocked = (scheduledTime: string) => {
        const matchTime = new Date(scheduledTime).getTime();
        const oneHourBefore = matchTime - 60 * 60 * 1000;
        const now = new Date().getTime();
        return now >= oneHourBefore;
    };

    const handleChange = (matchId: string, team: string, value: string) => {
        setPredictions((prev: any) => ({ ...prev, [matchId]: { ...prev[matchId], [team]: parseInt(value) || 0 } }));
    };

    const savePrediction = async (match: Match) => {
        if (!user) return;
        if (isMatchLocked(match.scheduled_time)) {
            alert('No puedes modificar tu predicción 1 hora antes del partido');
            return;
        }
        setSaving(true);
        try {
            const pred = predictions[match.id] || { home: 0, away: 0 };
            const { error } = await supabase.from('predictions').upsert({ user_id: user.id, match_id: match.id, predicted_home_goals: pred.home, predicted_away_goals: pred.away, points_awarded: 0 }, { onConflict: 'user_id,match_id' });
            if (error) throw error;
            alert('Prediccion guardada!');
        } catch (err) {
            console.error('Error:', err);
            alert('Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/');
    };

    if (loading) {
        return <div style={{ backgroundColor: '#22c55e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Cargando...</p></div>;
    }

    return (
        <div style={{ backgroundColor: '#22c55e', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '3px solid black', paddingBottom: '15px' }}>
                <h1 style={{ fontSize: '20px', color: 'black' }}>PRODE 2026</h1>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', marginBottom: '5px' }}>Hola, {user?.name}</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link href="/ranking" style={{ padding: '8px 16px', backgroundColor: '#9ca3af', border: '2px solid black', fontSize: '10px', cursor: 'pointer', color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>RANKING</Link>
                        <Link href="/admin" style={{ padding: '8px 16px', backgroundColor: '#9ca3af', border: '2px solid black', fontSize: '10px', cursor: 'pointer', color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>ADMIN</Link>
                        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ef4444', border: '2px solid black', fontSize: '10px', cursor: 'pointer', color: 'white' }}>SALIR</button>
                    </div>
                </div>
            </div>

            <h2 style={{ fontSize: '16px', marginBottom: '20px', color: 'black' }}>FASE DE GRUPOS</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                {matches.map((match) => {
                    const locked = isMatchLocked(match.scheduled_time);
                    return (
                        <div key={match.id} style={{ backgroundColor: locked ? '#ccc' : '#9ca3af', border: '3px solid black', padding: '15px', boxShadow: '5px 5px 0 rgba(0,0,0,0.3)', opacity: locked ? 0.6 : 1 }}>
                            <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '10px', color: '#666' }}>Partido {match.match_number}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '15px', fontSize: '14px' }}>
                                <div style={{ textAlign: 'center' }}><p>{match.home_team}</p></div>
                                <div style={{ fontSize: '12px', color: '#666' }}>vs</div>
                                <div style={{ textAlign: 'center' }}><p>{match.away_team}</p></div>
                            </div>
                            <div style={{ backgroundColor: '#2d3748', border: '2px solid black', padding: '10px', marginBottom: '15px', textAlign: 'center', color: '#fbbf24', fontSize: '12px' }}>
                                {new Date(match.scheduled_time).toLocaleString('es-AR')}
                            </div>
                            {locked && <div style={{ backgroundColor: '#ff6b6b', color: 'white', padding: '8px', marginBottom: '10px', fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>PARTIDO CERRADO</div>}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input type="number" min="0" placeholder="0" disabled={locked} value={predictions[match.id]?.home || ''} onChange={(e) => handleChange(match.id, 'home', e.target.value)} style={{ flex: 1, padding: '8px', border: '2px solid black', textAlign: 'center', fontSize: '12px', opacity: locked ? 0.5 : 1 }} />
                                <span style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>-</span>
                                <input type="number" min="0" placeholder="0" disabled={locked} value={predictions[match.id]?.away || ''} onChange={(e) => handleChange(match.id, 'away', e.target.value)} style={{ flex: 1, padding: '8px', border: '2px solid black', textAlign: 'center', fontSize: '12px', opacity: locked ? 0.5 : 1 }} />
                            </div>
                            <button onClick={() => savePrediction(match)} disabled={saving || locked} style={{ width: '100%', padding: '10px', backgroundColor: locked ? '#ccc' : '#22c55e', border: '3px solid black', fontSize: '11px', cursor: locked ? 'not-allowed' : saving ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: saving || locked ? 0.6 : 1 }}>
                                {locked ? 'PARTIDO CERRADO' : saving ? 'GUARDANDO...' : 'GUARDAR'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}