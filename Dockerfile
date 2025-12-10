FROM node:20.14.0
 
WORKDIR /app  

COPY package*.json ./  

RUN yarn install

COPY . .  

RUN yarn run build  

EXPOSE 3005  

CMD ["yarn", "run", "start:staging"] 

