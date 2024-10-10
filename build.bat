@echo off

echo Resetting remote branch . . .
call git fetch
call git reset --hard origin/jenkins
call git rebase origin/develop

echo Start building Heredium frontend . . .
call docker stop heredium-frontend-test
call docker rm heredium-frontend-test
call docker build -t heredium-frontend-test .
call docker run -t -d --network host --name heredium-frontend-test --restart=always heredium-frontend-test
call docker image prune -a -f
