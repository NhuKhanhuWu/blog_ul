/** @format */
/// <reference types="vite/client" />

declare module "*.css";
declare module "*.scss";

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
