ALTER USER 'mysql_user'@'%' IDENTIFIED WITH mysql_native_password BY 'mysql_password';
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'mysql_root_password';
FLUSH PRIVILEGES;
