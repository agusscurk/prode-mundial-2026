'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
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
                        <Link href="/login" style={{
                            padding: '12px 24px',
                            backgroundColor: '#9ca3af',
                            border: '3px solid #000',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '12px',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            color: '#000',
                            display: 'inline-block',
                            transition: 'all 0.1s',
                        }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = 'translate(2px, 2px)')}
                            onMouseOut={(e) => (e.currentTarget.style.transform = 'translate(0, 0)')}
                        >
                            INGRESAR
                        </Link>
                        <Link href="/register" style={{
                            padding: '12px 24px',
                            backgroundColor: '#9ca3af',
                            border: '3px solid #000',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '12px',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            color: '#000',
                            display: 'inline-block',
                            transition: 'all 0.1s',
                        }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = 'translate(2px, 2px)')}
                            onMouseOut={(e) => (e.currentTarget.style.transform = 'translate(0, 0)')}
                        >
                            REGISTRO
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/home" style={{
                            padding: '12px 24px',
                            backgroundColor: '#9ca3af',
                            border: '3px solid #000',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '12px',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            color: '#000',
                            display: 'inline-block',
                        }}>
                            MIS PREDICCIONES
                        </Link>
                        <Link href="/ranking" style={{
                            padding: '12px 24px',
                            backgroundColor: '#9ca3af',
                            border: '3px solid #000',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '12px',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            color: '#000',
                            display: 'inline-block',
                        }}>
                            RANKING
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}