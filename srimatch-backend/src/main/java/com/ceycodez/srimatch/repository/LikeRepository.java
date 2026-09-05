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

    @Query("SELECT l FROM Like l WHERE l.receiver.id = :receiverId AND l.status = :status AND l.type = :type")
    Page<Like> findByReceiverIdAndStatusAndType(@Param("receiverId") Long receiverId, @Param("status") LikeStatus status, @Param("type") com.ceycodez.srimatch.model.enums.LikeType type, Pageable pageable);

    @Query("SELECT COUNT(l) FROM Like l WHERE l.receiver.id = :receiverId AND l.status = :status")
    long countByReceiverIdAndStatus(@Param("receiverId") Long receiverId, @Param("status") LikeStatus status);

    @Query("SELECT COUNT(l) FROM Like l WHERE l.receiver.id = :receiverId AND l.status = :status AND l.type = :type")
    long countByReceiverIdAndStatusAndType(@Param("receiverId") Long receiverId, @Param("status") LikeStatus status, @Param("type") com.ceycodez.srimatch.model.enums.LikeType type);

    @Query("SELECT l FROM Like l WHERE l.sender.id = :senderId")
    Page<Like> findBySenderId(@Param("senderId") Long senderId, Pageable pageable);

    boolean existsBySenderAndReceiverAndStatus(User sender, User receiver, LikeStatus status);

    // Find a like by the sender's user ID and the receiver's PROFILE ID
    @Query("SELECT l FROM Like l WHERE l.sender.id = :senderId AND l.receiver.id = (SELECT p.user.id FROM Profile p WHERE p.id = :targetProfileId)")
    Optional<Like> findBySenderIdAndReceiverProfileId(@Param("senderId") Long senderId, @Param("targetProfileId") Long targetProfileId);

    java.util.List<Like> findBySenderIdAndReceiverIdIn(Long senderId, java.util.Collection<Long> receiverIds);

    @Query("SELECT l FROM Like l " +
           "LEFT JOIN FETCH l.sender s " +
           "LEFT JOIN FETCH s.profile " +
           "LEFT JOIN FETCH l.receiver r " +
           "LEFT JOIN FETCH r.profile " +
           "WHERE l.sender = :sender " +
           "ORDER BY l.createdAt DESC")
    java.util.List<Like> findBySenderOrderByCreatedAtDesc(@Param("sender") User sender);

    @Query("SELECT l FROM Like l " +
           "LEFT JOIN FETCH l.sender s " +
           "LEFT JOIN FETCH s.profile " +
           "LEFT JOIN FETCH l.receiver r " +
           "LEFT JOIN FETCH r.profile " +
           "WHERE l.receiver = :receiver " +
           "ORDER BY l.createdAt DESC")
    java.util.List<Like> findByReceiverOrderByCreatedAtDesc(@Param("receiver") User receiver);
}
