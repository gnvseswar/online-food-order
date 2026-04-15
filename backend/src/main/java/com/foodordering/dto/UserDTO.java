package com.foodordering.dto;

import com.foodordering.model.Role;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private Role role;
}
