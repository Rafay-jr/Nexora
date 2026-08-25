-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: eventsphere_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendances`
--

DROP TABLE IF EXISTS `attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendances` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `event_id` bigint(20) unsigned NOT NULL,
  `student_id` bigint(20) unsigned NOT NULL,
  `attended` tinyint(1) NOT NULL DEFAULT 1,
  `marked_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `marked_by` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `attendances_event_id_student_id_unique` (`event_id`,`student_id`),
  KEY `attendances_student_id_foreign` (`student_id`),
  KEY `attendances_marked_by_foreign` (`marked_by`),
  CONSTRAINT `attendances_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendances_marked_by_foreign` FOREIGN KEY (`marked_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendances_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendances`
--

LOCK TABLES `attendances` WRITE;
/*!40000 ALTER TABLE `attendances` DISABLE KEYS */;
INSERT INTO `attendances` VALUES (1,3,4,1,'2026-08-20 00:29:07',2,'2026-08-24 14:29:07','2026-08-24 14:29:07'),(2,3,5,1,'2026-08-20 00:29:07',2,'2026-08-24 14:29:07','2026-08-24 14:29:07'),(3,3,6,1,'2026-08-20 00:29:07',2,'2026-08-24 14:29:07','2026-08-24 14:29:07');
/*!40000 ALTER TABLE `attendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendar_syncs`
--

DROP TABLE IF EXISTS `calendar_syncs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendar_syncs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `event_id` bigint(20) unsigned NOT NULL,
  `calendar_type` enum('google','outlook','apple') NOT NULL,
  `ics_reference` varchar(255) DEFAULT NULL,
  `synced_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `calendar_syncs_user_id_foreign` (`user_id`),
  KEY `calendar_syncs_event_id_foreign` (`event_id`),
  CONSTRAINT `calendar_syncs_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calendar_syncs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendar_syncs`
--

LOCK TABLES `calendar_syncs` WRITE;
/*!40000 ALTER TABLE `calendar_syncs` DISABLE KEYS */;
/*!40000 ALTER TABLE `calendar_syncs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificates`
--

DROP TABLE IF EXISTS `certificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `certificates` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `event_id` bigint(20) unsigned NOT NULL,
  `student_id` bigint(20) unsigned NOT NULL,
  `certificate_url` varchar(255) NOT NULL,
  `fee_paid` tinyint(1) NOT NULL DEFAULT 0,
  `issued_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificates_event_id_student_id_unique` (`event_id`,`student_id`),
  KEY `certificates_student_id_foreign` (`student_id`),
  CONSTRAINT `certificates_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `certificates_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificates`
--

LOCK TABLES `certificates` WRITE;
/*!40000 ALTER TABLE `certificates` DISABLE KEYS */;
INSERT INTO `certificates` VALUES (1,3,4,'/storage/certificates/cert_ai_workshop_4.pdf',1,'2026-08-21 14:29:07','2026-08-24 14:29:07','2026-08-24 14:29:07'),(2,3,5,'/storage/certificates/cert_ai_workshop_5.pdf',1,'2026-08-21 14:29:07','2026-08-24 14:29:07','2026-08-24 14:29:07'),(3,3,6,'/storage/certificates/cert_ai_workshop_6.pdf',1,'2026-08-21 14:29:07','2026-08-24 14:29:07','2026-08-24 14:29:07');
/*!40000 ALTER TABLE `certificates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_share_logs`
--

DROP TABLE IF EXISTS `event_share_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_share_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `event_id` bigint(20) unsigned NOT NULL,
  `platform` enum('facebook','whatsapp','twitter','linkedin','instagram','email') NOT NULL,
  `share_message` text DEFAULT NULL,
  `shared_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `event_share_logs_user_id_foreign` (`user_id`),
  KEY `event_share_logs_event_id_foreign` (`event_id`),
  CONSTRAINT `event_share_logs_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_share_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_share_logs`
--

LOCK TABLES `event_share_logs` WRITE;
/*!40000 ALTER TABLE `event_share_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_share_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_waitlists`
--

DROP TABLE IF EXISTS `event_waitlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_waitlists` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `event_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `waitlist_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('waiting','confirmed','cancelled') NOT NULL DEFAULT 'waiting',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `event_waitlists_event_id_foreign` (`event_id`),
  KEY `event_waitlists_user_id_foreign` (`user_id`),
  CONSTRAINT `event_waitlists_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_waitlists_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_waitlists`
--

LOCK TABLES `event_waitlists` WRITE;
/*!40000 ALTER TABLE `event_waitlists` DISABLE KEYS */;
INSERT INTO `event_waitlists` VALUES (1,1,7,'2026-08-24 09:29:07','waiting','2026-08-24 14:29:07','2026-08-24 14:29:07'),(2,1,8,'2026-08-24 09:29:07','waiting','2026-08-24 14:29:07','2026-08-24 14:29:07');
/*!40000 ALTER TABLE `event_waitlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `organizer_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` enum('technical','cultural','sports','workshop','seminar','competition') NOT NULL,
  `event_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `venue` varchar(255) NOT NULL,
  `max_participants` int(11) NOT NULL,
  `status` enum('draft','active','completed','cancelled') NOT NULL DEFAULT 'active',
  `approval_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `registration_deadline` datetime NOT NULL,
  `cancellation_reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `events_organizer_id_foreign` (`organizer_id`),
  KEY `events_event_date_category_approval_status_index` (`event_date`,`category`,`approval_status`),
  CONSTRAINT `events_organizer_id_foreign` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,2,'Nexora CodeSprint 2026 Hackathon','A 24-hour intensive coding hackathon focused on AI and web solutions for campus innovation.','technical','2026-08-31','09:00:00','21:00:00','Main Auditorium & CS Lab 3',3,'active','approved','2026-08-29 19:29:07',NULL,'2026-08-24 14:29:07','2026-08-24 14:29:07'),(2,3,'Symphony 2026 Annual Cultural Night','Annual grand cultural night featuring music performances, dance competitions, and theatrical drama.','cultural','2026-09-07','17:00:00','22:00:00','Open Air Amphitheatre',50,'active','approved','2026-09-05 19:29:07',NULL,'2026-08-24 14:29:07','2026-08-24 14:29:07'),(3,2,'Hands-on AI & Machine Learning Workshop','Interactive workshop covering PyTorch, neural networks, and model deployment on cloud platforms.','workshop','2026-08-19','10:00:00','16:00:00','Seminar Hall B',30,'completed','approved','2026-08-17 19:29:07',NULL,'2026-08-24 14:29:07','2026-08-24 14:29:07'),(4,3,'Intercollegiate Badminton & Futsal Championship','Multi-sport intercollegiate tournament bringing together top student athletes across the region.','sports','2026-09-13','08:00:00','18:00:00','Indoor Sports Complex',40,'active','approved','2026-09-11 19:29:07',NULL,'2026-08-24 14:29:07','2026-08-24 14:29:07'),(5,2,'Cybersecurity Trends & Ethical Hacking Seminar','Keynote presentation by industry experts on cybersecurity defense, threat landscape, and ethical hacking.','seminar','2026-09-03','11:00:00','13:00:00','Conference Hall 1',100,'active','pending','2026-09-01 19:29:07',NULL,'2026-08-24 14:29:07','2026-08-24 14:29:07'),(6,2,'Autonomous Robotics Obstacle Challenge','Competition for autonomous line-following and obstacle-avoidance robots.','competition','2026-08-27','14:00:00','17:00:00','Robotics Lab',15,'cancelled','approved','2026-08-25 19:29:07','Venue maintenance and equipment recalibration.','2026-08-24 14:29:07','2026-08-24 14:29:07');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedback` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `event_id` bigint(20) unsigned NOT NULL,
  `student_id` bigint(20) unsigned NOT NULL,
  `rating` tinyint(3) unsigned NOT NULL,
  `venue_rating` tinyint(3) unsigned DEFAULT NULL,
  `coordination_rating` tinyint(3) unsigned DEFAULT NULL,
  `technical_rating` tinyint(3) unsigned DEFAULT NULL,
  `hospitality_rating` tinyint(3) unsigned DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `feedback_event_id_student_id_unique` (`event_id`,`student_id`),
  KEY `feedback_student_id_foreign` (`student_id`),
  CONSTRAINT `feedback_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `feedback_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,3,4,5,5,5,5,4,'Outstanding hands-on session! Learned real-world PyTorch model deployment.','2026-08-20 14:29:07','2026-08-24 14:29:07','2026-08-24 14:29:07'),(2,3,5,5,5,5,5,4,'Great organization and clear speaker presentations. Venue hospitality was excellent.','2026-08-20 14:29:07','2026-08-24 14:29:07','2026-08-24 14:29:07'),(3,3,6,5,5,5,5,4,'Extremely informative workshop. Looking forward to advanced AI sessions.','2026-08-20 14:29:07','2026-08-24 14:29:07','2026-08-24 14:29:07');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_galleries`
--

DROP TABLE IF EXISTS `media_galleries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media_galleries` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `event_id` bigint(20) unsigned DEFAULT NULL,
  `uploaded_by` bigint(20) unsigned NOT NULL,
  `file_type` enum('image','video') NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `media_galleries_event_id_foreign` (`event_id`),
  KEY `media_galleries_uploaded_by_foreign` (`uploaded_by`),
  CONSTRAINT `media_galleries_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL,
  CONSTRAINT `media_galleries_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_galleries`
--

LOCK TABLES `media_galleries` WRITE;
/*!40000 ALTER TABLE `media_galleries` DISABLE KEYS */;
INSERT INTO `media_galleries` VALUES (1,3,2,'image','https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80','AI Workshop Lab Session with Hands-on coding','Workshops and Seminars','Computer Science & Engineering',2026,'2026-08-24 14:29:08','2026-08-24 14:29:08'),(2,NULL,3,'image','https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80','Annual Cultural Night Stage Performance Highlight','Cultural Events','Cultural & Fine Arts Board',2025,'2026-08-24 14:29:08','2026-08-24 14:29:08'),(3,NULL,2,'image','https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80','Technical Fest Keynote Presentation','Technical Fests','Information Technology',2025,'2026-08-24 14:29:08','2026-08-24 14:29:08'),(4,NULL,3,'image','https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80','Intercollegiate Futsal Final Match Winners','Sports Meets','Physical Education Department',2025,'2026-08-24 14:29:08','2026-08-24 14:29:08');
/*!40000 ALTER TABLE `media_galleries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_08_25_000001_create_user_details_table',1),(5,'2026_08_25_000002_create_events_table',1),(6,'2026_08_25_000003_create_registrations_table',1),(7,'2026_08_25_000004_create_attendances_table',1),(8,'2026_08_25_000005_create_feedback_table',1),(9,'2026_08_25_000006_create_certificates_table',1),(10,'2026_08_25_000007_create_media_galleries_table',1),(11,'2026_08_25_000008_create_event_waitlists_table',1),(12,'2026_08_25_000009_create_calendar_syncs_table',1),(13,'2026_08_25_000010_create_event_share_logs_table',1),(14,'2026_08_25_000011_create_notifications_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `target_role` enum('all','participant','organizer','admin') DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'announcement',
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_foreign` (`user_id`),
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,NULL,'all','Welcome to EventSphere Platform!','Explore upcoming technical, cultural, and sports events happening across campus. Register online to secure your slots.','announcement',NULL,'2026-08-24 14:29:08','2026-08-24 14:29:08'),(2,NULL,'participant','CodeSprint 2026 Hackathon Seats Nearly Full!','Only limited seats remain for Nexora CodeSprint 2026. Register now to participate.','reminder',NULL,'2026-08-24 14:29:08','2026-08-24 14:29:08');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registrations`
--

DROP TABLE IF EXISTS `registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registrations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `event_id` bigint(20) unsigned NOT NULL,
  `student_id` bigint(20) unsigned NOT NULL,
  `registered_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('confirmed','cancelled','waitlist') NOT NULL DEFAULT 'confirmed',
  `qr_code_token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registrations_event_id_student_id_unique` (`event_id`,`student_id`),
  UNIQUE KEY `registrations_qr_code_token_unique` (`qr_code_token`),
  KEY `registrations_student_id_foreign` (`student_id`),
  CONSTRAINT `registrations_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `registrations_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registrations`
--

LOCK TABLES `registrations` WRITE;
/*!40000 ALTER TABLE `registrations` DISABLE KEYS */;
INSERT INTO `registrations` VALUES (1,1,4,'2026-08-24 04:29:07','confirmed','QR-CUEBVZTISO','2026-08-24 14:29:07','2026-08-24 14:29:07'),(2,1,5,'2026-08-24 04:29:07','confirmed','QR-HAI4R9FIRI','2026-08-24 14:29:07','2026-08-24 14:29:07'),(3,1,6,'2026-08-24 04:29:07','confirmed','QR-HFGIMSOH8N','2026-08-24 14:29:07','2026-08-24 14:29:07'),(4,2,4,'2026-08-22 14:29:07','confirmed','QR-QDVF9YLNWM','2026-08-24 14:29:07','2026-08-24 14:29:07'),(5,2,5,'2026-08-22 14:29:07','confirmed','QR-S5CYFZA4SD','2026-08-24 14:29:07','2026-08-24 14:29:07'),(6,2,6,'2026-08-22 14:29:07','confirmed','QR-MZVM2PVBM8','2026-08-24 14:29:07','2026-08-24 14:29:07'),(7,2,7,'2026-08-22 14:29:07','confirmed','QR-ZCF5OHUKRB','2026-08-24 14:29:07','2026-08-24 14:29:07'),(8,2,8,'2026-08-22 14:29:07','confirmed','QR-WWCJ037Y4U','2026-08-24 14:29:07','2026-08-24 14:29:07'),(9,3,4,'2026-08-14 14:29:07','confirmed','QR-DQSRV96DA2','2026-08-24 14:29:07','2026-08-24 14:29:07'),(10,3,5,'2026-08-14 14:29:07','confirmed','QR-JE1XUGJ7QS','2026-08-24 14:29:07','2026-08-24 14:29:07'),(11,3,6,'2026-08-14 14:29:07','confirmed','QR-BNLFWXYEMO','2026-08-24 14:29:07','2026-08-24 14:29:07'),(12,3,7,'2026-08-14 14:29:07','confirmed','QR-PA4KLM04EX','2026-08-24 14:29:07','2026-08-24 14:29:07');
/*!40000 ALTER TABLE `registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_details`
--

DROP TABLE IF EXISTS `user_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_details` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `enrollment_no` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_details_enrollment_no_unique` (`enrollment_no`),
  KEY `user_details_user_id_foreign` (`user_id`),
  CONSTRAINT `user_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_details`
--

LOCK TABLES `user_details` WRITE;
/*!40000 ALTER TABLE `user_details` DISABLE KEYS */;
INSERT INTO `user_details` VALUES (1,1,'System Administrator','+919876543210','Administration','ADM-2026-001','2026-08-24 14:29:07','2026-08-24 14:29:07'),(2,2,'Prof. Rajesh Sharma','+919876543211','Computer Science & Engineering','FAC-CSE-012','2026-08-24 14:29:07','2026-08-24 14:29:07'),(3,3,'Dr. Meera Verma','+919876543212','Cultural & Fine Arts Board','FAC-CULT-005','2026-08-24 14:29:07','2026-08-24 14:29:07'),(4,4,'Aarav Patel','+919846330961','Computer Science','EN2024001','2026-08-24 14:29:07','2026-08-24 14:29:07'),(5,5,'Ananya Roy','+919874171831','Information Technology','EN2024002','2026-08-24 14:29:07','2026-08-24 14:29:07'),(6,6,'Rohan Gupta','+919852797848','Mechanical Engineering','EN2024003','2026-08-24 14:29:07','2026-08-24 14:29:07'),(7,7,'Sneha Rao','+919832357135','Electronics & Telecom','EN2024004','2026-08-24 14:29:07','2026-08-24 14:29:07'),(8,8,'Vikram Singh','+919835802771','Civil Engineering','EN2024005','2026-08-24 14:29:07','2026-08-24 14:29:07');
/*!40000 ALTER TABLE `user_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','organizer','participant') NOT NULL DEFAULT 'participant',
  `status` enum('active','suspended') NOT NULL DEFAULT 'active',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'System Administrator','admin','admin@eventsphere.test',NULL,'$2y$12$AYsAbnSjxhoJp774.ZE4suPyzW8VP05mQm9F64lpD1lES8yLcQjHa','admin','active',NULL,'2026-08-24 14:29:07','2026-08-24 14:29:07'),(2,'Prof. Rajesh Sharma','prof_sharma','prof.sharma@eventsphere.test',NULL,'$2y$12$AYsAbnSjxhoJp774.ZE4suPyzW8VP05mQm9F64lpD1lES8yLcQjHa','organizer','active',NULL,'2026-08-24 14:29:07','2026-08-24 14:29:07'),(3,'Dr. Meera Verma','dr_verma','dr.verma@eventsphere.test',NULL,'$2y$12$AYsAbnSjxhoJp774.ZE4suPyzW8VP05mQm9F64lpD1lES8yLcQjHa','organizer','active',NULL,'2026-08-24 14:29:07','2026-08-24 14:29:07'),(4,'Aarav Patel','aarav_patel','student1@eventsphere.test',NULL,'$2y$12$AYsAbnSjxhoJp774.ZE4suPyzW8VP05mQm9F64lpD1lES8yLcQjHa','participant','active',NULL,'2026-08-24 14:29:07','2026-08-24 14:29:07'),(5,'Ananya Roy','ananya_roy','student2@eventsphere.test',NULL,'$2y$12$AYsAbnSjxhoJp774.ZE4suPyzW8VP05mQm9F64lpD1lES8yLcQjHa','participant','active',NULL,'2026-08-24 14:29:07','2026-08-24 14:29:07'),(6,'Rohan Gupta','rohan_gupta','student3@eventsphere.test',NULL,'$2y$12$AYsAbnSjxhoJp774.ZE4suPyzW8VP05mQm9F64lpD1lES8yLcQjHa','participant','active',NULL,'2026-08-24 14:29:07','2026-08-24 14:29:07'),(7,'Sneha Rao','sneha_rao','student4@eventsphere.test',NULL,'$2y$12$AYsAbnSjxhoJp774.ZE4suPyzW8VP05mQm9F64lpD1lES8yLcQjHa','participant','active',NULL,'2026-08-24 14:29:07','2026-08-24 14:29:07'),(8,'Vikram Singh','vikram_singh','student5@eventsphere.test',NULL,'$2y$12$AYsAbnSjxhoJp774.ZE4suPyzW8VP05mQm9F64lpD1lES8yLcQjHa','participant','active',NULL,'2026-08-24 14:29:07','2026-08-24 14:29:07');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-25  0:29:17
