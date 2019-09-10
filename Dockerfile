FROM node

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3001

# CMD ["node", "index.js"]
CMD ["bash"]
