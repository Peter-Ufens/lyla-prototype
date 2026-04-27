# ADR 0001 - Choix MVP minimal pour le prototype

## Contexte

Le projet initial `ai-studio-prototype-v1` (passe en prive le 2026-04-27) contenait une architecture MCP complete (drivers, fusion kernel, memory engine, security engine, multimodal pipeline) en plus du chat de base.

Pour la refonte en `lyla-prototype`, deux options ont ete considerees :

- alpha : MVP minimal (Express + Vite + Gemini + SSE, ~15 fichiers, 1-2h de travail).
- beta : refonte large preservant l'architecture MCP (~24-40h de travail).

## Decision

Option alpha retenue.

## Consequences

- Repo lisible d'un coup d'oeil par un lecteur (recruteur, candidat collaborateur, futur soi).
- Surface d'erreur reduite, facile a maintenir.
- Architecture MCP non incluse ici. Elle reste dans le projet personnel `Companion-OS` (prive), qui sert de terrain de jeu pour les briques avancees.
- Si un besoin de demonstration MCP apparait, il fera l'objet d'un projet dedie (par exemple `lyla-mcp-demo`), pas d'un sur-developpement de ce prototype.
