# USCLink
Necesario:
npm install react-router-dom

Meter datos a las tablas de permisos, roles y demás; para que funcione la autenticación

INSERT INTO permissions(id, resource, action) VALUES
('users:read', 'users', 'read'),
('users:create', 'users', 'create'),
('users:update', 'users', 'update'),
('users:delete', 'users', 'delete'),
('books:read', 'books', 'read'),
('books:create', 'books', 'create'),
('books:update', 'books', 'update'),
('books:delete', 'books', 'delete');

INSERT INTO roles(rolename) VALUES
('ADMIN'),
('USER');

INSERT INTO role_hierarchy(role, includes) VALUES
('ADMIN', 'USER');

INSERT INTO role_permissions(role, permission) VALUES
('USER', 'users:read'),
('USER', 'books:read'),
('ADMIN', 'users:create'),
('ADMIN', 'users:update'),
('ADMIN', 'users:delete'),
('ADMIN', 'books:create'),
('ADMIN', 'books:update'),
('ADMIN', 'books:delete');



TODO LIST:
Gestor de errores
Solucionar que puedas ver todos los chats - Abel ¿Está Hecho?
Comentarios
Autenticación
Excepciones tokens (Ánimo dani!)
Revisar los push para cambiar de página

Checkear al crear grupo los usuarios - Abel

Añadir cerrar sesion

Hecho:
