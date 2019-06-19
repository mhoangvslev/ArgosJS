# base image
FROM neo4j:3.5.6
ENV NEO4J_AUTH=neo4j/argosjs, NEO4J_apoc.export.file.enabled=true, NEO4J_apoc.import.file.enabled=true, NEO4J_apoc.import.file.use_neo4j_config=false

# Set up Angular project
FROM node:11.15.0
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV production

COPY . /app
RUN npm install --unsafe-perm

# start app
RUN npm install -g @angular/cli
CMD ng serve --host 0.0.0.0

# EXPOSE volumes
VOLUME [ "/app/config/" ]
VOLUME [ "/app/models/" ]
VOLUME [ "/var/lib/neo4j/import/" ]

# Expose ports for Angular, Neo4J's HTTP/HTTPS
EXPOSE 4200
EXPOSE 7474
EXPOSE 7473