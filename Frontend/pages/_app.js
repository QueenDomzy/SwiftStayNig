import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import SwiftBot from "@/components/SwiftBot";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <SwiftBot />
    </AuthProvider>
  );
}
