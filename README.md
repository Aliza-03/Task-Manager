# Task Manager App – Deployment Guide

This project is a full-stack Task Manager application with a React frontend and a Node.js backend (Dockerized). Here's how to deploy both components independently using **AWS EC2** and **Elastic Beanstalk**.

---

## Backend (Node.js + Docker) – Deployed on EC2

###  Project Structure (Backend)
task-manager/
└── backend/
├── Dockerfile
├── index.js
├── db.js
├── routes/
├── package.json


### Docker Setup

1. **Build Docker Image:**
   ```bash
   docker build -t task-manager-backend .
   docker run -p 3000:3000 task-manager-backend
   docker tag task-manager-backend your-dockerhub-username/task-manager-backend
   docker push your-dockerhub-username/task-manager-backend

### Launch EC2 Instance
Go to AWS EC2.
- Launch a new instance (Amazon Linux 2 or Ubuntu).
- Open port 3000 in the security group.
- Add an IAM role if needed (e.g., for S3 access).

After forming an ssh connection

```bash
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -aG docker ec2-user
```

### Build and Run
```bash
cd backend
docker build -t task-manager-backend .
docker run -d -p 3000:3000 task-manager-backend
```
### Frontend Deployment
Build the frontend through npm run build
and upload the builded file on elastic beanstalk





