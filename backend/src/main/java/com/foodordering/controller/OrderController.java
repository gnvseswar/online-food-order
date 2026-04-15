package com.foodordering.controller;

import com.foodordering.dto.OrderDTO;
import com.foodordering.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import com.foodordering.model.User;
import com.foodordering.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    private Long getUserId(Authentication auth) {
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return user.getId();
    }

    @PostMapping
    public ResponseEntity<OrderDTO> placeOrder(Authentication auth) {
        return ResponseEntity.ok(orderService.placeOrder(getUserId(auth)));
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getUserOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getUserOrders(getUserId(auth)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
}
