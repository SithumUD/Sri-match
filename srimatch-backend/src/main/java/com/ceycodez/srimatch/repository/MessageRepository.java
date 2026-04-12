package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.Match;
import com.ceycodez.srimatch.model.Message;
import com.ceycodez.srimatch.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findByMatchOrderByCreatedAtDesc(Match match, Pageable pageable);

    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.createdAt DESC")
    Page<Message> findBetweenUsers(@Param("user1") User user1, @Param("user2") User user2, Pageable pageable);

    List<Message> findByReceiverAndReadFalse(User receiver);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver = :receiver AND m.read = false")
    long countUnreadMessages(@Param("receiver") User receiver);
}
