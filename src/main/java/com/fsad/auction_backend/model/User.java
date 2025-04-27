package com.fsad.auction_backend.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class User {

    private Long id;

    private String username;

    private String password;

    private String role;

}
