# Task Manager App – Deployment Guide

This project is a full-stack Task Manager application with a React frontend and a Node.js backend (Dockerized). Here's how we deployed both components independently using **AWS EC2** and **Elastic Beanstalk**.

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
and upload the built file on elastic beanstalk. After completing the configurations we launched the web application. Proof screenshotted below

### DB Setup on AWS
![image](https://github.com/user-attachments/assets/9818141e-5488-428b-86b7-9bb6ccda9174)

### Application on Elastic Beanstalk
![image](https://github.com/user-attachments/assets/3aa0e7c0-dd66-491d-9382-1eb6d5e4cc46)

### Website deployed
![image](https://github.com/user-attachments/assets/b9845b73-c67a-4280-9afa-a5e6096cdd4b)


**Note: This project was previously hosted on AWS but taken down due to resource constraints. The following screenshots and explanations reflect the deployed version.**





