FROM node:18-alpine3.15 AS base

ARG NODE_ENV=production

WORKDIR /misskey

ENV BUILD_DEPS autoconf automake file g++ gcc libc-dev libtool make nasm pkgconfig python3 zlib-dev git

FROM base AS builder

ARG VERSION_HASH

COPY . ./
RUN apk add --no-cache $BUILD_DEPS && \
	git submodule update --init && \
	node version-patch.js ${VERSION_HASH} && \
	yarn install && \
	yarn build && \
	rm -rf .git

FROM node:16.15.1-bullseye-slim AS runner

WORKDIR /misskey

RUN apt-get update
RUN apt-get install -y ffmpeg tini

COPY --from=builder /misskey/node_modules ./node_modules
COPY --from=builder /misskey/built ./built
COPY --from=builder /misskey/packages/backend/node_modules ./packages/backend/node_modules
COPY --from=builder /misskey/packages/backend/built ./packages/backend/built
COPY --from=builder /misskey/packages/client/node_modules ./packages/client/node_modules
COPY . ./

ENV NODE_ENV=production
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["npm", "run", "migrateandstart"]
