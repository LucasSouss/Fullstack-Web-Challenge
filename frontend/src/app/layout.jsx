import "./globals.css";

export const metadata = {
  title: "Gerenciador de Projetos",
  description: "Sistema para gerenciar projetos e tarefas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}