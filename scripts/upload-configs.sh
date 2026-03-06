#!/bin/bash
# 로컬에서 실행 - EC2에 설정 파일 업로드
# 사용법: ./scripts/upload-configs.sh <EC2_IP> <PEM_KEY_PATH>
#
# 예시: ./scripts/upload-configs.sh 54.123.45.67 ~/.ssh/crossfitkorea.pem

set -e

EC2_IP="${1:?EC2 IP를 첫 번째 인자로 입력하세요}"
PEM_KEY="${2:?PEM 키 경로를 두 번째 인자로 입력하세요}"
EC2_USER="ubuntu"
REMOTE_DIR="/home/ubuntu/crossfitkorea"
SSH_OPTS="-i $PEM_KEY -o StrictHostKeyChecking=no"

echo "EC2($EC2_IP)에 설정 파일 업로드 중..."

# 원격 디렉토리 생성
ssh $SSH_OPTS $EC2_USER@$EC2_IP "mkdir -p $REMOTE_DIR/{nginx,scripts}"

# 파일 업로드
scp $SSH_OPTS nginx/nginx.conf       $EC2_USER@$EC2_IP:$REMOTE_DIR/nginx/
scp $SSH_OPTS docker-compose.prod.yml $EC2_USER@$EC2_IP:$REMOTE_DIR/
scp $SSH_OPTS scripts/deploy.sh      $EC2_USER@$EC2_IP:$REMOTE_DIR/scripts/

# deploy.sh 실행 권한 부여
ssh $SSH_OPTS $EC2_USER@$EC2_IP "chmod +x $REMOTE_DIR/scripts/deploy.sh"

echo ""
echo "업로드 완료!"
echo ""
echo "이제 EC2에서 .env.prod 파일을 작성하세요:"
echo "  ssh -i $PEM_KEY $EC2_USER@$EC2_IP"
echo "  vim $REMOTE_DIR/.env.prod"
echo "  chmod 600 $REMOTE_DIR/.env.prod"
