package com.foodordering.dto;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long id;
    private FoodItemDTO foodItem;
    private Integer quantity;
}
