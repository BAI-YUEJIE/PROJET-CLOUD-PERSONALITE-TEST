# Test de Personnalité — Projet Cloud

Application serverless de test de personnalité basée sur les formes géométriques.

## Architecture

```
Frontend (React/Vite)
    ↓ HTTP via proxy Vite
API Gateway (LocalStack)
    ↓
Lambda scoring   →  DynamoDB + SQS
Lambda get-result ← DynamoDB
Lambda get-report ← S3
SQS → Lambda report → S3 + DynamoDB
```

- **Frontend** : React + Vite (port 5173)
- **Backend** : 4 fonctions AWS Lambda (Node.js 18, ES modules)
- **Base de données** : DynamoDB
- **Stockage rapports** : S3
- **File de messages** : SQS
- **API** : API Gateway v1 (REST)
- **Infrastructure locale** : LocalStack + OpenTofu

---

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) (requis pour LocalStack et les Lambdas)
- [LocalStack CLI](https://docs.localstack.cloud/getting-started/installation/) ou Docker directement
- [OpenTofu](https://opentofu.org/docs/intro/install/) (`brew install opentofu` sur Mac)
- [Node.js 18+](https://nodejs.org/)
- AWS CLI configuré avec les credentials LocalStack :

```bash
aws configure
# AWS Access Key ID: test
# AWS Secret Access Key: test
# Default region: us-east-1
# Default output format: json
```

---

## Déploiement local (LocalStack)

### 1. Démarrer LocalStack

```bash
docker run -d \
  --name localstack \
  -p 4566:4566 \
  -e SERVICES=s3,dynamodb,sqs,lambda,iam,apigateway,logs \
  -v /var/run/docker.sock:/var/run/docker.sock \
  localstack/localstack
```

> **Important** : le montage `-v /var/run/docker.sock:/var/run/docker.sock` est nécessaire pour que LocalStack puisse exécuter les Lambdas.

### 2. Déployer l'infrastructure

```bash
cd infra
tofu init
tofu apply
```

À la fin, noter la valeur de `api_endpoint`, par exemple :
```
api_endpoint = "http://localhost:4566/restapis/zjpkrvb2tl/dev/_user_request_"
```

### 3. Configurer le frontend

Dans le dossier `frontend/`, créer un fichier `.env` à partir du template :

```bash
cp frontend/.env.template frontend/.env
```

Éditer `frontend/.env` en remplaçant l'URL, **mais en utilisant le port 5173** (proxy Vite) :

```
VITE_API_URL=http://localhost:5173/restapis/REMPLACER_PAR_L_ID/dev/_user_request_
```

> L'ID est la partie entre `/restapis/` et `/dev/` dans l'output tofu.
> Le proxy Vite (`vite.config.js`) redirige automatiquement `/restapis/*` vers `http://localhost:4566`.

### 4. Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173).

---

## Vérification

Une fois le test complété, vérifier que les données sont bien enregistrées :

```bash
aws --endpoint-url=http://localhost:4566 dynamodb scan \
  --table-name projet-cloud-personnalite-test-results \
  --region us-east-1
```

---

## Structure du projet

```
.
├── frontend/           # Application React + Vite
│   ├── src/
│   │   ├── pages/      # Accueil, TestPage, Resultat
│   │   ├── components/ # Composants UI
│   │   ├── data/       # Questions et types géométriques
│   │   └── utils/      # Calcul scores (côté client, fallback)
│   ├── .env.template   # Modèle de configuration
│   └── vite.config.js  # Config + proxy CORS LocalStack
├── lambdas/
│   ├── scoring/        # POST /submit — calcule et sauvegarde les scores
│   ├── get-result/     # GET /result/{id} — récupère un résultat
│   ├── report/         # Déclenché par SQS — génère le rapport JSON dans S3
│   └── get-report/     # GET /report/{id} — retourne le rapport depuis S3
└── infra/
    ├── main.tf         # Ressources AWS (Lambda, API GW, DynamoDB, S3, SQS)
    ├── variables.tf    # Variables (région, nom projet, runtime)
    └── outputs.tf      # URL de l'API à copier dans .env
```

---

## Arrêter l'environnement

```bash
# Détruire les ressources LocalStack
cd infra && tofu destroy

# Arrêter LocalStack
docker stop localstack && docker rm localstack
```
