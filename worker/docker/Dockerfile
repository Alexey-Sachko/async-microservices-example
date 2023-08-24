FROM --platform=linux/amd64 node:16.13-alpine as builder 

WORKDIR /code

RUN apk --no-cache add build-base

COPY package.json yarn.lock .yarnrc.yml /code/
COPY .yarn/ /code/.yarn
COPY common/package.json common/yarn.loc[k] /code/common/
COPY worker/package.json worker/yarn.loc[k] /code/worker/
COPY api/package.json api/yarn.loc[k] /code/api/

RUN yarn install

COPY . /code/

RUN yarn common build
RUN yarn worker build

FROM  --platform=linux/amd64 node:16.13-alpine

WORKDIR /code

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY .yarnrc.yml .yarnrc.yml
COPY .yarn/ .yarn/
COPY common/package.json common/yarn.loc[k] common/
COPY worker/package.json worker/yarn.loc[k] worker/
COPY --from=builder /code/common/dist common/dist

RUN apk --no-cache add --virtual builds-deps build-base && yarn workspaces focus --all --production && yarn cache clean && apk del builds-deps && rm -rf /var/cache/apk/* /root/.cache /tmp/*

COPY --from=builder /code/worker/dist ./worker/dist

EXPOSE 8000
COPY ./worker/docker/start.sh /code/worker

RUN apk --no-cache add --update sudo

# add new user

ARG USER=app

RUN adduser -D $USER \
        && echo "$USER ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/$USER \
        && chmod 0440 /etc/sudoers.d/$USER

RUN chown -R $USER:$USER /code  && chmod -R 755 /code

USER $USER

CMD ["sh", "/code/worker/start.sh"]
