/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANALYTICS_ENABLED?: string;
  readonly VITE_ANALYTICS_REPLAY_SAMPLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
