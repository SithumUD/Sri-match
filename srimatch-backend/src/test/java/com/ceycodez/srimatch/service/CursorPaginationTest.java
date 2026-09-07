package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.ProfileSearchRequest;
import com.ceycodez.srimatch.dto.response.CursorPageResponse;
import com.ceycodez.srimatch.dto.response.PublicProfileResponse;
import com.ceycodez.srimatch.model.Profile;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.repository.LikeRepository;
import com.ceycodez.srimatch.repository.ProfileRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CursorPaginationTest {

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private LikeRepository likeRepository;

    @Mock
    private MatchingService matchingService;

    @InjectMocks
    private ProfileService profileService;

    private User dummyUser;
    private Profile p1;
    private Profile p2;
    private Profile p3;

    @BeforeEach
    void setUp() {
        dummyUser = User.builder().id(100L).email("user@example.com").build();

        p1 = Profile.builder().id(1L).user(User.builder().id(10L).firstName("Amal").lastName("Perera").build())
                .completionScore(95).profession("Engineer").city("Colombo").build();

        p2 = Profile.builder().id(2L).user(User.builder().id(20L).firstName("Kamal").lastName("Silva").build())
                .completionScore(85).profession("Doctor").city("Kandy").build();

        p3 = Profile.builder().id(3L).user(User.builder().id(30L).firstName("Nimal").lastName("Fernando").build())
                .completionScore(75).profession("Teacher").city("Galle").build();
    }

    @Test
    @DisplayName("Should fetch first page with limit=2 and generate opaque nextCursor")
    void testCursorPaginationFirstPage() {
        // Page 1 has 2 items with total 3 elements (so hasNext is true)
        when(profileRepository.findDiscoveryDynamic(
                any(), any(), any(), any(), any(), any(), any(), any(), any(), any(),
                any(), any(), any(), any(), any(), any(), any(), any(), any(), any(),
                any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(p1, p2), org.springframework.data.domain.PageRequest.of(0, 2), 3));

        ProfileSearchRequest request = new ProfileSearchRequest();
        CursorPageResponse<PublicProfileResponse> response = profileService.searchProfilesCursor(request, null, 2, null);

        assertNotNull(response);
        assertEquals(2, response.getItems().size());
        assertTrue(response.isHasMore());
        assertNotNull(response.getNextCursor());

        // Decode next cursor: should be "v1:none:1"
        String decoded = new String(Base64.getUrlDecoder().decode(response.getNextCursor()));
        assertEquals("v1:none:1", decoded);
    }

    @Test
    @DisplayName("Should fetch last page with limit=2 and return nextCursor=null when no more items exist")
    void testCursorPaginationLastPage() {
        when(profileRepository.findDiscoveryDynamic(
                any(), any(), any(), any(), any(), any(), any(), any(), any(), any(),
                any(), any(), any(), any(), any(), any(), any(), any(), any(), any(),
                any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(p3), org.springframework.data.domain.PageRequest.of(1, 2), 3));

        ProfileSearchRequest request = new ProfileSearchRequest();
        String cursor = Base64.getUrlEncoder().withoutPadding().encodeToString("v1:none:1".getBytes());
        CursorPageResponse<PublicProfileResponse> response = profileService.searchProfilesCursor(request, cursor, 2, null);

        assertNotNull(response);
        assertEquals(1, response.getItems().size());
        assertFalse(response.isHasMore());
        assertNull(response.getNextCursor());
    }
}
