# Flow Suite

**Flow Suite** is een React 19 + TypeScript webapplicatie die de workflow- en routingconfiguratie van de [OpenClaw MC API](https://api.chefgroep.nl) visualiseert als een interactief node/edge diagram.

---

## Wat doet het?

- Haalt routing data op via de MC API (`/api/routing`)
- Toont topics als nodes en flows als gerichte edges in een interactief canvas
- Luistert via **Server-Sent Events** (SSE) naar live routing-updates
- Klikken op een node opent een detailpanel met flow-informatie
- Toolbar met statistieken, refresh en zoom-fit
- Authenticatie via API key (opgeslagen in `localStorage`)

---

## Vereisten

- Node.js >= 18
- npm >= 9
- Toegang tot de OpenClaw MC API

---

## Installatie

```bash
git clone git@github.com:WantedChef/flow-suite.git
cd flow-suite
npm install
```

### Environment variabelen

Maak een `.env.local` aan in de root:

```env
VITE_API_URL=https://api.chefgroep.nl/api/routing
VITE_SSE_URL=https://api.chefgroep.nl/api/routing/subscribe
```

---

## Ontwikkeling

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in je browser.

---

## Productie build

```bash
npm run build
```

De output staat in de `dist/` map. Deze kan worden geserveerd door elke statische webserver (nginx, Caddy, etc.).

### Voorbeeld nginx configuratie

```nginx
server {
    listen 80;
    server_name flow.chefgroep.nl;
    root /var/www/flow-suite/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Projectstructuur

```
src/
├── components/
│   ├── FlowCanvas.tsx      # ReactFlow canvas wrapper
│   ├── FlowHeader.tsx      # Header met acties en statistieken
│   ├── LoginScreen.tsx     # Login scherm met API key invoer
│   ├── NodeDetailPanel.tsx # Zijpaneel met topic/flow details
│   └── TopicNode.tsx       # Custom node component
├── hooks/
│   └── useFlowData.ts      # Data fetching + SSE logica
├── types/
│   └── api.ts              # TypeScript types voor MC API responses
├── App.tsx                 # Hoofd orchestratie component
├── main.tsx                # React entry point
└── index.css               # Tailwind CSS import
```

---

## Tech stack

| Package | Versie | Doel |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 7 | Build tool |
| @xyflow/react | 12 | Flow/node diagram engine |
| Tailwind CSS | 4 | Utility-first styling |

---

## Licentie

Intern project — WantedChef / OpenClaw. Niet publiek beschikbaar.
