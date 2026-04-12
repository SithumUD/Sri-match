package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.Like;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.LikeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findBySenderAndReceiver(User sender, User receiver);

    @Query("SELECT l FROM Like l WHERE l.receiver.id = :receiverId AND l.status = :status")
    Page<Like> findByReceiverIdAndStatus(@Param("receiverId") Long receiverId, @Param("status") LikeStatus status, Pageable pageable);

    @Query("SELECT COUNT(l) FROM Like l WHERE l.receiver.id = :receiverId AND l.status = :status")
    long countByReceiverIdAndStatus(@Param("receiverId") Long receiverId, @Param("status") LikeStatus status);

    boolean existsBySenderAndReceiverAndStatus(User sender, User receiver, LikeStatus status);
}
