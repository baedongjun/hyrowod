package com.crossfitkorea.security.oauth2;

import com.crossfitkorea.domain.user.entity.AuthProvider;
import com.crossfitkorea.domain.user.entity.User;
import com.crossfitkorea.domain.user.repository.UserRepository;
import com.crossfitkorea.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Value("${app.frontend-url:https://crossfitkorea.com}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String registrationId = resolveRegistrationId(request);

        User user = resolveUser(oAuth2User, registrationId);
        if (user == null || !user.isActive()) {
            getRedirectStrategy().sendRedirect(request, response, frontendUrl + "/login?error=oauth2");
            return;
        }

        String accessToken = jwtTokenProvider.createAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());

        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/callback")
            .queryParam("accessToken", accessToken)
            .queryParam("refreshToken", refreshToken)
            .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private String resolveRegistrationId(HttpServletRequest request) {
        String uri = request.getRequestURI();
        if (uri.contains("kakao")) return "kakao";
        if (uri.contains("google")) return "google";
        return "";
    }

    @SuppressWarnings("unchecked")
    private User resolveUser(OAuth2User oAuth2User, String registrationId) {
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String providerId;
        String email = null;

        if ("kakao".equals(registrationId)) {
            providerId = String.valueOf(attributes.get("id"));
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            if (kakaoAccount != null) email = (String) kakaoAccount.get("email");
        } else {
            providerId = (String) attributes.get("sub");
            email = (String) attributes.get("email");
        }

        AuthProvider provider = AuthProvider.valueOf(registrationId.toUpperCase());

        User user = userRepository.findByProviderAndProviderId(provider, providerId).orElse(null);
        if (user != null) return user;
        if (email != null) return userRepository.findByEmail(email).orElse(null);
        return null;
    }
}
