FROM node:18-alpine

WORKDIR /usr/app

COPY index.js .
COPY package.json .
COPY package-lock.json .
COPY /src ./src/

ENV PORT 5001
ENV MINIO_HOST http://minio:9000
ENV MINIO_ACCESS_KEY minio
ENV MINIO_SECRET_KEY minio123
ENV MONGO_URI mongodb+srv://jesus:UFG8z^okf!mrSFz@@ing-software2.agok4bv.mongodb.net/?retryWrites=true&w=majority
EXPOSE 5001

RUN  npm install --production

CMD ["node", "index.js"]
