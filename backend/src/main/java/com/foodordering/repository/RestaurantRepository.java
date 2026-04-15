package com.foodordering.repository;

import com.foodordering.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByLocationContainingIgnoreCase(String location);
    Optional<Restaurant> findByExternalId(String externalId);
}
