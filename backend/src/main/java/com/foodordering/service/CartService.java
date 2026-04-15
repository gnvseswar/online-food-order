package com.foodordering.service;

import com.foodordering.dto.CartDTO;
import com.foodordering.dto.FoodItemDTO;

public interface CartService {
    CartDTO getCartForUser(Long userId);
    CartDTO addToCart(Long userId, String foodItemId, Integer quantity, FoodItemDTO swiggyFood);
    CartDTO updateCartItem(Long userId, Long cartItemId, Integer quantity);
    void removeCartItem(Long userId, Long cartItemId);
    void clearCart(Long userId);
}
