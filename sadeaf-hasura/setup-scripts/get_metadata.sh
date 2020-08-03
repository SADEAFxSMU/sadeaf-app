# in the web console, ensure that all tables/relations are already tracked
CONTAINER_NAME=sadeaf-hasura_graphql-engine_1
CLI_EXE=/bin/hasura-cli

# the setup flag should be used when you're running a fresh container
# and you need to export the metadata out
if [ "$1" == "--setup" ]; then
  docker exec -it $CONTAINER_NAME rm -rf /hasura
  docker exec -it $CONTAINER_NAME $CLI_EXE init hasura --endpoint http://localhost:8080
elif [ "$1" == "" ]; then
  echo "Skipping project setup."
else
  echo "Unknown flag $1. Did you mean --setup ?"
  exit 1
fi

docker exec -i $CONTAINER_NAME sh -c "cd /hasura && $CLI_EXE metadata export"
docker cp $CONTAINER_NAME:/hasura/metadata ../
