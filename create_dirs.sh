#!/usr/bin/env bash
# 사용법: ./create_dirs.sh <_IGNORE_> <TARGET_DIR> <COUNT>
# 예시: ./create_dirs.sh x fbx/nox/test 5

# 첫 번째 인자는 사용하지 않음 (스크립트 호환을 위해 남겨둠)
# 두 번째 인자가 타겟 디렉토리, 세 번째 인자가 생성 개수
TARGET_DIR="$2"
COUNT="$3"

# 인자 검증
if [[ -z "$TARGET_DIR" || -z "$COUNT" ]]; then
  echo "Usage: $0 <_IGNORE_> <TARGET_DIR> <COUNT>"
  exit 1
fi

# 만약 앞에 '/' 가 붙어 절대경로처럼 보이면, 상대경로로 전환
if [[ "${TARGET_DIR:0:1}" == "/" ]]; then
  TARGET_DIR="${TARGET_DIR#/}"
fi

# TARGET_DIR이 존재하지 않으면 생성
if [[ ! -d "$TARGET_DIR" ]]; then
  echo "디렉토리 '$TARGET_DIR' 이(가) 존재하지 않아 생성합니다."
  mkdir -p "$TARGET_DIR"
fi

# 디렉토리 생성 루프
for i in $(seq 1 "$COUNT"); do
  # 80자 랜덤 문자열 생성
  RAND_NAME=$(head -c 240 /dev/urandom | tr -dc 'A-Za-z0-9' | head -c 80)
  DIR_PATH="${TARGET_DIR%/}/${RAND_NAME}"

  if [[ -d "$DIR_PATH" ]]; then
    echo "이미 존재: $DIR_PATH"
  else
    mkdir "$DIR_PATH"
    echo "생성됨: $DIR_PATH"
  fi
done
