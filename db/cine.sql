-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-02-2026 a las 03:44:10
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cine`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asientos`
--

CREATE TABLE `asientos` (
  `id_asiento` int(11) NOT NULL,
  `nombre` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asientos`
--

INSERT INTO `asientos` (`id_asiento`, `nombre`) VALUES
(1, 'A1'),
(2, 'A2'),
(3, 'A3'),
(4, 'A4'),
(5, 'B1'),
(6, 'B2'),
(7, 'B3'),
(8, 'C1'),
(9, 'C2'),
(10, 'D1'),
(11, 'E1'),
(12, 'E2'),
(13, 'E3'),
(14, 'E4'),
(15, 'E5'),
(16, 'E6'),
(17, 'F1'),
(18, 'F2'),
(19, 'F3'),
(20, 'F4'),
(21, 'G1'),
(22, 'G2'),
(23, 'G3'),
(24, 'G4'),
(25, 'G5'),
(26, 'H1'),
(27, 'H2'),
(28, 'H3'),
(29, 'I1'),
(30, 'I2'),
(31, 'J1'),
(32, 'J2'),
(33, 'J3'),
(34, 'J4'),
(35, 'J5'),
(36, 'J6'),
(37, 'J7'),
(38, 'J8'),
(39, 'K1'),
(40, 'K2'),
(41, 'K3'),
(42, 'K4');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`) VALUES
(1, 'Acción'),
(2, 'Ciencia Ficción'),
(3, 'Drama'),
(4, 'Comedia'),
(5, 'Aventura');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clasificacion_peliculas`
--

CREATE TABLE `clasificacion_peliculas` (
  `id_clasificacion` int(11) NOT NULL,
  `nombre` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clasificacion_peliculas`
--

INSERT INTO `clasificacion_peliculas` (`id_clasificacion`, `nombre`) VALUES
(1, 'PG-13'),
(2, 'R'),
(3, 'G'),
(4, 'PG'),
(5, 'NC-17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entradas`
--

CREATE TABLE `entradas` (
  `id_entrada` int(11) NOT NULL,
  `id_venta` int(11) DEFAULT NULL,
  `id_funcion` int(11) DEFAULT NULL,
  `id_asiento` int(10) NOT NULL,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `entradas`
--

INSERT INTO `entradas` (`id_entrada`, `id_venta`, `id_funcion`, `id_asiento`, `precio`) VALUES
(1, 1, 1, 1, 12.50),
(2, 1, 1, 2, 12.50),
(3, 1, 1, 3, 12.50),
(4, 1, 1, 4, 12.50),
(5, 2, 2, 5, 12.50),
(6, 2, 2, 6, 12.50),
(7, 2, 2, 7, 12.50),
(8, 3, 3, 8, 12.50),
(9, 3, 3, 9, 12.50),
(10, 4, 4, 10, 12.50),
(11, 5, 5, 11, 12.50),
(12, 5, 5, 12, 12.50),
(13, 5, 5, 13, 12.50),
(14, 5, 5, 14, 12.50),
(15, 5, 5, 15, 12.50),
(16, 5, 5, 16, 12.50),
(17, 6, 6, 17, 12.50),
(18, 6, 6, 18, 12.50),
(19, 6, 6, 19, 12.50),
(20, 6, 6, 20, 12.50),
(21, 7, 7, 21, 12.50),
(22, 7, 7, 22, 12.50),
(23, 7, 7, 23, 12.50),
(24, 7, 7, 24, 12.50),
(25, 7, 7, 25, 12.50),
(26, 8, 8, 26, 12.50),
(27, 8, 8, 27, 12.50),
(28, 8, 8, 28, 12.50),
(29, 9, 9, 29, 12.50),
(30, 9, 9, 30, 12.50),
(31, 10, 10, 31, 12.50),
(32, 10, 10, 32, 12.50),
(33, 10, 10, 33, 12.50),
(34, 10, 10, 34, 12.50),
(35, 10, 10, 35, 12.50),
(36, 10, 10, 36, 12.50),
(37, 10, 10, 37, 12.50),
(38, 10, 10, 38, 12.50),
(39, 11, 11, 39, 12.50),
(40, 11, 11, 40, 12.50),
(41, 11, 11, 41, 12.50),
(42, 11, 11, 42, 12.50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `funciones`
--

CREATE TABLE `funciones` (
  `id_funcion` int(11) NOT NULL,
  `id_pelicula` int(11) DEFAULT NULL,
  `id_sala` int(11) DEFAULT NULL,
  `fecha_hora` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `funciones`
--

INSERT INTO `funciones` (`id_funcion`, `id_pelicula`, `id_sala`, `fecha_hora`) VALUES
(1, 1, 1, '2023-10-01 18:00:00'),
(2, 1, 2, '2023-10-02 20:00:00'),
(3, 2, 3, '2023-10-03 19:30:00'),
(4, 3, 4, '2023-10-04 17:00:00'),
(5, 4, 1, '2023-10-05 21:00:00'),
(6, 5, 2, '2023-10-06 15:00:00'),
(7, 6, 3, '2023-10-07 19:00:00'),
(8, 7, 4, '2023-10-08 18:30:00'),
(9, 8, 1, '2023-10-09 20:00:00'),
(10, 1, 3, '2023-10-10 19:00:00'),
(11, 2, 4, '2023-10-11 17:30:00'),
(12, 1, 2, '2025-08-14 19:52:00'),
(13, 1, 1, '2025-08-04 17:27:00'),
(14, 2, 2, '2025-08-15 17:29:00'),
(15, 2, 2, '2025-08-17 18:37:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodos_pago`
--

CREATE TABLE `metodos_pago` (
  `id_metodo` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodos_pago`
--

INSERT INTO `metodos_pago` (`id_metodo`, `nombre`) VALUES
(1, 'Transferencia Bancaria'),
(2, 'Tarjeta de Crédito'),
(3, 'Efectivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peliculas`
--

CREATE TABLE `peliculas` (
  `id_pelicula` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `anio` int(11) DEFAULT NULL,
  `duracion` int(11) DEFAULT NULL,
  `id_clasificacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `peliculas`
--

INSERT INTO `peliculas` (`id_pelicula`, `titulo`, `anio`, `duracion`, `id_clasificacion`) VALUES
(1, 'Avengers: Endgame', 2019, 181, 1),
(2, 'Interstellar', 2014, 169, 1),
(3, 'The Shawshank Redemption', 1994, 142, 2),
(4, 'Deadpool', 2016, 108, 2),
(5, 'Jurassic Park', 1993, 127, 1),
(6, 'Inception', 2010, 148, 1),
(7, 'The Matrix', 1999, 136, 2),
(8, 'Forrest Gump', 1994, 142, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peliculas_categorias`
--

CREATE TABLE `peliculas_categorias` (
  `id_pelicula_categoria` int(11) NOT NULL,
  `id_pelicula` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `peliculas_categorias`
--

INSERT INTO `peliculas_categorias` (`id_pelicula_categoria`, `id_pelicula`, `id_categoria`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 2),
(4, 2, 3),
(5, 3, 3),
(6, 4, 1),
(7, 4, 4),
(8, 5, 2),
(9, 5, 5),
(10, 6, 1),
(11, 6, 2),
(12, 7, 1),
(13, 7, 2),
(14, 8, 3),
(15, 8, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `en_stock` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `cantidad`, `precio_unitario`, `en_stock`) VALUES
(1, 'cotufas', 50, 10.00, 1),
(2, 'samba', 50, 2.00, 1),
(3, 'refresco', 50, 8.00, 1),
(4, 'combo tequeños', 25, 5.00, 1),
(5, 'cocosete', 50, 5.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salas`
--

CREATE TABLE `salas` (
  `id_sala` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `capacidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `salas`
--

INSERT INTO `salas` (`id_sala`, `nombre`, `capacidad`) VALUES
(1, 'Sala IMAX', 200),
(2, 'Sala VIP', 100),
(3, 'Sala 3D', 150),
(4, 'Sala Estándar', 120),
(5, 'Sala 2 ', 10),
(6, 'Sala 3 ', 50),
(7, 'Sala 4', 122),
(8, 'Sala 5', 121);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` int(11) NOT NULL,
  `id_metodo` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id_venta`, `id_metodo`, `fecha`, `total`) VALUES
(1, 1, '2023-10-01 17:50:00', 50.00),
(2, 2, '2023-10-02 19:45:00', 37.50),
(3, 3, '2023-10-03 19:20:00', 25.00),
(4, 1, '2023-10-04 16:50:00', 12.50),
(5, 2, '2023-10-05 20:50:00', 75.00),
(6, 3, '2023-10-06 14:45:00', 50.00),
(7, 1, '2023-10-07 18:50:00', 62.50),
(8, 2, '2023-10-08 18:20:00', 37.50),
(9, 3, '2023-10-09 19:50:00', 25.00),
(10, 1, '2023-10-10 18:45:00', 100.00),
(11, 2, '2023-10-11 17:20:00', 50.00),
(12, 1, '2026-01-01 17:50:00', 20.00),
(13, 2, '2026-01-02 19:45:00', 4.00),
(14, 3, '2026-01-03 19:20:00', 40.00),
(15, 1, '2026-01-04 16:50:00', 10.00),
(16, 2, '2026-01-05 20:50:00', 20.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas_productos`
--

CREATE TABLE `ventas_productos` (
  `id_venta_producto` int(11) NOT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `id_venta` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas_productos`
--

INSERT INTO `ventas_productos` (`id_venta_producto`, `id_producto`, `id_venta`, `cantidad`, `subtotal`) VALUES
(1, 1, 12, 2, 20.00),
(2, 2, 13, 2, 4.00),
(3, 3, 14, 5, 40.00),
(4, 4, 15, 2, 10.00),
(5, 5, 16, 4, 20.00);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asientos`
--
ALTER TABLE `asientos`
  ADD PRIMARY KEY (`id_asiento`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `clasificacion_peliculas`
--
ALTER TABLE `clasificacion_peliculas`
  ADD PRIMARY KEY (`id_clasificacion`);

--
-- Indices de la tabla `entradas`
--
ALTER TABLE `entradas`
  ADD PRIMARY KEY (`id_entrada`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_funcion` (`id_funcion`),
  ADD KEY `id_asiento` (`id_asiento`);

--
-- Indices de la tabla `funciones`
--
ALTER TABLE `funciones`
  ADD PRIMARY KEY (`id_funcion`),
  ADD KEY `id_pelicula` (`id_pelicula`),
  ADD KEY `id_sala` (`id_sala`);

--
-- Indices de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD PRIMARY KEY (`id_metodo`);

--
-- Indices de la tabla `peliculas`
--
ALTER TABLE `peliculas`
  ADD PRIMARY KEY (`id_pelicula`),
  ADD KEY `id_clasificacion` (`id_clasificacion`);

--
-- Indices de la tabla `peliculas_categorias`
--
ALTER TABLE `peliculas_categorias`
  ADD PRIMARY KEY (`id_pelicula_categoria`),
  ADD KEY `id_pelicula` (`id_pelicula`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `salas`
--
ALTER TABLE `salas`
  ADD PRIMARY KEY (`id_sala`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `id_metodo` (`id_metodo`);

--
-- Indices de la tabla `ventas_productos`
--
ALTER TABLE `ventas_productos`
  ADD PRIMARY KEY (`id_venta_producto`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_venta` (`id_venta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asientos`
--
ALTER TABLE `asientos`
  MODIFY `id_asiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `clasificacion_peliculas`
--
ALTER TABLE `clasificacion_peliculas`
  MODIFY `id_clasificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `entradas`
--
ALTER TABLE `entradas`
  MODIFY `id_entrada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `funciones`
--
ALTER TABLE `funciones`
  MODIFY `id_funcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id_metodo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `peliculas`
--
ALTER TABLE `peliculas`
  MODIFY `id_pelicula` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `peliculas_categorias`
--
ALTER TABLE `peliculas_categorias`
  MODIFY `id_pelicula_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `salas`
--
ALTER TABLE `salas`
  MODIFY `id_sala` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `ventas_productos`
--
ALTER TABLE `ventas_productos`
  MODIFY `id_venta_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `entradas`
--
ALTER TABLE `entradas`
  ADD CONSTRAINT `entradas_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE,
  ADD CONSTRAINT `entradas_ibfk_2` FOREIGN KEY (`id_funcion`) REFERENCES `funciones` (`id_funcion`),
  ADD CONSTRAINT `entradas_ibfk_3` FOREIGN KEY (`id_asiento`) REFERENCES `asientos` (`id_asiento`);

--
-- Filtros para la tabla `funciones`
--
ALTER TABLE `funciones`
  ADD CONSTRAINT `funciones_ibfk_1` FOREIGN KEY (`id_pelicula`) REFERENCES `peliculas` (`id_pelicula`),
  ADD CONSTRAINT `funciones_ibfk_2` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`);

--
-- Filtros para la tabla `peliculas`
--
ALTER TABLE `peliculas`
  ADD CONSTRAINT `peliculas_ibfk_1` FOREIGN KEY (`id_clasificacion`) REFERENCES `clasificacion_peliculas` (`id_clasificacion`);

--
-- Filtros para la tabla `peliculas_categorias`
--
ALTER TABLE `peliculas_categorias`
  ADD CONSTRAINT `peliculas_categorias_ibfk_1` FOREIGN KEY (`id_pelicula`) REFERENCES `peliculas` (`id_pelicula`) ON DELETE CASCADE,
  ADD CONSTRAINT `peliculas_categorias_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_metodo`) REFERENCES `metodos_pago` (`id_metodo`);

--
-- Filtros para la tabla `ventas_productos`
--
ALTER TABLE `ventas_productos`
  ADD CONSTRAINT `ventas_productos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `ventas_productos_ibfk_2` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
