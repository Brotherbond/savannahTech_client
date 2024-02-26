#!/usr/bin/env zsh

echo $(pwd)

if [ ! -d ./node_modules ]; then
    echo "Installing packages"
    pnpm i
    echo "Done installing packages"
fi

pnpm dev
