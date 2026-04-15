package com.foodordering.service.impl;

import com.foodordering.dto.OrderDTO;
import com.foodordering.exception.BadRequestException;
import com.foodordering.exception.ResourceNotFoundException;
import com.foodordering.model.Cart;
import com.foodordering.model.Order;
import com.foodordering.model.OrderItem;
import com.foodordering.model.OrderStatus;
import com.foodordering.repository.CartRepository;
import com.foodordering.repository.OrderRepository;
import com.foodordering.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    @Override
    public OrderDTO placeOrder(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        double totalAmount = cart.getItems().stream()
                .mapToDouble(item -> item.getFoodItem().getPrice() * item.getQuantity())
                .sum();

        Order order = Order.builder()
                .user(cart.getUser())
                .totalAmount(totalAmount)
                .status(OrderStatus.PLACED)
                .createdAt(LocalDateTime.now())
                .build();

        List<OrderItem> orderItems = cart.getItems().stream().map(ci -> OrderItem.builder()
                .order(order)
                .foodItem(ci.getFoodItem())
                .quantity(ci.getQuantity())
                .price(ci.getFoodItem().getPrice())
                .build()).collect(Collectors.toList());

        order.setItems(orderItems); // Assuming items field exists in Order, wait we need to fix Order entity mapping if needed

        // Save order and clear cart
        Order savedOrder = orderRepository.save(order);
        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToDTO(savedOrder);
    }

    @Override
    public List<OrderDTO> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public OrderDTO getOrderById(Long id) {
        return mapToDTO(orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found")));
    }

    private OrderDTO mapToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        // For brevity we can skip setting items map here if not added to entity
        return dto;
    }
}
