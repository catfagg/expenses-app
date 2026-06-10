import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import Navigation from "@/components/navigation";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Система учёта расходов",
};

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${montserrat.className} bg-[#f3f4f6] relative`}>
        <Navigation />
        <svg
          className="pointer-events-none fixed inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <g className="bg-float1">
            <circle cx="95%" cy="-5%" r="22%" fill="#4f46e5" opacity="0.1" />
            <circle cx="95%" cy="-5%" r="14%" fill="#4f46e5" opacity="0.2" />
            <circle cx="95%" cy="-5%" r="7%" fill="#4f46e5" opacity="0.3" />
          </g>

          <g className="bg-float2">
            <circle cx="2%" cy="104%" r="24%" fill="#059669" opacity="0.1" />
            <circle cx="2%" cy="104%" r="16%" fill="#059669" opacity="0.2" />
            <circle cx="2%" cy="104%" r="8%" fill="#059669" opacity="0.3" />
          </g>

          <circle className="bg-float3" cx="50%" cy="50%" r="28%" fill="#6366f1" opacity="0.1" />

          <polygon
            className="bg-spin1"
            points="84,0 168,43 168,129 84,172 0,129 0,43"
            fill="#d97706"
            opacity="0.08"
            transform="translate(-60 30) scale(0.75) rotate(-10 84 86)"
          />
          <polygon
            className="bg-spin2"
            points="84,0 168,43 168,129 84,172 0,129 0,43"
            fill="#d97706"
            opacity="0.06"
            transform="translate(-30 60) scale(0.5) rotate(-10 84 86)"
          />

          <g className="bg-drift1">
            <polygon points="50%,1% 58%,14% 42%,14%" fill="#7c3aed" opacity="0.1" />
            <polygon points="50%,4% 56%,13% 44%,13%" fill="#7c3aed" opacity="0.2" />
          </g>

          <g className="bg-drift2">
            <polygon points="78%,18% 86%,5% 94%,18%" fill="#4f46e5" opacity="0.08" />
            <polygon points="8%,88% 2%,75% 14%,75%" fill="#059669" opacity="0.1" />
          </g>

          <circle className="bg-pulse1" cx="30%" cy="12%" r="1.8%" fill="#4f46e5" opacity="0.15" />
          <circle className="bg-pulse2" cx="70%" cy="85%" r="1.6%" fill="#059669" opacity="0.18" />
          <circle className="bg-pulse3" cx="67%" cy="5%" r="1.1%" fill="#e11d48" opacity="0.2" />
          <circle className="bg-pulse1" cx="15%" cy="78%" r="1.3%" fill="#d97706" opacity="0.18" />
          <circle className="bg-pulse2" cx="86%" cy="42%" r="0.9%" fill="#7c3aed" opacity="0.2" />
        </svg>
        <main className="mx-auto min-h-screen max-w-6xl flex justify-center items-center relative">
          {children}
        </main>
      </body>
    </html>
  );
}
