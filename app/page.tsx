'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user);
            setLoading(false);
        };
        checkUser();
    }, []);

    return (
        <main style={{
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: '#22c55e',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#000', fontFamily: "'Press Start 2P', cursive" }}>
                ⚽ PRODE MUNDIAL 2026 ⚽
            </h1>

            <p style={{ fontSize: '14px', marginBottom: '30px', maxWidth: '400px', fontFamily: "'Press Start 2P', cursive" }}>
                Predice los resultados del Mundial, acumula puntos y compite contra tu familia
            </p>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {!user ? (
                    <>
                        <Link href="/login" className="pixel-button">
                            INGRESAR
                        </Link>
                        <button className="pixel-button" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                            REGISTRO
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/home" className="pixel-button">
                            MIS PREDICCIONES
                        </Link>
                        <Link href="/ranking" className="pixel-button">
                            RANKING
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}