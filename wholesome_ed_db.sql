-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 12, 2023 at 09:15 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wholesome_ed_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `campuses`
--

CREATE TABLE `campuses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(100) NOT NULL,
  `name` varchar(60) NOT NULL,
  `phone` varchar(40) NOT NULL,
  `email` varchar(40) NOT NULL,
  `location` varchar(200) NOT NULL,
  `user_number` varchar(40) NOT NULL,
  `school_number` varchar(40) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `campuses`
--

INSERT INTO `campuses` (`id`, `number`, `name`, `phone`, `email`, `location`, `user_number`, `school_number`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '9d46d0c8-d4c3-421f-aaa6-69f0af16bfdf', 'Bunamwaya', '0752611394', 'noregrets@counsellor.com', 'Bunamwaya', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '545f2ae7-67f1-447c-9d23-34628f3d6436', '2023-09-12 15:41:06.798', '2023-09-12 15:41:06.798', NULL),
(6, 'a4e16202-f55b-42d4-b541-eae0af10142b', 'Bunamwaya 2', '+1 (941) 631-5554', 'dytov@mailinator.com', 'Temporibus aute exer', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '545f2ae7-67f1-447c-9d23-34628f3d6436', '2023-09-12 15:47:39.778', '2023-09-12 15:47:39.778', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(100) NOT NULL,
  `name` varchar(60) NOT NULL,
  `level_number` varchar(40) NOT NULL,
  `user_number` varchar(40) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `number`, `name`, `level_number`, `user_number`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '49b5277e-529b-41b1-9fbb-3f51837f07b7', 'Kindergarten 1', 'dd5c8643-e4ec-4b28-b5c7-8d82085b25ef', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:46:35.142', '2023-09-12 15:46:35.142', NULL),
(2, '13ff7077-fe07-4428-beeb-6cd205b7d178', 'Kindergarten 2', 'dd5c8643-e4ec-4b28-b5c7-8d82085b25ef', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:46:44.205', '2023-09-12 15:46:44.205', NULL),
(3, '0df99aeb-2db9-4a15-b4a6-e5fafa877dc1', 'Kindergarten 3', 'dd5c8643-e4ec-4b28-b5c7-8d82085b25ef', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:46:51.179', '2023-09-12 15:46:51.179', NULL),
(4, '5ceea425-3b2b-45b0-8596-02004186f8c3', 'Primary 1', 'e2ec34a5-041b-46ec-805f-cc0a996cd76a', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:48:50.596', '2023-09-12 15:48:50.596', NULL),
(5, '5ba251a7-f0ff-4897-8aa6-5acb8d9c1fb2', 'Primary 2', 'e2ec34a5-041b-46ec-805f-cc0a996cd76a', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:48:57.322', '2023-09-12 15:48:57.322', NULL),
(6, '811ec18c-6be8-4b44-94c2-85b3c94dd6fd', 'Primary 3', 'e2ec34a5-041b-46ec-805f-cc0a996cd76a', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:49:03.762', '2023-09-12 15:49:03.762', NULL),
(7, '0664b037-a81f-4bf7-8ebe-96c0abc09fac', 'Primary 4', 'e2ec34a5-041b-46ec-805f-cc0a996cd76a', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:49:11.303', '2023-09-12 15:49:11.303', NULL),
(8, '0abf41c0-a2cc-4316-80e2-d045643ebcac', 'Primary 5', 'e2ec34a5-041b-46ec-805f-cc0a996cd76a', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:49:17.011', '2023-09-12 15:49:17.011', NULL),
(9, 'd5c567a8-25f0-4d3e-8504-eb389ac5faf0', 'Primary 6', 'e2ec34a5-041b-46ec-805f-cc0a996cd76a', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:49:23.622', '2023-09-12 15:49:23.622', NULL),
(10, '6c86ea6d-4bc9-47ee-90e1-df32a47f49aa', 'Primary 7', 'e2ec34a5-041b-46ec-805f-cc0a996cd76a', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:49:29.461', '2023-09-12 15:49:29.461', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `concepts`
--

CREATE TABLE `concepts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(100) NOT NULL,
  `name` varchar(60) NOT NULL,
  `user_number` varchar(40) NOT NULL,
  `sub_topic_number` varchar(40) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `concepts`
--

INSERT INTO `concepts` (`id`, `number`, `name`, `user_number`, `sub_topic_number`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'edd7dc4b-2b5f-49fe-941a-ecccc7fce449', 'Curve Facing Forward', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '8989f303-8829-4969-91fc-1d72e5ab5c64', '2023-09-12 16:31:05.605', '2023-09-12 16:31:05.605', NULL),
(3, '66dd619d-c8fb-4f64-b345-e9f4e737034d', 'Curve Facing Backward', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '5dba8533-f893-4793-be4c-fd154727606f', '2023-09-12 16:31:55.777', '2023-09-12 16:31:55.777', NULL),
(4, '363d4141-22df-4515-8cb9-d51e6e765ff4', 'Curve Facing Up', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '5dba8533-f893-4793-be4c-fd154727606f', '2023-09-12 16:32:05.836', '2023-09-12 16:32:05.836', NULL),
(5, '128bc95f-d601-4042-8f58-cc00f19a19ac', 'Curve Facing Down', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '5dba8533-f893-4793-be4c-fd154727606f', '2023-09-12 16:32:13.405', '2023-09-12 16:32:13.405', NULL),
(6, '5a4d567f-cd33-479a-aae7-8ded339d9aec', 'Sleeping Stick', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '8989f303-8829-4969-91fc-1d72e5ab5c64', '2023-09-12 16:32:33.947', '2023-09-12 16:32:33.947', NULL),
(7, 'bcf61b82-6b89-4f1e-9787-fcaecaf0b2c4', 'Standing Stick', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '8989f303-8829-4969-91fc-1d72e5ab5c64', '2023-09-12 16:32:44.618', '2023-09-12 16:32:44.618', NULL),
(8, '4ba99d3f-2337-4dec-b85d-7c3cf6ea14d4', 'Stick Slanting Forward', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '8989f303-8829-4969-91fc-1d72e5ab5c64', '2023-09-12 16:33:04.007', '2023-09-12 16:33:04.007', NULL),
(9, 'cc07ebb2-807f-4c23-84e0-37f636be4a93', 'Stick Slanting Backward', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '8989f303-8829-4969-91fc-1d72e5ab5c64', '2023-09-12 16:33:22.656', '2023-09-12 16:33:22.656', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `contact` varchar(40) NOT NULL,
  `contact_type` varchar(10) NOT NULL,
  `user_number` varchar(100) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `contact`, `contact_type`, `user_number`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'muyingosteven@gmail.com', 'Email', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-08-22 09:17:51.046', '2023-08-22 09:17:51.046', NULL),
(2, '+256703228386', 'Phone', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-08-22 09:17:51.048', '2023-08-22 09:17:51.048', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `learning_areas`
--

CREATE TABLE `learning_areas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(100) NOT NULL,
  `name` varchar(60) NOT NULL,
  `user_number` varchar(40) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `learning_areas`
--

INSERT INTO `learning_areas` (`id`, `number`, `name`, `user_number`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '71811d41-5dc2-4755-8f60-3635537611fe', 'Mental Studies', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:04:38.298', '2023-09-12 15:04:38.298', NULL),
(2, '57175a9d-282f-4931-9244-d3e2b4d1e13a', 'Physical Studies', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:05:18.878', '2023-09-12 15:05:18.878', NULL),
(3, 'b89cd4b7-6461-45aa-86e6-619095156966', 'Religious Studies', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:06:52.748', '2023-09-12 15:06:52.748', NULL),
(4, '591df138-a12d-46d4-920d-f568e04c3587', 'Social Studies', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:07:07.421', '2023-09-12 15:07:07.421', NULL),
(5, '49ece0cd-1b9d-4eb3-a151-05d73efb3a6a', 'learn', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 21:56:07.814', '2023-09-12 21:56:07.814', NULL),
(6, '3d922c61-8333-4f4e-b224-6453b670c5ad', 'kju', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 21:58:28.581', '2023-09-12 21:58:28.581', NULL),
(7, '8ff4992a-62fd-4ddf-8136-f1a007c4543a', 'juj', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 21:59:01.965', '2023-09-12 21:59:01.965', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `levels`
--

CREATE TABLE `levels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(100) NOT NULL,
  `name` varchar(60) NOT NULL,
  `campus_number` varchar(40) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `levels`
--

INSERT INTO `levels` (`id`, `number`, `name`, `campus_number`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'dd5c8643-e4ec-4b28-b5c7-8d82085b25ef', 'kindergarten', '9d46d0c8-d4c3-421f-aaa6-69f0af16bfdf', '2023-09-12 15:41:06.802', '2023-09-12 15:41:06.802', NULL),
(22, 'e2ec34a5-041b-46ec-805f-cc0a996cd76a', 'primary', 'a4e16202-f55b-42d4-b541-eae0af10142b', '2023-09-12 15:47:39.782', '2023-09-12 15:47:39.782', NULL),
(23, 'fc8b004e-3d78-4ec1-abce-f3b4f7bc9716', 'vocational', 'a4e16202-f55b-42d4-b541-eae0af10142b', '2023-09-12 15:47:39.784', '2023-09-12 15:47:39.784', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(40) NOT NULL,
  `user_number` varchar(100) NOT NULL,
  `token` varchar(80) NOT NULL,
  `status` varchar(10) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `number`, `user_number`, `token`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '91dc237e-c32b-4e3e-a9fb-ea8d5566e037', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'f6089c20-33f9-4b9a-8c6d-ae8365ecbf31', 'Active', '2023-08-22 09:17:51.049', '2023-08-22 09:19:07.874', NULL),
(4, 'e1b25711-3b6c-4150-bc70-0d779c2e00f3', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '5823fa34-3ad5-44ea-9959-8520d890be67', 'Active', '2023-08-22 12:06:01.679', '2023-08-22 12:07:04.891', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `schools`
--

CREATE TABLE `schools` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(100) NOT NULL,
  `name` varchar(60) NOT NULL,
  `user_number` varchar(40) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`id`, `number`, `name`, `user_number`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '545f2ae7-67f1-447c-9d23-34628f3d6436', 'Noregrets Life School', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:39:32.429', '2023-09-12 15:39:32.429', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `strands`
--

CREATE TABLE `strands` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(100) NOT NULL,
  `name` varchar(60) NOT NULL,
  `user_number` varchar(40) NOT NULL,
  `subject_number` varchar(40) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `strands`
--

INSERT INTO `strands` (`id`, `number`, `name`, `user_number`, `subject_number`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '123a69e8-0537-43d6-aa1d-814e2d5cee50', 'Heart', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'e9d786f1-9de0-4845-ba3b-cde43fbc10c0', '2023-09-12 15:31:03.037', '2023-09-12 15:31:03.037', NULL),
(2, '14b14d72-16a3-4b15-b883-5904b1084dfd', 'Soul', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'e9d786f1-9de0-4845-ba3b-cde43fbc10c0', '2023-09-12 15:31:12.182', '2023-09-12 15:31:12.182', NULL),
(3, '9e152807-f9c3-4fdf-91be-b0583b090566', 'Mind', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'e9d786f1-9de0-4845-ba3b-cde43fbc10c0', '2023-09-12 15:31:20.552', '2023-09-12 15:31:20.552', NULL),
(4, '598b152c-5fa5-47c4-be6e-309ef18b3c23', 'Number Sense', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'b167b4d3-7bac-4c59-af0d-ce7a1ff1cd03', '2023-09-12 15:31:51.509', '2023-09-12 15:31:51.509', NULL),
(5, '06f37988-232d-4bde-bb08-ed9bcaabd450', 'Algebra', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'b167b4d3-7bac-4c59-af0d-ce7a1ff1cd03', '2023-09-12 15:32:08.899', '2023-09-12 15:32:08.899', NULL),
(6, '144c57a0-15dc-4192-8f2b-37ba79e53ceb', 'Measurement', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'b167b4d3-7bac-4c59-af0d-ce7a1ff1cd03', '2023-09-12 15:32:20.892', '2023-09-12 15:32:20.892', NULL),
(7, '940bc1d9-c0c4-406d-9fae-69848c6c6966', 'Geometry', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'b167b4d3-7bac-4c59-af0d-ce7a1ff1cd03', '2023-09-12 15:32:50.284', '2023-09-12 15:32:50.284', NULL),
(8, '172ce8a7-580a-4e0c-8dde-2efe0f400d61', 'Data Sense', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'b167b4d3-7bac-4c59-af0d-ce7a1ff1cd03', '2023-09-12 15:33:04.230', '2023-09-12 15:33:04.230', NULL),
(9, 'e751b371-b2ee-4e6c-9219-2a458bbd8709', 'Diction and Grammar', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'b5c4fad4-8a13-4308-949f-ad9c129ee3b2', '2023-09-12 15:33:32.405', '2023-09-12 15:33:32.405', NULL),
(10, '767c818e-bb4b-44ec-ae83-c7fffd2bd4ef', 'Composition, Conversation and Reading', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'b5c4fad4-8a13-4308-949f-ad9c129ee3b2', '2023-09-12 15:33:58.119', '2023-09-12 15:33:58.119', NULL),
(11, '6b13ca34-bd43-4f3c-aaa0-7d01b469772f', 'Speech and Conversation', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'b5c4fad4-8a13-4308-949f-ad9c129ee3b2', '2023-09-12 15:35:21.347', '2023-09-12 15:35:21.347', NULL),
(12, 'd59837a7-f947-4a1d-9fe2-5d7c0ff5806c', 'Composition and Literature', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'b5c4fad4-8a13-4308-949f-ad9c129ee3b2', '2023-09-12 15:36:12.942', '2023-09-12 15:36:12.942', NULL),
(13, '3dfa09a2-f12c-4882-a763-576c13038337', 'Reading Comprehension', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'b5c4fad4-8a13-4308-949f-ad9c129ee3b2', '2023-09-12 15:36:32.031', '2023-09-12 15:36:32.031', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(100) NOT NULL,
  `name` varchar(60) NOT NULL,
  `subject_cluster_number` varchar(40) NOT NULL,
  `user_number` varchar(40) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `number`, `name`, `subject_cluster_number`, `user_number`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '54e17b14-aeab-4dd1-9249-533e136355bf', 'Listening', '0ceaecff-b169-4960-a9e0-4fe200059743', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:19:21.896', '2023-09-12 15:19:21.896', NULL),
(2, '447b753d-d55a-4ff7-84c7-ff076ab3e6c8', 'History', '0ceaecff-b169-4960-a9e0-4fe200059743', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:19:36.894', '2023-09-12 15:19:36.894', NULL),
(3, '1d71aa0a-777b-4859-983f-dcfb340c491e', 'Geography', '0ceaecff-b169-4960-a9e0-4fe200059743', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:19:48.675', '2023-09-12 15:19:48.675', NULL),
(4, 'b5c4fad4-8a13-4308-949f-ad9c129ee3b2', 'Language- English', '4580d77e-e3e9-4c47-bc23-20a8ee2e6344', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:20:09.597', '2023-09-12 15:20:09.597', NULL),
(5, 'b167b4d3-7bac-4c59-af0d-ce7a1ff1cd03', 'Mathematics', '4580d77e-e3e9-4c47-bc23-20a8ee2e6344', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:20:56.961', '2023-09-12 15:20:56.961', NULL),
(6, '69b91020-4e64-4339-8ddf-5ff7889e2962', 'Creactive Practice', '3ae6d600-634b-45a7-87eb-8bb2f4bd684b', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:21:24.369', '2023-09-12 15:21:24.369', NULL),
(7, '53c1a021-54a5-4698-9e40-3dfb11c7e09c', 'Agriculture', '3c797702-7901-4cb9-9358-7d8eedb98438', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:21:48.818', '2023-09-12 15:21:48.818', NULL),
(8, '0b529cbb-b58a-4e07-ba51-0bcc869ee414', 'Life Science- Living Things', '3c797702-7901-4cb9-9358-7d8eedb98438', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:22:12.646', '2023-09-12 15:22:12.646', NULL),
(9, '4c8dd124-2cd3-418f-83cb-d0a16b7b1f0a', 'Life Science- Human Body', '3c797702-7901-4cb9-9358-7d8eedb98438', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:22:35.354', '2023-09-12 15:22:35.354', NULL),
(10, '1cb75857-a403-4672-a789-752ece8bb4e6', 'Material Science', '7be5fa89-735b-421b-8ad6-c4aa283f1667', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:25:07.121', '2023-09-12 15:25:07.121', NULL),
(11, 'fafdc159-a278-48cd-958d-a8da6ee854cd', 'Sports & Performing Arts ', '7be5fa89-735b-421b-8ad6-c4aa283f1667', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:25:54.657', '2023-09-12 15:25:54.657', NULL),
(12, 'd7ea5ab7-3dd4-4d09-88ea-14a042299750', 'Physical Science: Non-Living Things', '30ebbf84-1079-46b4-9511-24a2d4c8bd66', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:27:07.968', '2023-09-12 15:27:07.968', NULL),
(13, '802f02f1-215f-4d56-bdf2-6c54f39fb45d', 'Art, Design and Engineering', '30ebbf84-1079-46b4-9511-24a2d4c8bd66', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:27:32.008', '2023-09-12 15:27:32.008', NULL),
(14, '349e2d8c-39c4-4dc5-8a20-3472910e7812', 'Work and Resource Economy', '30ebbf84-1079-46b4-9511-24a2d4c8bd66', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:27:55.828', '2023-09-12 15:27:55.828', NULL),
(15, 'e9d786f1-9de0-4845-ba3b-cde43fbc10c0', 'Religious Studies', 'ceb1ddbe-4150-41a8-8a2b-9c47db00c18e', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '2023-09-12 15:30:29.253', '2023-09-12 15:30:29.253', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subject_class`
--

CREATE TABLE `subject_class` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(100) NOT NULL,
  `class_number` varchar(40) NOT NULL,
  `subject_number` varchar(40) NOT NULL,
  `campus_number` varchar(40) NOT NULL,
  `level_number` varchar(40) NOT NULL,
  `user_number` varchar(40) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `subject_clusters`
--

CREATE TABLE `subject_clusters` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(100) NOT NULL,
  `name` varchar(60) NOT NULL,
  `user_number` varchar(40) NOT NULL,
  `learning_area_number` varchar(40) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subject_clusters`
--

INSERT INTO `subject_clusters` (`id`, `number`, `name`, `user_number`, `learning_area_number`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '0ceaecff-b169-4960-a9e0-4fe200059743', 'Knowledge', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '71811d41-5dc2-4755-8f60-3635537611fe', '2023-09-12 15:13:35.001', '2023-09-12 15:13:35.001', NULL),
(2, '4580d77e-e3e9-4c47-bc23-20a8ee2e6344', 'Understanding', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '71811d41-5dc2-4755-8f60-3635537611fe', '2023-09-12 15:14:00.924', '2023-09-12 15:14:00.924', NULL),
(3, '3ae6d600-634b-45a7-87eb-8bb2f4bd684b', 'Wisdom', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '71811d41-5dc2-4755-8f60-3635537611fe', '2023-09-12 15:14:41.893', '2023-09-12 15:14:41.893', NULL),
(4, '3c797702-7901-4cb9-9358-7d8eedb98438', 'Health', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '57175a9d-282f-4931-9244-d3e2b4d1e13a', '2023-09-12 15:15:10.021', '2023-09-12 15:15:10.021', NULL),
(5, '7be5fa89-735b-421b-8ad6-c4aa283f1667', 'Strength', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '57175a9d-282f-4931-9244-d3e2b4d1e13a', '2023-09-12 15:15:23.496', '2023-09-12 15:15:23.496', NULL),
(6, '30ebbf84-1079-46b4-9511-24a2d4c8bd66', 'Production', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '57175a9d-282f-4931-9244-d3e2b4d1e13a', '2023-09-12 15:15:36.620', '2023-09-12 15:15:36.620', NULL),
(7, '6080e703-2644-4c07-9264-2f4748da7798', 'Heart', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'b89cd4b7-6461-45aa-86e6-619095156966', '2023-09-12 15:15:59.584', '2023-09-12 15:15:59.584', NULL),
(8, '52c631bb-539e-45eb-9c62-a88bb75fd3c5', 'Soul', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'b89cd4b7-6461-45aa-86e6-619095156966', '2023-09-12 15:16:11.105', '2023-09-12 15:16:11.105', NULL),
(9, '034e9759-8549-4ead-8aee-5ad221011631', 'Mind', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'b89cd4b7-6461-45aa-86e6-619095156966', '2023-09-12 15:16:20.172', '2023-09-12 15:16:20.172', NULL),
(10, 'e047524d-168e-490e-bb2c-65e38746cb0a', 'Interact', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '591df138-a12d-46d4-920d-f568e04c3587', '2023-09-12 15:16:38.911', '2023-09-12 15:16:38.911', NULL),
(11, 'c865ae55-1e67-48ce-91e7-33be40b568b1', 'Service', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '591df138-a12d-46d4-920d-f568e04c3587', '2023-09-12 15:16:48.687', '2023-09-12 15:16:48.687', NULL),
(12, '4d04218d-a35d-4167-8f2e-4abb8f4926d1', 'Communion', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '591df138-a12d-46d4-920d-f568e04c3587', '2023-09-12 15:16:59.330', '2023-09-12 15:16:59.330', NULL),
(13, 'ceb1ddbe-4150-41a8-8a2b-9c47db00c18e', 'Religious Studies', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'b89cd4b7-6461-45aa-86e6-619095156966', '2023-09-12 15:29:32.947', '2023-09-12 15:29:32.947', NULL),
(14, 'b262b316-e74f-4987-9a78-329ea023cc0e', 'ss', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '8ff4992a-62fd-4ddf-8136-f1a007c4543a', '2023-09-12 22:06:06.567', '2023-09-12 22:06:06.567', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sub_topics`
--

CREATE TABLE `sub_topics` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(100) NOT NULL,
  `name` varchar(60) NOT NULL,
  `user_number` varchar(40) NOT NULL,
  `topic_number` varchar(40) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sub_topics`
--

INSERT INTO `sub_topics` (`id`, `number`, `name`, `user_number`, `topic_number`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '431d8822-cb33-4ca1-909b-fa1b2ba19234', 'Scribbling', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '0a56dbf2-3c4e-465c-b3a9-3bbefef7a7f3', '2023-09-12 16:26:22.535', '2023-09-12 16:26:22.535', NULL),
(2, 'f2ee9f7b-1b02-4e68-abd5-c4f61111d509', 'Attempting to Write', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '0a56dbf2-3c4e-465c-b3a9-3bbefef7a7f3', '2023-09-12 16:26:42.098', '2023-09-12 16:26:42.098', NULL),
(3, '8989f303-8829-4969-91fc-1d72e5ab5c64', 'Familiarise \"Sticks\" Writing symbols', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '0a56dbf2-3c4e-465c-b3a9-3bbefef7a7f3', '2023-09-12 16:29:52.132', '2023-09-12 16:29:52.132', NULL),
(4, '5dba8533-f893-4793-be4c-fd154727606f', 'Familiarise \"Curves\" Writing symbols', '68127a1b-2c7b-4a92-8929-61a88d6ee790', '0a56dbf2-3c4e-465c-b3a9-3bbefef7a7f3', '2023-09-12 16:30:10.422', '2023-09-12 16:30:10.422', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

CREATE TABLE `topics` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(100) NOT NULL,
  `name` varchar(60) NOT NULL,
  `user_number` varchar(40) NOT NULL,
  `strand_number` varchar(40) NOT NULL,
  `class_number` varchar(40) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`id`, `number`, `name`, `user_number`, `strand_number`, `class_number`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '0a56dbf2-3c4e-465c-b3a9-3bbefef7a7f3', 'Beginning to Write and Draw', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'e751b371-b2ee-4e6c-9219-2a458bbd8709', '49b5277e-529b-41b1-9fbb-3f51837f07b7', '2023-09-12 15:51:50.455', '2023-09-12 15:51:50.455', NULL),
(2, 'ce053f54-edf8-4f0d-be6f-1887a8f4bfef', 'The Alphabet', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'e751b371-b2ee-4e6c-9219-2a458bbd8709', '49b5277e-529b-41b1-9fbb-3f51837f07b7', '2023-09-12 15:52:05.470', '2023-09-12 15:52:05.470', NULL),
(3, 'b02cff12-223a-468d-8914-ad49aad49aab', 'Sense of Sounds', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'e751b371-b2ee-4e6c-9219-2a458bbd8709', '49b5277e-529b-41b1-9fbb-3f51837f07b7', '2023-09-12 16:06:34.029', '2023-09-12 16:06:34.029', NULL),
(4, 'e0232145-ed76-41eb-a4d2-e567e06abc25', 'Sense of Words', '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'e751b371-b2ee-4e6c-9219-2a458bbd8709', '49b5277e-529b-41b1-9fbb-3f51837f07b7', '2023-09-12 16:07:00.046', '2023-09-12 16:07:00.046', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(100) NOT NULL,
  `first_name` varchar(60) NOT NULL,
  `second_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `gender` varchar(8) NOT NULL,
  `type` varchar(8) NOT NULL,
  `status` varchar(100) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `number`, `first_name`, `second_name`, `last_name`, `gender`, `type`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '68127a1b-2c7b-4a92-8929-61a88d6ee790', 'muyingo', 'steven', 'andy', 'Male', 'Admin', 'Active', '2023-08-22 09:17:51.042', '2023-08-22 12:07:04.890', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_passwords`
--

CREATE TABLE `user_passwords` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_number` varchar(100) NOT NULL,
  `user_password` varchar(70) NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_passwords`
--

INSERT INTO `user_passwords` (`id`, `user_number`, `user_password`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '68127a1b-2c7b-4a92-8929-61a88d6ee790', '$2a$12$MPX/XZ9mUsJ89Uj/WTYpMOHeU79U2KUZshc4fqB6fleGBBF3gYAK6', '2023-08-22 09:19:07.860', '2023-08-22 12:07:04.883', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `campuses`
--
ALTER TABLE `campuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `fk_campuses_user` (`user_number`),
  ADD KEY `fk_campuses_school` (`school_number`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `fk_classes_level` (`level_number`),
  ADD KEY `fk_classes_user` (`user_number`);

--
-- Indexes for table `concepts`
--
ALTER TABLE `concepts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `fk_concepts_sub_topic` (`sub_topic_number`),
  ADD KEY `fk_concepts_user` (`user_number`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contact` (`contact`),
  ADD UNIQUE KEY `contact_2` (`contact`),
  ADD KEY `idx_contacts_user_number` (`user_number`);

--
-- Indexes for table `learning_areas`
--
ALTER TABLE `learning_areas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `fk_learning_areas_user` (`user_number`);

--
-- Indexes for table `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `fk_campuses_level` (`campus_number`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`),
  ADD KEY `idx_password_resets_user_number` (`user_number`);

--
-- Indexes for table `schools`
--
ALTER TABLE `schools`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `fk_schools_user` (`user_number`);

--
-- Indexes for table `strands`
--
ALTER TABLE `strands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `fk_strands_subject` (`subject_number`),
  ADD KEY `fk_strands_user` (`user_number`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `fk_subjects_subject_cluster` (`subject_cluster_number`),
  ADD KEY `fk_subjects_user` (`user_number`);

--
-- Indexes for table `subject_class`
--
ALTER TABLE `subject_class`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`),
  ADD KEY `fk_subject_class_user` (`user_number`),
  ADD KEY `fk_subject_class_subject` (`subject_number`),
  ADD KEY `fk_subject_class_class` (`class_number`),
  ADD KEY `fk_subject_class_campus` (`campus_number`),
  ADD KEY `fk_subject_class_level` (`level_number`);

--
-- Indexes for table `subject_clusters`
--
ALTER TABLE `subject_clusters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `fk_subject_clusters_learning_area` (`learning_area_number`),
  ADD KEY `fk_subject_clusters_user` (`user_number`);

--
-- Indexes for table `sub_topics`
--
ALTER TABLE `sub_topics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `fk_sub_topics_topic` (`topic_number`),
  ADD KEY `fk_sub_topics_user` (`user_number`);

--
-- Indexes for table `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `fk_topics_user` (`user_number`),
  ADD KEY `fk_topics_strand` (`strand_number`),
  ADD KEY `fk_topics_class` (`class_number`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `number` (`number`);

--
-- Indexes for table `user_passwords`
--
ALTER TABLE `user_passwords`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_number` (`user_number`),
  ADD UNIQUE KEY `user_password` (`user_password`),
  ADD KEY `idx_user_passwords_user_number` (`user_number`),
  ADD KEY `idx_user_passwords_user_password` (`user_password`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `campuses`
--
ALTER TABLE `campuses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `concepts`
--
ALTER TABLE `concepts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `learning_areas`
--
ALTER TABLE `learning_areas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `levels`
--
ALTER TABLE `levels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `schools`
--
ALTER TABLE `schools`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `strands`
--
ALTER TABLE `strands`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `subject_class`
--
ALTER TABLE `subject_class`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subject_clusters`
--
ALTER TABLE `subject_clusters`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `sub_topics`
--
ALTER TABLE `sub_topics`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `topics`
--
ALTER TABLE `topics`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_passwords`
--
ALTER TABLE `user_passwords`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `campuses`
--
ALTER TABLE `campuses`
  ADD CONSTRAINT `fk_campuses_school` FOREIGN KEY (`school_number`) REFERENCES `schools` (`number`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_campuses_user` FOREIGN KEY (`user_number`) REFERENCES `users` (`number`) ON UPDATE CASCADE;

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `fk_classes_level` FOREIGN KEY (`level_number`) REFERENCES `levels` (`number`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_classes_user` FOREIGN KEY (`user_number`) REFERENCES `users` (`number`) ON UPDATE CASCADE;

--
-- Constraints for table `concepts`
--
ALTER TABLE `concepts`
  ADD CONSTRAINT `fk_concepts_sub_topic` FOREIGN KEY (`sub_topic_number`) REFERENCES `sub_topics` (`number`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_concepts_user` FOREIGN KEY (`user_number`) REFERENCES `users` (`number`) ON UPDATE CASCADE;

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `fk_users_contacts` FOREIGN KEY (`user_number`) REFERENCES `users` (`number`) ON UPDATE CASCADE;

--
-- Constraints for table `learning_areas`
--
ALTER TABLE `learning_areas`
  ADD CONSTRAINT `fk_learning_areas_user` FOREIGN KEY (`user_number`) REFERENCES `users` (`number`) ON UPDATE CASCADE;

--
-- Constraints for table `levels`
--
ALTER TABLE `levels`
  ADD CONSTRAINT `fk_campuses_level` FOREIGN KEY (`campus_number`) REFERENCES `campuses` (`number`) ON UPDATE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `fk_password_resets_user` FOREIGN KEY (`user_number`) REFERENCES `users` (`number`) ON UPDATE CASCADE;

--
-- Constraints for table `schools`
--
ALTER TABLE `schools`
  ADD CONSTRAINT `fk_schools_user` FOREIGN KEY (`user_number`) REFERENCES `users` (`number`) ON UPDATE CASCADE;

--
-- Constraints for table `strands`
--
ALTER TABLE `strands`
  ADD CONSTRAINT `fk_strands_subject` FOREIGN KEY (`subject_number`) REFERENCES `subjects` (`number`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_strands_user` FOREIGN KEY (`user_number`) REFERENCES `users` (`number`) ON UPDATE CASCADE;

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `fk_subjects_subject_cluster` FOREIGN KEY (`subject_cluster_number`) REFERENCES `subject_clusters` (`number`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_subjects_user` FOREIGN KEY (`user_number`) REFERENCES `users` (`number`) ON UPDATE CASCADE;

--
-- Constraints for table `subject_class`
--
ALTER TABLE `subject_class`
  ADD CONSTRAINT `fk_subject_class_campus` FOREIGN KEY (`campus_number`) REFERENCES `campuses` (`number`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_subject_class_class` FOREIGN KEY (`class_number`) REFERENCES `classes` (`number`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_subject_class_level` FOREIGN KEY (`level_number`) REFERENCES `levels` (`number`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_subject_class_subject` FOREIGN KEY (`subject_number`) REFERENCES `subjects` (`number`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_subject_class_user` FOREIGN KEY (`user_number`) REFERENCES `users` (`number`) ON UPDATE CASCADE;

--
-- Constraints for table `subject_clusters`
--
ALTER TABLE `subject_clusters`
  ADD CONSTRAINT `fk_subject_clusters_learning_area` FOREIGN KEY (`learning_area_number`) REFERENCES `learning_areas` (`number`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_subject_clusters_user` FOREIGN KEY (`user_number`) REFERENCES `users` (`number`) ON UPDATE CASCADE;

--
-- Constraints for table `sub_topics`
--
ALTER TABLE `sub_topics`
  ADD CONSTRAINT `fk_sub_topics_topic` FOREIGN KEY (`topic_number`) REFERENCES `topics` (`number`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sub_topics_user` FOREIGN KEY (`user_number`) REFERENCES `users` (`number`) ON UPDATE CASCADE;

--
-- Constraints for table `topics`
--
ALTER TABLE `topics`
  ADD CONSTRAINT `fk_topics_class` FOREIGN KEY (`class_number`) REFERENCES `classes` (`number`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_topics_strand` FOREIGN KEY (`strand_number`) REFERENCES `strands` (`number`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_topics_user` FOREIGN KEY (`user_number`) REFERENCES `users` (`number`) ON UPDATE CASCADE;

--
-- Constraints for table `user_passwords`
--
ALTER TABLE `user_passwords`
  ADD CONSTRAINT `fk_user_passwords_user` FOREIGN KEY (`user_number`) REFERENCES `users` (`number`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
