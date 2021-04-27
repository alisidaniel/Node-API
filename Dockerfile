FROM mhart/alpine-node:12
ENV INSTALL_PATH /user/app
RUN mkdir -p $INSTALL_PATH
COPY docker-entrypoint.sh /docker-entrypoint.sh
CMD ["/bin/sh", "/docker-entrypoint.sh"]
