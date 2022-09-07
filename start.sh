#!/bin/bash

CONFIG_PATH="/usr/share/nginx/html/config.json"
CONFIG_LINE=""

echo "{" > $CONFIG_PATH

if [[ -n "${API_ENDPOINT}" ]];
then
  CONFIG_LINE="\"ApiEndpoint\": \"$API_ENDPOINT\","
else
  CONFIG_LINE="\"ApiEndpoint\": \"https://api.campus.kpi.ua/\","
fi

echo "$CONFIG_LINE" >> $CONFIG_PATH

if [[ -n "${OLD_UI_ADDRESS}" ]];
then
  CONFIG_LINE="\"OldUIAddress\": \"$OLD_UI_ADDRESS\","
else
  CONFIG_LINE="\"OldUIAddress\": \"https://campus.kpi.ua/\","
fi

echo "$CONFIG_LINE" >> $CONFIG_PATH

if [[ -n "${LOGIN_PAGE_ADDRESS_LINE}" ]];
then
  CONFIG_LINE="\"LoginPageAddress\": \"$LOGIN_PAGE_ADDRESS_LINE\""
else
  CONFIG_LINE="\"LoginPageAddress\": \"https://ecampus.kpi.ua/login\""
fi

echo "$CONFIG_LINE" >> $CONFIG_PATH
echo "}" >> $CONFIG_PATH
