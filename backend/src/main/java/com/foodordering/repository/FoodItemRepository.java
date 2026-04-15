package com.foodordering.repository;

import com.foodordering.model.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.util.Optional;

public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByRestaurantId(Long restaurantId);
    Optional<FoodItem> findByExternalId(String externalId);
}
