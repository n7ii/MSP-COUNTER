// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_BASE_URL: string;
    VITE_SETTING_BASE_URL: string;
    VITE_SETTING_WS_URL?: string;
    // Add other environment variables here if needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
