-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jun 04, 2017 at 08:39 AM
-- Server version: 5.7.9
-- PHP Version: 5.6.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wrldc_wind_info`
--

-- --------------------------------------------------------

--
-- Table structure for table `dark_sky_wind_speeds`
--

DROP TABLE IF EXISTS `dark_sky_wind_speeds`;
CREATE TABLE IF NOT EXISTS `dark_sky_wind_speeds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `location_tag` varchar(100) NOT NULL,
  `wind_speed` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `time` (`time`,`location_tag`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `dark_sky_wind_speeds`
--

INSERT INTO `dark_sky_wind_speeds` (`id`, `time`, `location_tag`, `wind_speed`) VALUES
(1, '2017-05-31 00:00:00', 'VADODARA', 1374),
(2, '2017-05-31 01:00:00', 'VADODARA', 1185),
(3, '2017-05-31 02:00:00', 'VADODARA', 1152),
(4, '2017-05-31 03:00:00', 'VADODARA', 1325),
(5, '2017-05-31 04:00:00', 'VADODARA', 1037),
(6, '2017-05-31 05:00:00', 'VADODARA', 954),
(7, '2017-05-31 06:00:00', 'VADODARA', 1027),
(8, '2017-05-31 07:00:00', 'VADODARA', 1074),
(9, '2017-05-31 08:00:00', 'VADODARA', 1084),
(10, '2017-05-31 09:00:00', 'VADODARA', 1136),
(11, '2017-05-31 10:00:00', 'VADODARA', 1321),
(12, '2017-05-31 11:00:00', 'VADODARA', 1231),
(13, '2017-05-31 12:00:00', 'VADODARA', 1341),
(14, '2017-05-31 13:00:00', 'VADODARA', 1338),
(15, '2017-05-31 14:00:00', 'VADODARA', 1387),
(16, '2017-05-31 15:00:00', 'VADODARA', 1384),
(17, '2017-05-31 16:00:00', 'VADODARA', 1277),
(18, '2017-05-31 17:00:00', 'VADODARA', 1351),
(19, '2017-05-31 18:00:00', 'VADODARA', 1274),
(20, '2017-05-31 19:00:00', 'VADODARA', 1472),
(21, '2017-05-31 20:00:00', 'VADODARA', 1373),
(22, '2017-05-31 21:00:00', 'VADODARA', 1277),
(23, '2017-05-31 22:00:00', 'VADODARA', 1305),
(24, '2017-05-31 23:00:00', 'VADODARA', 1110);

-- --------------------------------------------------------

--
-- Table structure for table `dark_sky_wind_speeds_forecast`
--

DROP TABLE IF EXISTS `dark_sky_wind_speeds_forecast`;
CREATE TABLE IF NOT EXISTS `dark_sky_wind_speeds_forecast` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `location_tag` varchar(100) NOT NULL,
  `wind_speed` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `time` (`time`,`location_tag`)
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `dark_sky_wind_speeds_forecast`
--

INSERT INTO `dark_sky_wind_speeds_forecast` (`id`, `time`, `location_tag`, `wind_speed`) VALUES
(1, '2017-06-04 13:00:00', 'MUMBAI', 1256),
(2, '2017-06-04 14:00:00', 'MUMBAI', 1316),
(3, '2017-06-04 15:00:00', 'MUMBAI', 1352),
(4, '2017-06-04 16:00:00', 'MUMBAI', 1365),
(5, '2017-06-04 17:00:00', 'MUMBAI', 1357),
(6, '2017-06-04 18:00:00', 'MUMBAI', 1327),
(7, '2017-06-04 19:00:00', 'MUMBAI', 1276),
(8, '2017-06-04 20:00:00', 'MUMBAI', 1231),
(9, '2017-06-04 21:00:00', 'MUMBAI', 1195),
(10, '2017-06-04 22:00:00', 'MUMBAI', 1161),
(11, '2017-06-04 23:00:00', 'MUMBAI', 1123),
(12, '2017-06-05 00:00:00', 'MUMBAI', 1083),
(13, '2017-06-05 01:00:00', 'MUMBAI', 1039),
(14, '2017-06-05 02:00:00', 'MUMBAI', 992),
(15, '2017-06-05 03:00:00', 'MUMBAI', 942),
(16, '2017-06-05 04:00:00', 'MUMBAI', 876),
(17, '2017-06-05 05:00:00', 'MUMBAI', 826),
(18, '2017-06-05 06:00:00', 'MUMBAI', 825),
(19, '2017-06-05 07:00:00', 'MUMBAI', 876),
(20, '2017-06-05 08:00:00', 'MUMBAI', 939),
(21, '2017-06-05 09:00:00', 'MUMBAI', 978),
(22, '2017-06-05 10:00:00', 'MUMBAI', 1005),
(23, '2017-06-05 11:00:00', 'MUMBAI', 1035),
(24, '2017-06-05 12:00:00', 'MUMBAI', 1081),
(25, '2017-06-05 13:00:00', 'MUMBAI', 1154),
(26, '2017-06-05 14:00:00', 'MUMBAI', 1228),
(27, '2017-06-05 15:00:00', 'MUMBAI', 1265),
(28, '2017-06-05 16:00:00', 'MUMBAI', 1262),
(29, '2017-06-05 17:00:00', 'MUMBAI', 1240),
(30, '2017-06-05 18:00:00', 'MUMBAI', 1213),
(31, '2017-06-05 19:00:00', 'MUMBAI', 1174),
(32, '2017-06-05 20:00:00', 'MUMBAI', 1135),
(33, '2017-06-05 21:00:00', 'MUMBAI', 1105),
(34, '2017-06-05 22:00:00', 'MUMBAI', 1087),
(35, '2017-06-05 23:00:00', 'MUMBAI', 1068),
(36, '2017-06-06 00:00:00', 'MUMBAI', 1032),
(37, '2017-06-06 01:00:00', 'MUMBAI', 975),
(38, '2017-06-06 02:00:00', 'MUMBAI', 926),
(39, '2017-06-06 03:00:00', 'MUMBAI', 911),
(40, '2017-06-06 04:00:00', 'MUMBAI', 924),
(41, '2017-06-06 05:00:00', 'MUMBAI', 944),
(42, '2017-06-06 06:00:00', 'MUMBAI', 952),
(43, '2017-06-06 07:00:00', 'MUMBAI', 946),
(44, '2017-06-06 08:00:00', 'MUMBAI', 952),
(45, '2017-06-06 09:00:00', 'MUMBAI', 998),
(46, '2017-06-06 10:00:00', 'MUMBAI', 1098),
(47, '2017-06-06 11:00:00', 'MUMBAI', 1195),
(48, '2017-06-06 12:00:00', 'MUMBAI', 1235),
(49, '2017-06-06 13:00:00', 'MUMBAI', 1244),
(99, '2017-06-04 13:00:00', 'VADODARA', 1256),
(100, '2017-06-04 14:00:00', 'VADODARA', 1316),
(101, '2017-06-04 15:00:00', 'VADODARA', 1352),
(102, '2017-06-04 16:00:00', 'VADODARA', 1365),
(103, '2017-06-04 17:00:00', 'VADODARA', 1357),
(104, '2017-06-04 18:00:00', 'VADODARA', 1327),
(105, '2017-06-04 19:00:00', 'VADODARA', 1276),
(106, '2017-06-04 20:00:00', 'VADODARA', 1231),
(107, '2017-06-04 21:00:00', 'VADODARA', 1195),
(108, '2017-06-04 22:00:00', 'VADODARA', 1161),
(109, '2017-06-04 23:00:00', 'VADODARA', 1123),
(110, '2017-06-05 00:00:00', 'VADODARA', 1083),
(111, '2017-06-05 01:00:00', 'VADODARA', 1039),
(112, '2017-06-05 02:00:00', 'VADODARA', 992),
(113, '2017-06-05 03:00:00', 'VADODARA', 942),
(114, '2017-06-05 04:00:00', 'VADODARA', 876),
(115, '2017-06-05 05:00:00', 'VADODARA', 826),
(116, '2017-06-05 06:00:00', 'VADODARA', 825),
(117, '2017-06-05 07:00:00', 'VADODARA', 876),
(118, '2017-06-05 08:00:00', 'VADODARA', 939),
(119, '2017-06-05 09:00:00', 'VADODARA', 978),
(120, '2017-06-05 10:00:00', 'VADODARA', 1005),
(121, '2017-06-05 11:00:00', 'VADODARA', 1035),
(122, '2017-06-05 12:00:00', 'VADODARA', 1081),
(123, '2017-06-05 13:00:00', 'VADODARA', 1154),
(124, '2017-06-05 14:00:00', 'VADODARA', 1228),
(125, '2017-06-05 15:00:00', 'VADODARA', 1265),
(126, '2017-06-05 16:00:00', 'VADODARA', 1262),
(127, '2017-06-05 17:00:00', 'VADODARA', 1240),
(128, '2017-06-05 18:00:00', 'VADODARA', 1213),
(129, '2017-06-05 19:00:00', 'VADODARA', 1174),
(130, '2017-06-05 20:00:00', 'VADODARA', 1135),
(131, '2017-06-05 21:00:00', 'VADODARA', 1105),
(132, '2017-06-05 22:00:00', 'VADODARA', 1087),
(133, '2017-06-05 23:00:00', 'VADODARA', 1068),
(134, '2017-06-06 00:00:00', 'VADODARA', 1032),
(135, '2017-06-06 01:00:00', 'VADODARA', 975),
(136, '2017-06-06 02:00:00', 'VADODARA', 926),
(137, '2017-06-06 03:00:00', 'VADODARA', 911),
(138, '2017-06-06 04:00:00', 'VADODARA', 924),
(139, '2017-06-06 05:00:00', 'VADODARA', 944),
(140, '2017-06-06 06:00:00', 'VADODARA', 952),
(141, '2017-06-06 07:00:00', 'VADODARA', 946),
(142, '2017-06-06 08:00:00', 'VADODARA', 952),
(143, '2017-06-06 09:00:00', 'VADODARA', 998),
(144, '2017-06-06 10:00:00', 'VADODARA', 1098),
(145, '2017-06-06 11:00:00', 'VADODARA', 1195),
(146, '2017-06-06 12:00:00', 'VADODARA', 1235),
(147, '2017-06-06 13:00:00', 'VADODARA', 1244);

-- --------------------------------------------------------

--
-- Table structure for table `wind_generations`
--

DROP TABLE IF EXISTS `wind_generations`;
CREATE TABLE IF NOT EXISTS `wind_generations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `location_tag` varchar(100) NOT NULL,
  `generation_mw` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;