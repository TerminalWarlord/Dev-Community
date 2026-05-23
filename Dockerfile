FROM node:26-alpine
WORKDIR /app
COPY package.json .
RUN npm run build
RUN npm i
COPY . .
EXPOSE ${PORT}
CMD ["npm", "run", "start"]