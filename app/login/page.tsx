'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const [document, setDocument] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Llamar función RPC para login
            const { data, error: rpcError } = await supabase
                .rpc('login_user', { p_document: document });

            if (rpcError) throw rpcError;
            if (!data?.success) {
                setError(data?.message || 'Error al iniciar sesión');
                return;
            }

            // Guardar usuario en localStorage
            localStorage.setItem('user', JSON.stringify({
                id: data.user_id,
                name: data.name,
                document: data.document,
            }));

            // Redirigir a home
            router.push('/home');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            padding: '40px 20px',
            backgroundColor: '#22c55e',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Press Start 2P', cursive",
        }}>
            <h1 style={{ fontSize: '24px', marginBottom: '30px', color: '#000' }}>
                INGRESAR
            </h1>

            <form onSubmit={handleLogin} style={{
                backgroundColor: '#9ca3af',
                border: '3px solid #000',
                padding: '30px',
                maxWidth: '400px',
                width: '100%',
            }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '12px' }}>
                        DNI / CÉDULA:
                    </label>
                    <input
                        type="text"
                        value={document}
                        onChange={(e) => setDocument(e.target.value)}
                        placeholder="Ingresa tu DNI"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '2px solid #000',
                            fontSize: '12px',
                            fontFamily: "'Press Start 2P', cursive",
                            boxSizing: 'border-box',
                        }}
                        required
                    />
                </div>

                {error && (
                    <div style={{
                        color: '#ef4444',
                        marginBottom: '15px',
                        fontSize: '10px',
                        border: '2px solid #ef4444',
                        padding: '10px',
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: loading ? '#999' : '#0ea5e9',
                        color: '#fff',
                        border: '3px solid #000',
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '12px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginBottom: '15px',
                    }}
                >
                    {loading ? 'CARGANDO...' : 'INGRESAR'}
                </button>

                <div style={{ textAlign: 'center', fontSize: '10px' }}>
                    <p style={{ marginBottom: '10px' }}>¿No tienes cuenta?</p>
                    <Link href="/register" style={{
                        color: '#000',
                        textDecoration: 'underline',
                    }}>
                        REGISTRARSE AQUÍ
                    </Link>
                </div>
            </form>
        </main>
    );
}