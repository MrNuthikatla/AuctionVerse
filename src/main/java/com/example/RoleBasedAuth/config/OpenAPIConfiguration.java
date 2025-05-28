package com.example.RoleBasedAuth.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfiguration {
    @Bean
    public OpenAPI defineOpenApi() {
        Server server = new Server();
        server.setUrl("http://localhost:9090");
        server.setDescription("Development");

        Contact myContact = new Contact();
        myContact.setName("Abinav N");
        myContact.setEmail("abhinavabhi793@gmail.com");


        Info information = new Info()
            .title("ebaazee: Bidding Website")
            .version("1.0")
            .description("This API exposes endpoints to ebaazee.")
            .contact(myContact);
        return new OpenAPI().info(information).servers(List.of(server));
    }
}
