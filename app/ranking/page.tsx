'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface UserRanking {
    id: string;
    name: string;
    total_points: number;
    rank: number;
}

export default function RankingPage() {
    const [users, setUsers] = useState<UserRanking[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        loadRanking();
    }, []);

    const loadRanking = async () => {
        try {
            const { data, error } = await supabase.from('users').select('id,name,total_points').order('total_points', { ascending: false });
            if (error) throw error;
            const ranked = (data || []).map((u, index) => ({ ...u, rank: index + 1 }));
            setUsers(ranked);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
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
                <h1 style={{ fontSize: '20px', color: 'black' }}>RANKING 2026</h1>
                <div style={{ textAlign: 'right' }}>
                    {user && <p style={{ fontSize: '12px', marginBottom: '5px' }}>Hola, {user.name}</p>}
                    <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ef4444', border: '2px solid black', fontSize: '10px', cursor: 'pointer', color: 'white' }}>SALIR</button>
                </div>
            </div>

            <h2 style={{ fontSize: '16px', marginBottom: '20px', color: 'black' }}>TABLA DE POSICIONES</h2>

            <div style={{ backgroundColor: '#9ca3af', border: '3px solid black', padding: '0', overflow: 'hidden', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 100px', gap: '0', borderBottom: '2px solid black', backgroundColor: '#2d3748', color: '#fbbf24', fontWeight: 'bold', fontSize: '12px' }}>
                    <div style={{ padding: '10px', borderRight: '2px solid black' }}>POS</div>
                    <div style={{ padding: '10px', borderRight: '2px solid black' }}>JUGADOR</div>
                    <div style={{ padding: '10px', textAlign: 'center' }}>PUNTOS</div>
                </div>

                {users.map((u, i) => (
                    <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 100px', gap: '0', borderBottom: i < users.length - 1 ? '2px solid black' : 'none', backgroundColor: i % 2 === 0 ? '#b0b8bf' : '#9ca3af' }}>
                        <div style={{ padding: '12px', borderRight: '2px solid black', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>{u.rank}</div>
                        <div style={{ padding: '12px', borderRight: '2px solid black', fontSize: '12px' }}>{u.name}</div>
                        <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>{u.total_points}</div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                {user && (
                    <Link href="/home" style={{ padding: '12px 24px', backgroundColor: '#9ca3af', border: '3px solid black', fontSize: '12px', cursor: 'pointer', textDecoration: 'none', color: 'black', display: 'inline-block', fontWeight: 'bold' }}>
                        VOLVER A PREDICCIONES
                    </Link>
                )}
            </div>
        </div>
    );
}