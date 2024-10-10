FROM node:14 AS heredium-frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "local"]