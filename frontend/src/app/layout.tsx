import localFont from "next/font/local";
import "./globals.css";
import SessionProvider from "@/providers/session-provider";
import SnackbarComponent from "@/components/snackbarComponent/snackbarComponent";

const internItelic = localFont({
  src: "./fonts/intern/Inter-Italic-VariableFont_opsz,wght.ttf",
  variable: "--font-inter-itelic",
  weight: "100 900",
  preload: false,
});
const internFont = localFont({
  src: "./fonts/intern/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-inter-regular",
  weight: "100 900",
  preload: false,
});
const ibnsansBold = localFont({
  src: "./fonts/ibnsans/IBMPlexSans-Bold.ttf",
  variable: "--font-ibnsansBold",
  weight: "100 900",
  preload: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body
        className={`${internItelic.variable} ${internFont.variable} ${ibnsansBold.variable}`}
      >
        <SessionProvider>{children}</SessionProvider>
        <SnackbarComponent />
      </body>
    </html>
  );
}
