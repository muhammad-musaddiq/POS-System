#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
if [ -e .env.docker ]; then
    exit 0
fi
umask 077
# Hex values are safe in both Compose interpolation and database URLs.
db_password=$(openssl rand -hex 24)
secret_key=$(openssl rand -hex 48)
admin_password=$(openssl rand -hex 16)
# Noclobber also protects an existing configuration during concurrent startup.
(set -C; cat > .env.docker <<ENV
PROJECT_NAME="POS System"
ENVIRONMENT=development
DEBUG=false
POSTGRES_PASSWORD=$db_password
SECRET_KEY=$secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=$admin_password
ADMIN_NAME=Administrator
DB_PORT=5434
BACKEND_PORT=8001
FRONTEND_PORT=5174
ENV
)
printf '%s\n' 'Created .env.docker with random local credentials. View it to get your login password.'
