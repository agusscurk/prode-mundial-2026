import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "🏆 PRODE Mundial 2026",
    description: "Predice los partidos del Mundial y compite en familia",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
            </head>
            <body style={{ backgroundColor: "#22c55e" }}>
                <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                    {children}
                </div>
            </body>
        </html>
    );
}