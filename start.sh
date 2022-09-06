#!/bin/sh

CONFIG_LINE_PATH="/usr/share/nginx/html/config.json"

echo '{' > $CONFIG_LINE_PATH


if [[ -n "${API_ENDPOINT}" ]];
then
  CONFIG_LINE="\"ApiEndpoint\": \"$API_ENDPOINT\","
  echo "$CONFIG_LINE" >> $CONFIG_LINE_PATH
else
  CONFIG_LINE="\"ApiEndpoint\": \"https://api.campus.kpi.ua/\","
  echo "$CONFIG_LINE" >> $CONFIG_LINE_PATH
fi


if [[ -n "${OLD_UI_ADDRESS}" ]];
then
  CONFIG_LINE="\"OldUIAddress\": \"$OLD_UI_ADDRESS\","
  echo "$CONFIG_LINE" >> $CONFIG_LINE_PATH
else
  CONFIG_LINE="\"OldUIAddress\": \"https://campus.kpi.ua/\","
  echo "$CONFIG_LINE" >> $CONFIG_LINE_PATH
fi


if [[ -n "${LOGIN_PAGE_ADDRESS_LINE}" ]];
then
  CONFIG_LINE_3="\"LoginPageAddress\": \"$LOGIN_PAGE_ADDRESS_LINE\""
  echo "$CONFIG_LINE_3" >> $CONFIG_LINE_PATH
else
  CONFIG_LINE="\"LoginPageAddress\": \"https://ecampus.kpi.ua/login\""
  echo "$CONFIG_LINE" >> $CONFIG_LINE_PATH
fi

echo '}' >> /usr/share/nginx/html/config.json
