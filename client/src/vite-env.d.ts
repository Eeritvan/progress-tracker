/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USERS_SVC: string
  readonly VITE_DATA_SVC: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
