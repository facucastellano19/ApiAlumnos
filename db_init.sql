-- Creación de la tabla de roles
CREATE TABLE `roles` (
  `rol_id` INT NOT NULL AUTO_INCREMENT,
  `rol_nombre` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`rol_id`),
  UNIQUE KEY `rol_nombre` (`rol_nombre`)
);

-- Inserción de roles iniciales
INSERT INTO `roles` (`rol_id`, `rol_nombre`) VALUES
(1, 'Administrador'),
(2, 'Coordinador'),
(3, 'Alumno');

-- Creación de la tabla de usuarios
CREATE TABLE `usuarios` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_nombre` VARCHAR(100) NOT NULL,
  `user_email` VARCHAR(100) NOT NULL,
  `user_usuario` VARCHAR(50) NOT NULL,
  `user_password` VARCHAR(255) NOT NULL,
  `user_rol_id` INT NOT NULL,
  `user_fecha_alta` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `user_usuario_alta` INT DEFAULT NULL,
  `user_fecha_modificacion` DATETIME NULL,
  `user_usuario_modificacion` INT NULL,
  `user_fecha_baja` DATETIME NULL,
  `user_usuario_baja` INT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email` (`user_email`),
  UNIQUE KEY `user_usuario` (`user_usuario`),
  KEY `user_rol_id` (`user_rol_id`),
  KEY `fk_usuarios_usuario_alta` (`user_usuario_alta`),
  KEY `fk_usuarios_usuario_modificacion` (`user_usuario_modificacion`),
  KEY `fk_usuarios_usuario_baja` (`user_usuario_baja`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`user_rol_id`) REFERENCES `roles` (`rol_id`),
  CONSTRAINT `fk_usuarios_usuario_alta` FOREIGN KEY (`user_usuario_alta`) REFERENCES `usuarios` (`user_id`),
  CONSTRAINT `fk_usuarios_usuario_baja` FOREIGN KEY (`user_usuario_baja`) REFERENCES `usuarios` (`user_id`),
  CONSTRAINT `fk_usuarios_usuario_modificacion` FOREIGN KEY (`user_usuario_modificacion`) REFERENCES `usuarios` (`user_id`)
);


-- Creación de la tabla de carreras
CREATE TABLE `carreras` (
  `carrera_id` INT NOT NULL AUTO_INCREMENT,
  `carrera_nombre` VARCHAR(100) NOT NULL,
  `carrera_fecha_alta` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `carrera_usuario_alta` INT DEFAULT NULL,
  `carrera_fecha_modificacion` DATETIME NULL,
  `carrera_usuario_modificacion` INT NULL,
  `carrera_fecha_baja` DATETIME NULL,
  `carrera_usuario_baja` INT NULL,
  PRIMARY KEY (`carrera_id`),
  UNIQUE KEY `carrera_nombre` (`carrera_nombre`),
  KEY `fk_carreras_usuario_alta` (`carrera_usuario_alta`),
  KEY `fk_carreras_usuario_modificacion` (`carrera_usuario_modificacion`),
  KEY `fk_carreras_usuario_baja` (`carrera_usuario_baja`),
  CONSTRAINT `fk_carreras_usuario_alta` FOREIGN KEY (`carrera_usuario_alta`) REFERENCES `usuarios` (`user_id`),
  CONSTRAINT `fk_carreras_usuario_baja` FOREIGN KEY (`carrera_usuario_baja`) REFERENCES `usuarios` (`user_id`),
  CONSTRAINT `fk_carreras_usuario_modificacion` FOREIGN KEY (`carrera_usuario_modificacion`) REFERENCES `usuarios` (`user_id`)
);

-- Inserción de carreras iniciales
INSERT INTO `carreras` VALUES (1,'Tecnicatura en Programación','2025-06-24 20:17:12',NULL,NULL,NULL,NULL,NULL);

-- Creación de la tabla de materias
CREATE TABLE `materias` (
  `materia_id` INT NOT NULL AUTO_INCREMENT,
  `materia_nombre` VARCHAR(100) NOT NULL,
  `materia_carrera_id` INT NOT NULL,
  `materia_fecha_alta` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `materia_usuario_alta` INT DEFAULT NULL,
  `materia_fecha_modificacion` DATETIME NULL,
  `materia_usuario_modificacion` INT NULL,
  `materia_fecha_baja` DATETIME NULL,
  `materia_usuario_baja` INT NULL,
  PRIMARY KEY (`materia_id`),
  UNIQUE KEY `unique_nombre_carrera` (`materia_nombre`,`materia_carrera_id`),
  KEY `materia_carrera_id` (`materia_carrera_id`),
  KEY `fk_materias_usuario_alta` (`materia_usuario_alta`),
  KEY `fk_materias_usuario_modificacion` (`materia_usuario_modificacion`),
  KEY `fk_materias_usuario_baja` (`materia_usuario_baja`),
  CONSTRAINT `materias_ibfk_1` FOREIGN KEY (`materia_carrera_id`) REFERENCES `carreras` (`carrera_id`),
  CONSTRAINT `fk_materias_usuario_alta` FOREIGN KEY (`materia_usuario_alta`) REFERENCES `usuarios` (`user_id`),
  CONSTRAINT `fk_materias_usuario_baja` FOREIGN KEY (`materia_usuario_baja`) REFERENCES `usuarios` (`user_id`),
  CONSTRAINT `fk_materias_usuario_modificacion` FOREIGN KEY (`materia_usuario_modificacion`) REFERENCES `usuarios` (`user_id`)
);

-- Inserción de materias iniciales
INSERT INTO `materias` VALUES 
(1,'Programación I',1,'2025-06-24 20:17:32',NULL,NULL,NULL,NULL,NULL),
(2,'Base de Datos',1,'2025-06-24 20:17:32',NULL,NULL,NULL,NULL,NULL),
(3,'Matemática Discreta',1,'2025-06-24 20:17:32',NULL,NULL,NULL,NULL,NULL);

-- Creación de la tabla de inscripciones
CREATE TABLE `inscripciones` (
  `insc_id` INT NOT NULL AUTO_INCREMENT,
  `insc_alumno_id` INT NOT NULL,
  `insc_materia_id` INT NOT NULL,
  `insc_fecha_alta` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `insc_usuario_alta` INT DEFAULT NULL,
  `insc_fecha_modificacion` DATETIME DEFAULT NULL,
  `insc_usuario_modificacion` INT DEFAULT NULL,
  `insc_fecha_baja` DATETIME NULL,
  `insc_usuario_baja` INT NULL,
  PRIMARY KEY (`insc_id`),
  UNIQUE KEY `insc_alumno_id` (`insc_alumno_id`,`insc_materia_id`),
  KEY `insc_materia_id` (`insc_materia_id`),
  KEY `fk_inscripciones_usuario_alta` (`insc_usuario_alta`),
  KEY `fk_inscripciones_usuario_modificacion` (`insc_usuario_modificacion`),
  KEY `fk_inscripciones_usuario_baja` (`insc_usuario_baja`),
  CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`insc_alumno_id`) REFERENCES `usuarios` (`user_id`),
  CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`insc_materia_id`) REFERENCES `materias` (`materia_id`),
  CONSTRAINT `fk_inscripciones_usuario_alta` FOREIGN KEY (`insc_usuario_alta`) REFERENCES `usuarios` (`user_id`),
  CONSTRAINT `fk_inscripciones_usuario_baja` FOREIGN KEY (`insc_usuario_baja`) REFERENCES `usuarios` (`user_id`),
  CONSTRAINT `fk_inscripciones_usuario_modificacion` FOREIGN KEY (`insc_usuario_modificacion`) REFERENCES `usuarios` (`user_id`)
);
 