create database wifi_mapper;

use wifi_mapper;

create table if not exists waps (
	id serial primary key,
	location point NOT NULL,
	strength varchar,
	user_id int NOT NULL,
	foreign key(user_id) references users(id),
	created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table if not exists users (
	id serial primary key,
	username varchar NOT NULL,
	email varchar NOT NULL,
	created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table if not exists bssids(id serial primary key, bssid varchar(60));

create table if not exists encryptions(
	id serial primary key,
	encryption varchar NOT NULL,
	created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table if not exists waps_encryptions(
	wap_id serial,
	encryption_id serial,
	foreign key(wap_id) references waps(id),
	foreign key(encryption_id) references encryptions(id)
);

create table if not exists waps_bssids(
	wap_id serial,
	bssid_id serial,
	foreign key(wap_id) references waps(id),
	foreign key(bssid_id) references bssids(id)
);



-- Use Point data type to store Longitude and Latitude in a single column:

-- CREATE TABLE table_name (
--     id integer NOT NULL,
--     name text NOT NULL,
--     location point NOT NULL,
--     created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT table_name_pkey PRIMARY KEY (id)
-- )
-- Create an Indexing on a 'location' column :

-- CREATE INDEX ON table_name USING GIST(location);
-- GiST index is capable of optimizing “nearest-neighbor” search :

-- SELECT * FROM table_name ORDER BY location <-> point '(-74.013, 40.711)' LIMIT 10;
-- Note: The point first element is longitude and the second element is latitude.

-- For more info check this Query Operators.