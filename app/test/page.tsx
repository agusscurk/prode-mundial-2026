'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const test = async () => {
            try {
                console.log('Iniciando test...');
                console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/matches?select=*&limit=5`,
                    {
                        headers: {
                            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const data = await response.json();
                console.log('Response:', data);
                setResult({ status: response.status, data });
            } catch (err) {
                console.error('Error:', err);
                setResult({ error: String(err) });
            } finally {
                setLoading(false);
            }
        };

        test();
    }, []);

    return (
        <div style={{ padding: '20px', backgroundColor: '#22c55e', minHeight: '100vh' }}>
            <h1>Test de Supabase</h1>
            {loading ? <p>Cargando...</p> : <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
    );
}