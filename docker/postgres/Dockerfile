FROM postgres:12.3
# RUN apt -y install gnupg2
# RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
# RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list

RUN apt-get update
RUN apt -y install postgresql-12 postgresql-client-12 -y
RUN apt install postgis postgresql-12-postgis-3 -y
RUN apt-get install postgresql-12-postgis-3-scripts -y
RUN apt-get install tzdata -y
ENV TZ Europe/Lisbon -y

