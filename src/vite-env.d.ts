/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly APP_GITHUB_TOKEN?: string;
	readonly APP_GROQ_API_KEY?: string;
	readonly APP_GEMINI_API_KEY?: string;
	readonly APP_GEMINI_API_KEY_2?: string;
	readonly APP_GEMINI_API_KEY_3?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
