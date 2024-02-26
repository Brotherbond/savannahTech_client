FROM node:20

WORKDIR /app


RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y zsh python3  \
    && sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"


RUN corepack enable && pnpm config --global set store-dir ~/.pnpm-store && corepack prepare pnpm@latest --activate


COPY ./startup.sh /usr/local/bin/startup.sh

RUN chmod +x /usr/local/bin/startup.sh

EXPOSE 5000


ENTRYPOINT ["startup.sh" ]
