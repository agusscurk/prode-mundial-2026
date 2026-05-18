'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [document, setDocument] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Llamar función RPC para registrar
            const { data, error: rpcError } = await supabase
                .rpc('register_user', {
                    p_name: name,
                    p_document: document,
                    p_email: null,
                });

            if (rpcError) throw rpcError;
            if (!data?.success) {
                setError(data?.message || 'Error al registrarse');
                return;
            }

            setSuccess(true);

            // Guardar usuario en localStorage
            localStorage.setItem('user', JSON.stringify({
                id: data.user_id,
                name: name,
                document: document,
            }));

            // Redirigir a home después de 2 segundos
            setTimeout(() => {
                router.push('/home');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Error al registrarse');
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
                REGISTRARSE
            </h1>

            {success ? (
                <div style={{
                    backgroundColor: '#22c55e',
                    border: '3px solid #000',
                    padding: '30px',
                    maxWidth: '400px',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '12px',
                }}>
                    <p style={{ color: '#16a34a', marginBottom: '10px' }}>
                        ✅ ¡REGISTRO EXITOSO!
                    </p>
                    <p>Bienvenido, {name}!</p>
                    <p style={{ marginTop: '10px', fontSize: '10px' }}>
                        Redirigiendo a tu panel...
                    </p>
                </div>
            ) : (
                <form onSubmit={handleRegister} style={{
                    backgroundColor: '#9ca3af',
                    border: '3px solid #000',
                    padding: '30px',
                    maxWidth: '400px',
                    width: '100%',
                }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '12px' }}>
                            NOMBRE:
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre completo"
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

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '12px' }}>
                            DNI / CÉDULA:
                        </label>
                        <input
                            type="text"
                            value={document}
                            onChange={(e) => setDocument(e.target.value)}
                            placeholder="Tu DNI único"
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
                            backgroundColor: loading ? '#999' : '#22c55e',
                            color: '#000',
                            border: '3px solid #000',
                            fontFamily: "'Press Start 2P', cursive",
                            fontSize: '12px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: '15px',
                        }}
                    >
                        {loading ? 'REGISTRANDO...' : 'REGISTRARSE'}
                    </button>

                    <div style={{ textAlign: 'center', fontSize: '10px' }}>
                        <p style={{ marginBottom: '10px' }}>¿Ya tienes cuenta?</p>
                        <Link href="/login" style={{
                            color: '#000',
                            textDecoration: 'underline',
                        }}>
                            INICIA SESIÓN AQUÍ
                        </Link>
                    </div>
                </form>
            )}
        </main>
    );
}