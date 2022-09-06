#!/bin/bash

echo '{' > /usr/share/nginx/html/config.json

if [[ -n "${API_ENDPOINT}" ]];
then
  CONFIG_LINE="\"ApiEndpoint\": \"$API_ENDPOINT\","
  echo "$CONFIG_LINE" >> /usr/share/nginx/html/config.json
else
  CONFIG_LINE="\"ApiEndpoint\": \"https://api.campus.kpi.ua/\","
  echo "$CONFIG_LINE" >> /usr/share/nginx/html/config.json
fi


if [[ -n "${OLD_UI_ADDRESS}" ]];
then
  CONFIG_LINE="\"OldUIAddress\": \"$OLD_UI_ADDRESS\","
  echo "$CONFIG_LINE" >> /usr/share/nginx/html/config.json
else
  CONFIG_LINE="\"OldUIAddress\": \"https://campus.kpi.ua/\","
  echo "$CONFIG_LINE" >> /usr/share/nginx/html/config.json
fi


if [[ -n "${LOGIN_PAGE_ADDRESS_LINE}" ]];
then
  CONFIG_LINE_3="\"LoginPageAddress\": \"$LOGIN_PAGE_ADDRESS_LINE\""
  echo "$CONFIG_LINE_3" >> /usr/share/nginx/html/config.json
else
  CONFIG_LINE="\"LoginPageAddress\": \"https://ecampus.kpi.ua/login\""
  echo "$CONFIG_LINE" >> /usr/share/nginx/html/config.json
fi


echo '}' >> /usr/share/nginx/html/config.json
