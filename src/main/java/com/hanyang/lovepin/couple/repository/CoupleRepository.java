package com.hanyang.lovepin.couple.repository;

import com.hanyang.lovepin.couple.domain.Couple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CoupleRepository extends JpaRepository<Couple, Long> {

    @Query("SELECT c FROM Couple c WHERE (c.user1.userId = :userId OR c.user2.userId = :userId) AND c.status = 'ACTIVE'")
    Optional<Couple> findActiveByUserId(@Param("userId") Long userId);
}
