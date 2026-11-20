import "./globals.css";
export const metadata = { title: "SkyHost — Hosting Simpel & Andal", description: "Solusi web hosting dari SkyHost" };
export default function RootLayout({ children }) {
  return <html lang="id"><body>{children}</body></html>;
}