# AWS Deployment Guide for Thmanyah Project

This guide provides multiple deployment options for your full-stack application on AWS.

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **AWS CLI**: Install and configure AWS CLI
3. **Docker**: Install Docker for containerized deployments
4. **Node.js**: Version 18 or higher

## Option 1: AWS Elastic Beanstalk (Recommended for beginners)

### Step 1: Set up AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and default region
```

### Step 2: Deploy Backend
```bash
cd backend
# Install EB CLI if not already installed
pip install awsebcli

# Initialize EB application
eb init thmanyah-backend --platform node.js --region us-east-1

# Create environment
eb create thmanyah-backend-prod --instance-type t3.micro

# Deploy
eb deploy
```

### Step 3: Deploy Frontend
```bash
cd frontend
# Initialize EB application
eb init thmanyah-frontend --platform node.js --region us-east-1

# Create environment
eb create thmanyah-frontend-prod --instance-type t3.micro

# Deploy
eb deploy
```

### Step 4: Set up Database
1. Create an RDS PostgreSQL instance
2. Update backend environment variables with database connection string
3. Redeploy backend

## Option 2: AWS ECS with Fargate (Recommended for production)

### Step 1: Create ECR Repositories
```bash
aws ecr create-repository --repository-name thmanyah-frontend
aws ecr create-repository --repository-name thmanyah-backend
```

### Step 2: Build and Push Docker Images
```bash
# Get ECR login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push frontend
cd frontend
docker build -t thmanyah-frontend .
docker tag thmanyah-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/thmanyah-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/thmanyah-frontend:latest

# Build and push backend
cd ../backend
docker build -t thmanyah-backend .
docker tag thmanyah-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/thmanyah-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/thmanyah-backend:latest
```

### Step 3: Create ECS Cluster and Services
1. Create ECS cluster
2. Create task definitions for frontend and backend
3. Create services using the task definitions
4. Set up Application Load Balancer

## Option 3: AWS Amplify + App Runner (Simplest)

### Step 1: Deploy Frontend with Amplify
1. Go to AWS Amplify Console
2. Connect your GitHub repository
3. Select the frontend branch
4. Amplify will automatically detect Next.js and deploy

### Step 2: Deploy Backend with App Runner
1. Go to AWS App Runner Console
2. Create new service
3. Connect your GitHub repository
4. Select the backend directory
5. App Runner will use the `apprunner.yaml` configuration

## Option 4: AWS Lightsail (Budget-friendly)

### Step 1: Create Lightsail Instance
```bash
# Create instance
aws lightsail create-instances \
  --instance-names thmanyah-server \
  --availability-zone us-east-1a \
  --blueprint-id ubuntu_20_04 \
  --bundle-id nano_2_0
```

### Step 2: Deploy Application
1. SSH into the instance
2. Install Docker and Docker Compose
3. Clone your repository
4. Run `docker-compose -f docker-compose.prod.yml up -d`

## Environment Variables Setup

### Backend Environment Variables
```bash
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
PORT=3001
```

### Frontend Environment Variables
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## Database Setup

### Option A: AWS RDS PostgreSQL
1. Create RDS instance
2. Configure security groups
3. Update backend connection string

### Option B: AWS Aurora Serverless
1. Create Aurora Serverless cluster
2. Configure auto-scaling
3. Update backend connection string

## Domain and SSL Setup

### Using Route 53 and ACM
1. Register domain or use existing one
2. Create SSL certificate in ACM
3. Create Route 53 hosted zone
4. Point domain to your application

### Using CloudFront
1. Create CloudFront distribution
2. Point to your application
3. Configure custom domain and SSL

## Monitoring and Logging

### CloudWatch Setup
1. Enable CloudWatch logs for your services
2. Set up alarms for CPU, memory, and error rates
3. Create dashboards for monitoring

### Application Monitoring
1. Set up AWS X-Ray for tracing
2. Configure error tracking (Sentry, etc.)
3. Set up health checks

## Cost Optimization

### Recommendations
1. Use Spot Instances for non-critical workloads
2. Enable auto-scaling
3. Use S3 for static assets
4. Implement caching strategies
5. Monitor and optimize database queries

## Security Best Practices

1. Use IAM roles instead of access keys
2. Enable VPC for network isolation
3. Configure security groups properly
4. Use AWS Secrets Manager for sensitive data
5. Enable CloudTrail for audit logging

## Troubleshooting

### Common Issues
1. **CORS errors**: Update CORS configuration in backend
2. **Database connection**: Check security groups and connection strings
3. **Build failures**: Check Node.js version compatibility
4. **Memory issues**: Increase instance size or optimize application

### Useful Commands
```bash
# Check application logs
eb logs

# SSH into EB instance
eb ssh

# Check ECS task logs
aws logs describe-log-groups
aws logs tail /ecs/thmanyah-backend

# Monitor CloudWatch metrics
aws cloudwatch get-metric-statistics
```

## Next Steps

1. Choose your preferred deployment option
2. Set up CI/CD pipeline (GitHub Actions, AWS CodePipeline)
3. Implement monitoring and alerting
4. Set up backup and disaster recovery
5. Plan for scaling and performance optimization 