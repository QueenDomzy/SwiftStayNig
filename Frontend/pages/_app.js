import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import SwiftBot from "../components/SwiftBot";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      {/* Main page content */}
      <Component {...pageProps} />

      {/* Global bot component */}
      <SwiftBot />
    </AuthProvider>
  );
}

export default MyApp;

