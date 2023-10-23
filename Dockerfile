FROM node:18-alpine

WORKDIR /usr/app

COPY index.js .
COPY package.json .
COPY package-lock.json .
COPY /src ./src/

ENV PORT 5001
ENV MONGO_URI mongodb+srv://jesus:6JEAsLlCnvWur6Qy@ing-software2.agok4bv.mongodb.net/?retryWrites=true&w=majority
ENV MINIO_HOST https://minio
EXPOSE 5001

RUN  npm install --production

CMD ["node", "index.js"]
