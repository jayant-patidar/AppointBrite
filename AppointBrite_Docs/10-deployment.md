# Document 10 — Deployment Strategy (v1.0)
**Project Name:** AppointBrite

## 1. Environments

We maintain three primary environments:
- **Development (Local):** Run via Docker Compose (`docker-compose.dev.yml`). Connects to a local MongoDB instance.
- **Staging:** Hosted on AWS. Mirrors production architecture exactly but uses scaled-down resources. Connected to test Stripe and Twilio accounts.
- **Production:** Live environment. Strictly controlled access.

## 2. CI/CD Pipeline (GitHub Actions)

### Continuous Integration (On Push/PR)
1. **Lint & Format Check:** Runs ESLint and Prettier.
2. **Type Check:** Runs `tsc --noEmit`.
3. **Unit & Integration Tests:** Runs Jest suites for frontend and backend.
4. **Build:** Compiles React (Vite) and Node.js (TypeScript) to verify build succeeds.

### Continuous Deployment (On Merge to `main`)
1. **Dockerize:** Builds production Docker images for the Backend API and Redis worker.
2. **ECR Push:** Pushes images to AWS Elastic Container Registry (ECR).
3. **ECS Deploy:** Triggers a rolling update in AWS Elastic Container Service (ECS - Fargate) to deploy the new backend containers without downtime.
4. **S3/CloudFront Sync:** Builds the React frontend and syncs the static files to an AWS S3 bucket, invalidating the CloudFront CDN cache.

## 3. Database Management
- **Hosting:** MongoDB Atlas (Dedicated Cluster).
- **Backups:** Automated daily snapshots with point-in-time recovery enabled.
- **Migrations:** Managed via a custom script (`npm run db:migrate`) that runs as part of the CD pipeline before the ECS containers restart.

## 4. Monitoring & Alerting
- **Uptime Monitoring:** Pingdom or Datadog checking the `/api/v1/health` endpoint every 1 minute.
- **Error Tracking:** Sentry integrated into both React and Node.js to catch unhandled exceptions.
- **Logging:** AWS CloudWatch for backend container logs.
- **Alerts:** Critical alerts (e.g., 500 Server Errors spike, Database CPU > 80%) trigger automated Slack messages to the engineering team.

## 5. Disaster Recovery
- In the event of an AWS region failure (e.g., `us-east-1` goes down), Infrastructure as Code (Terraform) is used to rapidly spin up the application in a secondary region (`us-west-2`), utilizing MongoDB Atlas's cross-region replication.
