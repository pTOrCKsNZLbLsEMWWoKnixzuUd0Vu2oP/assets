#!/usr/bin/env bash
# split_into_random_dirs.sh
# 사용법: ./split_into_random_dirs.sh <SOURCE_DIR> <DEST_DIR>
# 예시: ./split_into_random_dirs.sh /c/Users/JohnDoe/Desktop/FBX fbx/nox/test

set -euo pipefail

SRC_DIR="$1"
DEST_DIR="$2"

# 인자 검증: 반드시 2개
if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <SOURCE_DIR> <DEST_DIR>"
  exit 1
fi

# SOURCE_DIR 존재 확인
if [[ ! -d "$SRC_DIR" ]]; then
  echo "Error: SOURCE_DIR '$SRC_DIR' 가 디렉터리가 아닙니다."
  exit 1
fi

# DEST_DIR이 절대경로처럼 보이지만, 상대경로로 처리하고 싶다면 앞 슬래시 제거
if [[ "${DEST_DIR:0:1}" == "/" ]]; then
  DEST_DIR="${DEST_DIR#/}"
fi

# DEST_DIR 없으면 생성
mkdir -p "$DEST_DIR"

# 파일 하나당 랜덤 폴더 생성 후 이동
for filepath in "$SRC_DIR"/*; do
  [[ -f "$filepath" ]] || continue
  filename=$(basename "$filepath")
  randname=$(head -c 240 /dev/urandom | tr -dc 'A-Za-z0-9' | head -c 80)
  target="${DEST_DIR%/}/$randname"
  mkdir -p "$target"
  mv "$filepath" "$target/$filename"
  echo "Moved '$filename' → '$target/'"
done

# 끝나면 DEST_DIR로 이동
cd "$DEST_DIR"
echo
echo "✔ 완료! 현재 위치: $(pwd)"
