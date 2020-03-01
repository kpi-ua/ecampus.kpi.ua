#!/bin/bash

project="ecampus-kpi-ua"
now=$(date +%Y%m%d%H%M%S)
root_dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)/../

github_organization="docker.pkg.github.com/kpi-ua/ecampus.kpi.ua"
github_registry_url="docker.pkg.github.com"
github_registry_username=$1
github_registry_pwd=$2

dockerhub_organization="kpiua"
dockerhub_registry_url=""
dockerhub_registry_username=$3
dockerhub_registry_pwd=$4

clear

push_to_docker_registry()  {
    local organization=$1
    local image_id=$2:$3
    local username=$4
    local password=$5
    local server=$6

    echo "Docker Auth ${server}"

    docker login -u "$username" -p "$password" "$server"

    echo "Push Docker images ${server}"

    docker tag "$image_id" "$organization"/"$image_id"
    docker push "$organization"/"$image_id"
    docker logout
}

#################################################################################

echo "Build project"

cd "$root_dir" || exit

npm install
npm run-script build
mv build ./docker
cp default.conf ./docker/default.conf

#################################################################################

cd "$root_dir"/docker || exit

echo "Build docker images"

docker build ./ --file ./.dockerfile --tag "$project":"$now"
docker build ./ --file ./.dockerfile --tag "$project":latest

echo "Publish docker images"

push_to_docker_registry $github_organization "$project" "$now" "$github_registry_username" "$github_registry_pwd" "$github_registry_url"
push_to_docker_registry $github_organization "$project" latest "$github_registry_username" "$github_registry_pwd" "$github_registry_url"
push_to_docker_registry $dockerhub_organization "$project" "$now" "$dockerhub_registry_username" "$dockerhub_registry_pwd" "$dockerhub_registry_url"
push_to_docker_registry $dockerhub_organization "$project" latest "$dockerhub_registry_username" "$dockerhub_registry_pwd" "$dockerhub_registry_url"

echo "Done"