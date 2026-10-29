# Переменные для удобства
DC = docker compose

.PHONY: up down restart logs status shell psql help

help:
	@echo "Доступные команды:"
	@echo "  make up       - Запустить контейнер в фоновом режиме"
	@echo "  make down     - Остановить и удалить контейнеры и сети"
	@echo "  make restart  - Перезапустить базу данных"
	@echo "  make logs     - Посмотреть логи в реальном времени"
	@echo "  make status   - Проверить статус контейнера и healthcheck"
	@echo "  make shell    - Войти внутрь контейнера Postgres"
	@echo "  make psql    - Войти внутрь контейнера Postgres"

# Запуск контейнера в фоне (-d)
up:
	$(DC) up -d

# Остановка контейнера
down:
	$(DC) down

# Перезапуск
restart:
	$(DC) restart

# Просмотр логов (-f — следовать за новыми логами)
logs:
	$(DC) logs -f

# Проверить статус (включая ваш healthcheck)
status:
	$(DC) ps

# Быстрый вход в терминал контейнера
shell:
	$(DC) exec -it db sh

psql:
	$(DC) exec db psql -U postgres -d f1
