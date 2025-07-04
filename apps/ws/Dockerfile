FROM ghcr.io/novuhq/novu/base:1.1.0

COPY --chown=1000:1000 .npmrc .
COPY --chown=1000:1000 .npmrc-cloud .

COPY --chown=1000:1000 package.json .

COPY --chown=1000:1000 apps/ws ./apps/ws
COPY --chown=1000:1000 libs/dal ./libs/dal
COPY --chown=1000:1000 packages/shared ./packages/shared
COPY --chown=1000:1000 libs/testing ./libs/testing
COPY --chown=1000:1000 libs/application-generic ./libs/application-generic
COPY --chown=1000:1000 packages/framework ./packages/framework
COPY --chown=1000:1000 packages/stateless ./packages/stateless
COPY --chown=1000:1000 packages/providers ./packages/providers

COPY --chown=1000:1000 ["tsconfig.json","nx.json","pnpm-workspace.yaml","pnpm-lock.yaml", ".npmrc", "./"]

RUN --mount=type=secret,id=BULL_MQ_PRO_NPM_TOKEN,uid=1000 export BULL_MQ_PRO_NPM_TOKEN=$(cat /run/secrets/BULL_MQ_PRO_NPM_TOKEN) && \
    if [ -n "${BULL_MQ_PRO_NPM_TOKEN}" ] ; then echo 'Building with Enterprise Edition of Novu'; rm -f .npmrc ; cp .npmrc-cloud .npmrc ; fi

RUN --mount=type=secret,id=BULL_MQ_PRO_NPM_TOKEN,uid=1000 export BULL_MQ_PRO_NPM_TOKEN=$(cat /run/secrets/BULL_MQ_PRO_NPM_TOKEN) && \
    pnpm install --verbose && \
    pnpm build:ws

RUN --mount=type=secret,id=BULL_MQ_PRO_NPM_TOKEN,uid=1000 export BULL_MQ_PRO_NPM_TOKEN=$(cat /run/secrets/BULL_MQ_PRO_NPM_TOKEN) && \
    if $BULL_MQ_PRO_NPM_TOKEN ; then rm -f .npmrc ; fi

WORKDIR /usr/src/app/apps/ws

RUN cp src/dotenvcreate.mjs dist/dotenvcreate.mjs
RUN cp src/.example.env dist/.env
RUN cp src/.env.test dist/.env.test
RUN cp src/.env.development dist/.env.development
RUN cp src/.env.production dist/.env.production

ENTRYPOINT [ "sh", "-c", "node dist/dotenvcreate.mjs -s=novu/ws -r=$NOVU_REGION -e=$NOVU_ENTERPRISE -v=$NODE_ENV && pm2-runtime start dist/main.js -i max" ]
