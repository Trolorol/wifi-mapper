# mapping-test

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Contributing](../CONTRIBUTING.md)

## About <a name = "about"></a>

I started to develop Wifi mapper as a college project [@IADE](https://www.iade.europeia.pt/)
This web app as an upload section that takes csv with wifi bssid, position and signal strenght and uploads them to the data model
specified in docs folder.
Then it generates a map with [leafletjs](https://leafletjs.com/) with all the markers that were uploaded thru the csv file.


## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites
You can run an instance of this project with docker, just use the docker-compose.yml on the docker folder.

To run natively on the computer you will need:
```
node
express
leafletjs
postgres
postgis extention package
```

### Installing

If you are runing this app with docker just:

```
cd /docker/
```
and then:
```
docker-compose up -d
```

If you are runing the app natively use:

```
npm install
```
and then create a postgres database named wifi-mapper
or
dockerize the dev database in /docker/docker-dev using:
```
docker-compose up -d
```


End with an example of getting some data out of the system or using it for a little demo.

## Usage <a name = "usage"></a>

Add notes about how to use the system.
