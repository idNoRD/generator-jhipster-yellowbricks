# generator-jhipster-yellowbricks

Install one package, activate yellowbricks by name, pass config per yellowbrick:

  npm install -g generator-jhipster-yellowbricks

  jhipster jdl app.jdl \
    --blueprints yellowbricks \
    --yellowbricks=\
        yellowbricks-server-contextpath,\
        yellowbricks-angular-contextpath,\
        yellowbricks-client-contextpath,\
        yellowbricks-angular-relativepathresource,\
        yellowbricks-client-relativepathresource \
    --yellowbricks-server-contextpath-config='{"contextPath":"/jh"}' \
    --yellowbricks-angular-contextpath-config='{"contextPath":"/jh"}' \
    --yellowbricks-client-contextpath-config='{"contextPath":"/jh"}'
