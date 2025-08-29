package qodo.ru.servicebooking;

import org.springframework.boot.SpringApplication;

public class TestServicebookingApplication {

    public static void main(String[] args) {
        SpringApplication.from(ServicebookingApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
