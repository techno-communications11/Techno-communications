#!/bin/bash

# Configuration
CONTAINER_NAME="mysqldb"
DB_NAME="hiring-portal"
BACKUP_DIR="/database_backups"  # Adjust this if the backup directory path is different
TIMESTAMP=$(date +"%F_%H-%M-%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Run mysqldump inside the Docker container
docker exec ${CONTAINER_NAME} mysqldump -u root -proot ${DB_NAME} > ${BACKUP_FILE}

# Optionally, compress the backup file
gzip ${BACKUP_FILE}

# Remove backups older than 3 hours (180 minutes)
find ${BACKUP_DIR} -type f -name "*.sql.gz" -mmin +180 -exec rm {} \;
