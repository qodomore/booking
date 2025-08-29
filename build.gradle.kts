import org.gradle.api.internal.FilePropertyContainer.create

plugins {
    java
    id("org.springframework.boot") version "3.3.0"
    id("io.spring.dependency-management") version "1.1.5"
    id("org.flywaydb.flyway") version "10.0.0"
    id("nu.studer.jooq") version "9.0"
    id("com.google.protobuf") version "0.9.4"
}

group = "qodo.ru"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot Core - с поддержкой виртуальных потоков
    implementation("org.springframework.boot:spring-boot-starter-web") {
        // Исключаем Tomcat, будем использовать Undertow для лучшей производительности
        exclude(group = "org.springframework.boot", module = "spring-boot-starter-tomcat")
    }
    implementation("org.springframework.boot:spring-boot-starter-undertow")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-validation")

    // Database
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("org.postgresql:postgresql:42.7.0")
    implementation("com.zaxxer:HikariCP:5.1.0")

    // jOOQ для типобезопасного SQL
    implementation("org.jooq:jooq:3.19.0")
    implementation("org.jooq:jooq-meta:3.19.0")
    implementation("org.jooq:jooq-codegen:3.19.0")
    jooqGenerator("org.postgresql:postgresql:42.7.0")

    // Flyway для миграций
    implementation("org.flywaydb:flyway-core:10.0.0")
    implementation("org.flywaydb:flyway-database-postgresql:10.0.0")

    // Redis
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    implementation("org.redisson:redisson-spring-boot-starter:3.25.0") // Для распределенных блокировок

    // RabbitMQ
    implementation("org.springframework.boot:spring-boot-starter-amqp")

    // gRPC
    implementation("io.grpc:grpc-netty-shaded:1.58.0")
    implementation("io.grpc:grpc-protobuf:1.58.0")
    implementation("io.grpc:grpc-stub:1.58.0")
    implementation("io.grpc:grpc-services:1.58.0") // для health checks и reflection
    implementation("com.google.protobuf:protobuf-java:3.24.0")
    implementation("com.google.protobuf:protobuf-java-util:3.24.0")
    implementation("javax.annotation:javax.annotation-api:1.3.2")

    // Observability
    implementation("io.micrometer:micrometer-registry-prometheus:1.12.0")
    implementation("io.micrometer:micrometer-tracing-bridge-otel:1.2.0")
    implementation("io.opentelemetry:opentelemetry-exporter-otlp:1.32.0")

    // Resilience4j для fault tolerance
    implementation("io.github.resilience4j:resilience4j-spring-boot3:2.1.0")
    implementation("io.github.resilience4j:resilience4j-circuitbreaker:2.1.0")
    implementation("io.github.resilience4j:resilience4j-retry:2.1.0")
    implementation("io.github.resilience4j:resilience4j-ratelimiter:2.1.0")

    // Utilities
    implementation("org.mapstruct:mapstruct:1.5.5.Final")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.5.5.Final")

    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // Configuration processor
    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")

    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.testcontainers:testcontainers:1.19.0")
    testImplementation("org.testcontainers:postgresql:1.19.0")
    testImplementation("org.testcontainers:rabbitmq:1.19.0")
    testImplementation("io.grpc:grpc-testing:1.58.0")
    testImplementation("org.mockito:mockito-inline:5.2.0")
    testImplementation("org.awaitility:awaitility:4.2.0")
}

// Настройка jOOQ
jooq {
    version.set("3.19.0")
    edition.set(nu.studer.gradle.jooq.JooqEdition.OSS)

    configurations {
        create("main") {
            generateSchemaSourceOnCompilation.set(false)

            jooqConfiguration.apply {
                logging = org.jooq.meta.jaxb.Logging.WARN
                jdbc.apply {
                    driver = "org.postgresql.Driver"
                    url = "jdbc:postgresql://localhost:5432/booking_db"
                    user = "booking_user"
                    password = "booking_password"
                }
                generator.apply {
                    name = "org.jooq.codegen.DefaultGenerator"
                    database.apply {
                        name = "org.jooq.meta.postgres.PostgresDatabase"
                        inputSchema = "public"
                        excludes = "flyway_schema_history"
                    }
                    generate.apply {
                        isDeprecated = false
                        isRecords = true
                        isImmutablePojos = false
                        isFluentSetters = true
                        isJavaTimeTypes = true
                    }
                    target.apply {
                        packageName = "com.qodo.booking.jooq"
                        directory = "build/generated-src/jooq/main"
                    }
                    strategy.name = "org.jooq.codegen.DefaultGeneratorStrategy"
                }
            }
        }
    }
}

// Настройка protobuf для gRPC
protobuf {
    protoc {
        artifact = "com.google.protobuf:protoc:3.24.0"
    }
    plugins {
        create("grpc") {
            artifact = "io.grpc:protoc-gen-grpc-java:1.58.0"
        }
    }
    generateProtoTasks {
        all().forEach {
            it.plugins {
                create("grpc")
            }
        }
    }
}

// Настройка Flyway
flyway {
    url = "jdbc:postgresql://localhost:5432/booking_db"
    user = "booking_user"
    password = "booking_password"
    schemas = arrayOf("public")
    locations = arrayOf("classpath:db/migration")
}

tasks.withType<Test> {
    useJUnitPlatform()
    // Включаем виртуальные потоки для тестов
    jvmArgs("-Djdk.virtualThreadScheduler.parallelism=10")
}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
    options.compilerArgs.add("-parameters")
    // Включаем preview features для максимальной производительности
    options.compilerArgs.add("--enable-preview")
}

tasks.named<org.springframework.boot.gradle.tasks.run.BootRun>("bootRun") {
    // Включаем виртуальные потоки
    jvmArgs = listOf(
        "-Dspring.threads.virtual.enabled=true",
        "--enable-preview"
    )
}