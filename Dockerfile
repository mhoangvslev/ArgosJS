# Set up Angular project
FROM node:11.15.0
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY . /app

# install and cache app dependencies
RUN npm install --unsafe-perm
RUN npm install -g @angular/cli@7.3.9

CMD ng serve --host 0.0.0.0

# EXPOSE volumes
VOLUME [ "/app/config/" ]
VOLUME [ "/app/database/models/" ]
VOLUME [ "/app/database/strategies/" ]
VOLUME [ "/app/database/import" ]

# Expose ports for Angular, Neo4J's HTTP/HTTPS
EXPOSE 4200