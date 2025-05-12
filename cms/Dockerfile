FROM openjdk:21-jdk-slim
WORKDIR /app

COPY . .

RUN ./mvnw dependency:go-offline
RUN ./mvnw package -DskipTests

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "target/cms-0.0.1-SNAPSHOT.jar"]
