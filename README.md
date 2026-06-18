# GreenInvest – Plateforme d'investissement en énergies renouvelables

GreenInvest est une plateforme numérique permettant aux particuliers, entreprises et investisseurs de financer des projets d'énergies renouvelables tout en suivant leurs investissements de manière transparente et sécurisée.

## Architecture

```
├── backend/          # API NestJS + PostgreSQL
├── frontend/
│   ├── web/          # Application React (Vite + TypeScript + Tailwind CSS)
│   └── mobile/       # Application Flutter (Android & iOS)
└── docker-compose.yml
```

## Technologies

| Couche | Technologie |
|--------|-------------|
| Backend | NestJS 10, TypeORM, PostgreSQL |
| Web | React 18, Vite, Redux Toolkit, Tailwind CSS |
| Mobile | Flutter 3, Riverpod, Go Router |
| Auth | JWT, Passport, Google OAuth, 2FA (TOTP) |
| Paiements | Stripe, Orange Money, MTN Mobile Money |

## Modules implémentés

- **Authentification** – Inscription, connexion, Google OAuth, 2FA, vérification email
- **KYC** – Téléchargement de documents, vérification identité, validation admin
- **Catalogue de projets** – Solaire, éolien, hydraulique, biomasse ; filtres avancés
- **Investissement** – Investir, diversifier, investissements récurrents
- **Portefeuille** – Capital investi, revenus, graphiques de répartition
- **Paiements** – Dépôt/retrait via carte, virement, Orange Money, MTN
- **Distribution des revenus** – Calcul et versement automatique
- **Notifications** – Temps réel pour investissements, paiements, projets
- **Dashboard Promoteur** – Soumission, gestion, publication de mises à jour
- **Dashboard Administrateur** – Validation KYC/projets, gestion retraits, statistiques

## Démarrage rapide

### Avec Docker

```bash
docker-compose up -d
```

L'API sera disponible sur `http://localhost:3000/api/v1`  
La documentation Swagger : `http://localhost:3000/api/docs`  
L'application web : `http://localhost:5173`

### Sans Docker

**Backend :**
```bash
cd backend
cp .env.example .env   # Configurer les variables
npm install
npm run start:dev
```

**Frontend Web :**
```bash
cd frontend/web
npm install
npm run dev
```

**Mobile (Flutter) :**
```bash
cd frontend/mobile
flutter pub get
flutter run
```

## Variables d'environnement

Copier `backend/.env.example` en `backend/.env` et configurer :
- Connexion PostgreSQL
- Clés JWT
- Identifiants Google OAuth
- SMTP pour les emails
- Twilio pour les SMS
- Stripe pour les paiements

## Feuille de route

### Version 1 (MVP) ✅
- Authentification complète
- KYC avec validation admin
- Catalogue des projets
- Investissement
- Paiements
- Dashboard admin et promoteur

### Version 2
- Rendements automatiques planifiés
- Notifications push Firebase
- Rapports PDF téléchargeables
- Actualités des projets enrichies

### Version 3
- IA pour évaluation des risques et recommandations
- Investissements récurrents programmés
- Multi-devises
- API partenaires

## Conformité et sécurité

- Chiffrement des données (HTTPS, bcrypt)
- Authentification à deux facteurs (TOTP)
- KYC/AML conformes aux réglementations
- Protection RGPD
- Gestion des rôles (USER, PROMOTER, ADMIN)
- Journalisation des actions sensibles
- Rate limiting via Throttler
