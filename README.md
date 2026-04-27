# lyla-prototype

Prototype IA local-first - assistante francophone Lyla.

## Statut

proof-of-concept. Code minimal pour valider une integration Gemini + LangChain + Server-Sent Events. Pas destine a la production.

## Public vise

Profils techniques (lecture de code).

## Pre-requis

- Node.js 20 ou plus.
- Cle API Google Gemini (https://aistudio.google.com/apikey).

## Installation

```bash
npm install
cp .env.example .env
# editer .env et y mettre la vraie GEMINI_API_KEY
npm run dev
```

Application disponible sur http://localhost:3000.

## Usage

1. Ouvrir http://localhost:3000.
2. Saisir un message dans le chat.
3. La reponse s'affiche en streaming via SSE.

## Architecture

- Backend : Express + tsx (TypeScript). Endpoint `/api/chat` en Server-Sent Events.
- Frontend : React 19 + Vite + TypeScript.
- LLM : Google Gemini via `@langchain/google-genai`.
- Persona : assistante francophone Lyla, factuelle et sobre (cf `src/persona.ts`).

## Securite et limites assumees

Ce projet est un prototype, pas un produit. Limites volontaires :

- Pas d'authentification sur les endpoints.
- Pas de rate-limiting.
- Pas de validation stricte des inputs.
- Pas de persistance (memoire conversation perdue au redemarrage).
- Bind localhost uniquement (127.0.0.1), ne pas exposer sur Internet.
- Une seule conversation simultanee.

Pour une version durcie, voir le projet prive Companion-OS.

## Licence

MIT (voir `LICENSE`).
