/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Firebase
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_DATABASE_URL: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID: string
  // EmailJS
  readonly VITE_EMAILJS_SERVICE_ID: string
  readonly VITE_EMAILJS_PUBLIC_KEY: string
  readonly VITE_EMAILJS_TEMPLATE_BOOKING_RECEIVED: string
  readonly VITE_EMAILJS_TEMPLATE_BOOKING_CONFIRMED: string
  // Google Services
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_ACCUWEATHER_API_KEY: string
  readonly VITE_GEMINI_API_KEY: string
}

declare global {
  interface Window {
    google?: {
      maps: typeof google.maps;
    };
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
