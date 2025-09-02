import "./globals.css"; // 👈 IMPORTANTE: trae Tailwind y tus estilos

export const metadata = {
  title: "ValentinaVTT",
  description: "Landing oficial de ValentinaVTT",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* Kawaii soft blobs */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute -top-20 left-10 h-60 w-60 rounded-full bg-pink-300/40 blur-3xl" />
          <div className="absolute top-1/3 right-10 h-72 w-72 rounded-full bg-fuchsia-300/30 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-purple-300/30 blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  );
}
