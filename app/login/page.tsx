'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const [document, setDocument] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!document) {
            setError('Ingresa tu DNI/Cédula');
            return;
        }

        setLoading(true);
        try {
            const { data, error: loginError } = await supabase.rpc('login_user', { p_document: document });
            if (loginError || !data) {
                setError('DNI no encontrado. Regístrate primero.');
                setLoading(false);
                return;
            }

            localStorage.setItem('user', JSON.stringify(data));
            router.push('/home');
        } catch (err) {
            console.error('Error:', err);
            setError('Error al iniciar sesión');
            setLoading(false);
        }
    };

    const handleAdminClick = () => {
        router.push('/admin');
    };

    return (
        <div style={{ backgroundColor: '#22c55e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#9ca3af', border: '3px solid black', padding: '30px', maxWidth: '400px', width: '100%', boxShadow: '5px 5px 0 rgba(0,0,0,0.3)' }}>
                <h1 style={{ fontSize: '20px', color: 'black', marginBottom: '30px', textAlign: 'center' }}>PRODE 2026</h1>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>DNI / CEDULA:</label>
                        <input
                            type="text"
                            value={document}
                            onChange={(e) => setDocument(e.target.value)}
                            style={{ width: '100%', padding: '10px', border: '2px solid black', fontSize: '14px', boxSizing: 'border-box' }}
                            placeholder="Ingresa tu DNI"
                        />
                    </div>

                    {error && <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>{error}</div>}

                    <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: '#22c55e', border: '3px solid black', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: loading ? 0.6 : 1 }}>
                        {loading ? 'INGRESANDO...' : 'INGRESAR'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '2px solid black', paddingTop: '20px' }}>
                    <button onClick={handleAdminClick} style={{ padding: '10px 20px', backgroundColor: '#2d3748', color: '#fbbf24', border: '3px solid black', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ADMIN
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <p style={{ fontSize: '12px', marginBottom: '10px' }}>¿No tienes cuenta?</p>
                    <Link href="/register" style={{ padding: '10px 20px', backgroundColor: '#9ca3af', border: '3px solid black', fontSize: '12px', cursor: 'pointer', color: 'black', textDecoration: 'none', display: 'inline-block', fontWeight: 'bold' }}>
                        REGISTRARSE
                    </Link>
                </div>

                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <Link href="/" style={{ fontSize: '12px', color: 'black', textDecoration: 'none', textDecorationLine: 'underline' }}>Volver a inicio</Link>
                </div>
            </div>
        </div>
    );
}