package com.foodordering.service;

import com.foodordering.dto.OrderDTO;

import java.util.List;

public interface OrderService {
    OrderDTO placeOrder(Long userId);
    List<OrderDTO> getUserOrders(Long userId);
    List<OrderDTO> getAllOrders();
    OrderDTO getOrderById(Long id);
}
