.DEFAULT_GOAL := help
COMPOSE = docker compose --env-file .env.docker

.PHONY: help init up down restart logs ps migrate test
help:
	@echo 'make up       Build and start database, migrations, API and frontend'
	@echo 'make down     Stop containers (preserve database and uploads)'
	@echo 'make restart  Restart application containers'
	@echo 'make logs     Follow container logs'
	@echo 'make ps       Show service status'
	@echo 'make test     Run backend and frontend checks in containers'

init:
	@sh docker/init-env.sh

up: init
	$(COMPOSE) build
	$(COMPOSE) up -d --no-build --wait --wait-timeout 180
	@echo 'Frontend: http://localhost:5174 (or FRONTEND_PORT in .env.docker)'
	@echo 'API docs: http://localhost:8001/docs (or BACKEND_PORT in .env.docker)'
	@echo 'Login credentials: .env.docker'

down: init
	$(COMPOSE) down

restart: init
	$(COMPOSE) restart backend frontend

logs: init
	$(COMPOSE) logs -f --tail=100

ps: init
	$(COMPOSE) ps -a

migrate: init
	$(COMPOSE) run --rm migrate

test: init
	$(COMPOSE) run --rm --no-deps backend python -m pytest -q
	$(COMPOSE) run --rm --no-deps frontend npm run typecheck
	$(COMPOSE) run --rm --no-deps frontend npm test
	$(COMPOSE) run --rm --no-deps frontend npm run build
