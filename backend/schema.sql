-- MySQL 8+ / InnoDB / utf8mb4
USE roadmap_db;
SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NULL,
  avatar_url VARCHAR(500) NULL,
  bio TEXT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE roadmaps (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(100) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  track_type ENUM('fullstack', 'cloud_devops', 'ai_ml', 'mobile', 'backend', 'frontend', 'other') NOT NULL DEFAULT 'other',
  is_public TINYINT(1) NOT NULL DEFAULT 1,
  version VARCHAR(20) NOT NULL DEFAULT '1.0',
  theme_json JSON NULL,
  created_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roadmaps_slug (slug),
  KEY idx_roadmaps_created_by (created_by),
  CONSTRAINT fk_roadmaps_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE roadmap_nodes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  roadmap_id BIGINT UNSIGNED NOT NULL,
  parent_node_id BIGINT UNSIGNED NULL,
  node_key VARCHAR(120) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  node_type ENUM('skill', 'project', 'milestone', 'checkpoint') NOT NULL DEFAULT 'skill',
  difficulty ENUM('beginner', 'intermediate', 'advanced', 'expert') NOT NULL DEFAULT 'beginner',
  node_order INT NOT NULL DEFAULT 0,
  estimated_minutes INT NULL,
  points INT NOT NULL DEFAULT 0,
  is_major_milestone TINYINT(1) NOT NULL DEFAULT 0,
  required_for_completion TINYINT(1) NOT NULL DEFAULT 1,
  capstone_project TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roadmap_nodes_roadmap_key (roadmap_id, node_key),
  KEY idx_roadmap_nodes_roadmap_order (roadmap_id, node_order),
  KEY idx_roadmap_nodes_parent (parent_node_id),
  CONSTRAINT fk_roadmap_nodes_roadmap
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_roadmap_nodes_parent
    FOREIGN KEY (parent_node_id) REFERENCES roadmap_nodes(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rooms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  room_code CHAR(10) NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT NULL,
  is_private TINYINT(1) NOT NULL DEFAULT 1,
  invite_only TINYINT(1) NOT NULL DEFAULT 1,
  status ENUM('active', 'archived', 'closed') NOT NULL DEFAULT 'active',
  leaderboard_mode ENUM('points', 'nodes_completed', 'both') NOT NULL DEFAULT 'both',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_rooms_room_code (room_code),
  KEY idx_rooms_owner (owner_user_id),
  CONSTRAINT fk_rooms_owner
    FOREIGN KEY (owner_user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE room_members (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  member_role ENUM('owner', 'admin', 'member') NOT NULL DEFAULT 'member',
  join_status ENUM('pending', 'approved', 'rejected', 'left') NOT NULL DEFAULT 'approved',
  points_earned INT NOT NULL DEFAULT 0,
  nodes_completed INT NOT NULL DEFAULT 0,
  invited_by BIGINT UNSIGNED NULL,
  joined_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_room_members_room_user (room_id, user_id),
  KEY idx_room_members_room_points (room_id, points_earned),
  KEY idx_room_members_user (user_id),
  KEY idx_room_members_invited_by (invited_by),
  CONSTRAINT fk_room_members_room
    FOREIGN KEY (room_id) REFERENCES rooms(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_room_members_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_room_members_invited_by
    FOREIGN KEY (invited_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_progress (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  roadmap_id BIGINT UNSIGNED NOT NULL,
  roadmap_node_id BIGINT UNSIGNED NOT NULL,
  room_id BIGINT UNSIGNED NULL,
  status ENUM('locked', 'available', 'in_progress', 'completed', 'skipped', 'pending_proof') NOT NULL DEFAULT 'available',
  is_skipped TINYINT(1) NOT NULL DEFAULT 0,
  progress_percent DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  completed_at DATETIME NULL,
  skipped_at DATETIME NULL,
  points_awarded INT NOT NULL DEFAULT 0,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_progress_user_node_room (user_id, roadmap_node_id, room_id),
  KEY idx_user_progress_user_roadmap (user_id, roadmap_id),
  KEY idx_user_progress_room (room_id),
  KEY idx_user_progress_node (roadmap_node_id),
  KEY idx_user_progress_status (status),
  CONSTRAINT fk_user_progress_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_progress_roadmap
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_progress_node
    FOREIGN KEY (roadmap_node_id) REFERENCES roadmap_nodes(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_user_progress_room
    FOREIGN KEY (room_id) REFERENCES rooms(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE proof_submissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  room_id BIGINT UNSIGNED NULL,
  roadmap_id BIGINT UNSIGNED NOT NULL,
  roadmap_node_id BIGINT UNSIGNED NOT NULL,
  submission_type ENUM('github_repo', 'live_link', 'video', 'text') NOT NULL,
  submitted_url VARCHAR(1000) NULL,
  submitted_text TEXT NULL,
  github_repo_url VARCHAR(1000) NULL,
  verification_status ENUM('pending', 'approved', 'rejected', 'needs_review') NOT NULL DEFAULT 'pending',
  verification_method ENUM('automated', 'peer_review', 'manual') NOT NULL DEFAULT 'manual',
  verified_by_bot TINYINT(1) NOT NULL DEFAULT 0,
  review_required TINYINT(1) NOT NULL DEFAULT 0,
  points_requested INT NOT NULL DEFAULT 0,
  points_approved INT NOT NULL DEFAULT 0,
  reviewed_by BIGINT UNSIGNED NULL,
  reviewed_at DATETIME NULL,
  review_notes TEXT NULL,
  external_verification_payload JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_proof_submissions_user (user_id),
  KEY idx_proof_submissions_room (room_id),
  KEY idx_proof_submissions_node (roadmap_node_id),
  KEY idx_proof_submissions_status (verification_status),
  KEY idx_proof_submissions_reviewer (reviewed_by),
  CONSTRAINT fk_proof_submissions_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_proof_submissions_room
    FOREIGN KEY (room_id) REFERENCES rooms(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_proof_submissions_roadmap
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_proof_submissions_node
    FOREIGN KEY (roadmap_node_id) REFERENCES roadmap_nodes(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_proof_submissions_reviewer
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE achievements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  client_achievement_id VARCHAR(191) NOT NULL,
  title VARCHAR(200) NOT NULL,
  track_id VARCHAR(120) NOT NULL,
  track_title VARCHAR(160) NOT NULL,
  capstone_project TEXT NOT NULL,
  badge_label VARCHAR(180) NOT NULL,
  motion_signature VARCHAR(100) NULL,
  completed_at DATETIME NOT NULL,
  theme_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_achievements_user_client (user_id, client_achievement_id),
  KEY idx_achievements_user_completed (user_id, completed_at),
  CONSTRAINT fk_achievements_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE roadmap_progress_snapshots (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  roadmap_id VARCHAR(120) NOT NULL,
  progress_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roadmap_progress_user_roadmap (user_id, roadmap_id),
  KEY idx_roadmap_progress_user_updated (user_id, updated_at),
  CONSTRAINT fk_roadmap_progress_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;