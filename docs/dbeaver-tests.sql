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



select *, ST_Within(ST_GeomFromEWKT('SRID=4326; POLYGON((-9.15704007319594 38.7098391015367, -9.15704007319594 38.70652791554248, -9.147443129340655 38.7098391015367, -9.147443129340655 38.70652791554248, -9.15704007319594 38.7098391015367))'),
            ST_GeomFromEWKT(waps.location)) 
FROM waps;



ST_Contains(ST_GeomFromEWKT('SRID=4326; POLYGON((-15.0292969 47.6357836,-15.2050781 47.5172007,-16.2597656 29.3821751, 35.0683594 26.1159859, 38.0566406 47.6357836,-15.0292969 47.6357836))'),



SELECT bssid , st_within("location", ST_GeomFromText('POLYGON((-9.15 38.70, -9.14 38.70, -9.14 38.69, -9.15 38.69, -9.15 38.70))', 4326))  FROM waps

SELECT point '(-2,9)' <@ polygon '((-3,10),(8,18),(-3,30),(-10,20))';



POLYGON((-9.157329805740437 38.70920535349463,-9.147732861885151 38.70920535349463,-9.147732861885151 38.705894138149155,-9.157329805740437 38.705894138149155,-9.157329805740437 38.7092053534946))
SELECT *
FROM table1, table2
WHERE ST_Contains(table1.geom, table2.geom)

SELECT *
FROM waps
WHERE ST_Contains(waps."location", 'POLYGON((-9.15 38.70, -9.14 38.70, -9.14 38.69, -9.15 38.69, -9.15 38.70))'::geometry)


select * from waps
	where ST_Within(
	"location",
		ST_AsText(st_envelope('POLYGON((-9.15 38.70, -9.14 38.70, -9.14 38.69, -9.15 38.69, -9.15 38.70))'::geometry))
	)
	
SELECT ST_AsText(ST_Envelope('POLYGON((-9.15 38.70, -9.14 38.70, -9.14 38.69, -9.15 38.69, -9.15 38.70))'::geometry));
	




SELECT ST_SRID('POINT(-122.334172173172 46.602634395263560)'::geography::geometry);
 st_srid








