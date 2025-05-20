package com.scut.cms.service;

import com.scut.cms.model.User;             // ваша сущность
import com.scut.cms.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    private final UserRepository repo;

    public JwtUserDetailsService(UserRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Здесь User — ваша доменная сущность com.scut.cms.model.User
        User u = repo.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // А здесь User — Spring Security UserDetails
        return new org.springframework.security.core.userdetails.User(
            u.getUsername(),
            u.getPassword(),
            Collections.singleton(new SimpleGrantedAuthority(u.getRole().name()))
        );
    }
}
