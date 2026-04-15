package com.foodordering.service;

import com.foodordering.dto.FoodItemDTO;
import com.foodordering.model.FoodItem;

import java.util.List;

public interface FoodService {
    List<FoodItemDTO> getAllFoodItems();
    List<FoodItemDTO> getFoodItemsByRestaurant(Long restaurantId);
    FoodItemDTO getFoodItemById(Long id);
    FoodItemDTO createFoodItem(FoodItem foodItem, Long restaurantId);
    FoodItemDTO updateFoodItem(Long id, FoodItem foodItemDetails);
    void deleteFoodItem(Long id);
}
