.PHONY: start-dev
start-dev:
	docker compose -f docker/dev/docker-compose.yaml up -d

.PHONY: stop-dev
stop-dev:
	docker compose -f docker/dev/docker-compose.yaml down
