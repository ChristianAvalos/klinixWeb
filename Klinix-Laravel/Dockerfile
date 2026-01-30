FROM php:8.5-apache

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gnupg2 \
    curl \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libssl-dev \
    libcurl4-openssl-dev \
    libpq-dev \
    apt-transport-https \
    lsb-release \
    ca-certificates \
    && docker-php-ext-install zip pdo pdo_mysql pdo_pgsql

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer


# Agregar repositorio de Microsoft para ODBC + Drivers de SQL Server
# RUN curl -sS https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | tee /etc/apt/trusted.gpg.d/microsoft.gpg >/dev/null && \
#     curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
#     apt-get update && ACCEPT_EULA=Y apt-get install -y \
#         msodbcsql18 \
#         unixodbc-dev \
#     && pecl install pdo_sqlsrv \
#     && pecl install sqlsrv \
#     && docker-php-ext-enable pdo_sqlsrv sqlsrv

# Habilitar mod_rewrite (Laravel lo requiere)
RUN a2enmod rewrite

# Copiar el código de Laravel
COPY . /var/www/html

COPY .env /var/www/html/.env

# Asegurar directorios requeridos por Laravel (y permisos) antes de ejecutar scripts de Composer
RUN mkdir -p \
        /var/www/html/bootstrap/cache \
        /var/www/html/storage/framework/cache \
        /var/www/html/storage/framework/sessions \
        /var/www/html/storage/framework/views \
        /var/www/html/storage/logs \
    && chown -R www-data:www-data /var/www/html/bootstrap/cache /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache /var/www/html/storage

# Instalar dependencias de Composer
RUN composer install --no-dev --optimize-autoloader

# Generar APP_KEY
RUN php artisan key:generate

# Establecer permisos adecuados
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/bootstrap/cache /var/www/html/storage

# Establecer el DocumentRoot en /var/www/html/public
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|' /etc/apache2/sites-available/000-default.conf


EXPOSE 80