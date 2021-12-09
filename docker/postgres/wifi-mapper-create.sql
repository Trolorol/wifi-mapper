-- Enable PostGIS (includes raster)
CREATE EXTENSION postgis;

-- Enable Topology
CREATE EXTENSION postgis_topology;

create table if not exists users (
	id serial primary key,
	username varchar NOT NULL,
	email varchar NOT NULL,
	created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table if not exists encryptions(
	id serial primary key,
	encryption varchar NOT NULL,
	created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table if not exists waps (
	id serial primary key,
	bssid varchar(60),
	strength varchar,
	location geometry,
	user_id int,
	foreign key(user_id) references users(id),
	created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table if not exists waps_encryptions(
	wap_id serial,
	encryption_id serial,
	foreign key(wap_id) references waps(id),
	foreign key(encryption_id) references encryptions(id)
);
