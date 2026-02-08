import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "levric | Premium Tech",
    description: "Experience the future of computing with our premium selection of laptops.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={clsx(inter.className, "min-h-screen flex flex-col")}>
                <Providers>
                    <div className="flex-grow">
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    );
}
