# Test de Personnalité - Projet Cloud

## Description
Application serverless de test de personnalité utilisant AWS (Lambda, DynamoDB, S3, SQS, API Gateway).

## Architecture
- **Frontend**: Site statique hébergé sur S3
- **Backend**: AWS Lambda (Python 3.11)
- **Database**: DynamoDB
- **Storage**: S3 (rapports)
- **Queue**: SQS (traitement asynchrone)
- **API**: API Gateway

## Les 4 dimensions
- **SOLEIL**: Extraversion, énergie sociale
- **LUNE**: Introversion, réflexion
- **INTUITIF**: Flexibilité, spontanéité
- **MÉTHODIQUE**: Logique, planification

## Structure du projet