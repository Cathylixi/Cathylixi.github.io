#!/usr/bin/env bash
set -e

if command -v brew >/dev/null 2>&1 && brew --prefix ruby >/dev/null 2>&1; then
  export PATH="$(brew --prefix ruby)/bin:$PATH"
fi

export RUBYOPT="-r$(pwd)/_plugins/ruby_compat.rb ${RUBYOPT:-}"

bundle _4.0.10_ exec jekyll liveserve