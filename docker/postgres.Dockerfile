FROM postgres:16-alpine
# Supply locale tooling for initdb while retaining the existing Alpine data format.
RUN apk add --no-cache musl-locales musl-locales-lang
