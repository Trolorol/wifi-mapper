create database wifi_mapper;

use wifi_mapper;

create table if not exists coordenates (
	id serial primary key,
	latitude float(8),
	longitude float(8),
	user_id int,
	foreign key(user_id) references users(id)
);

create table if not exists users (
	id serial primary key,
	username varchar(60),
	email varchar(30)
);

create table if not exists bssids(id serial primary key, bssid varchar(60));

create table if not exists encryptions(
	id serial primary key,
	encryption varchar(30)
);

create table if not exists coordenates_encryptions(
	coordenate_id serial,
	encryption_id serial,
	foreign key(coordenate_id) references coordenates(id),
	foreign key(encryption_id) references encryptions(id)
);

create table if not exists coordenates_bssids(
	coordenate_id serial,
	bssid_id serial,
	foreign key(coordenate_id) references coordenates(id),
	foreign key(bssid_id) references bssids(id)
);