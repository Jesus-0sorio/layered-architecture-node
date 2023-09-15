FROM node:18-alpine

WORKDIR /usr/app

COPY index.js .
COPY package.json .
COPY package-lock.json .
COPY /src ./src/

ENV PORT 5001
ENV MONGO_URI 
EXPOSE 5001

RUN  npm install --production

CMD ["node", "index.js"]