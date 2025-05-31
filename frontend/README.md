# Thesis Frontend (React Application)

This is a React-based frontend application designed as part of a thesis project. The app is built using modern JavaScript tooling (Vite/React) and is containerized with Docker for seamless deployment.

## 🚀 Features

- Built with React and Vite for fast performance
- Containerized using Docker
- Production build served with `serve`
- Exposes the app on port `3000`

## 🛠️ Requirements

- [Docker](https://www.docker.com/) installed on your system
- (Optional for local dev) Node.js 18+ and `npm`

## 📦 Getting Started

### 📥 1. Clone the Repository

```bash
git clone https://github.com/AMAY27/thesis_frontend.git
cd thesis_frontend


### 🐳 2. Build the Docker Image

```bash
docker build -t thesis-frontend .
```

### ▶️ 3. Run the Docker Container

```bash
docker run -p 3000:3000 thesis-frontend
```

Open your browser at [http://localhost:3000](http://localhost:3000)

## 🐳 Dockerfile Overview

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm i -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist"]
```

## 📁 Project Structure

```
/src                 # React source files
/public              # Static files
/package.json        # Project metadata and scripts
/vite.config.js      # Vite configuration
/Dockerfile          # Docker build instructions
```

## 🧪 Scripts

* `npm install` – Install dependencies
* `npm run dev` – Run dev server (localhost:3000)
* `npm run build` – Build for production
* `npm run preview` – Preview the production build

## 👤 Author

**Amay Rajvaidya**
📫 [rajvaidyaamay27@gmail.com](mailto:rajvaidyaamay27@gmail.com)
🔗 [GitHub Profile](https://github.com/AMAY27)

