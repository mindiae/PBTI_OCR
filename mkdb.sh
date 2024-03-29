#!/usr/bin/env bash

ls src/books/*.csv | awk -F"/" '{print $3}' | sed 's/\.csv//'|xargs -I {} pnpm build {}

cat output/verses/* >output/verses.csv
cat output/stories/* >output/stories.csv

# Specify the path to your SQLite database
DB_PATH="output/database/PBTI.SQLite3"

# Empty the tables
sqlite3 $DB_PATH <<EOF
DELETE FROM verses;
DELETE FROM stories;
EOF

cat output/verses.csv | tr "'" '"' >/tmp/verses.csv
cat output/stories.csv | tr "'" '"' >/tmp/stories.csv

# Load data from CSV files into the tables
sqlite3 $DB_PATH <<EOF
.mode csv
.import /tmp/verses.csv verses
.import /tmp/stories.csv stories
EOF
