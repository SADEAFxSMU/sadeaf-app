DROP TABLE IF EXISTS membership;
CREATE TABLE membership(
    id serial,
    type VARCHAR (50) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    cost NUMERIC NOT NULL,
    status VARCHAR (50) NOT NULL,
    free_sessions_remaining NUMERIC NOT NULL,
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS client;
CREATE TABLE client(
    id serial,
    name VARCHAR (255) NOT NULL,
    -- TODO: any more fields that is in the form
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS service_requestor;
CREATE TABLE service_requestor(
    id serial,
    membership_id INT NOT NULL,
    organisation VARCHAR (255) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(membership_id) references membership(id)
);

DROP TABLE IF EXISTS service_requestor_clients;
CREATE TABLE service_requestor_clients(
    service_requestor_id INT NOT NULL,
    client_id INT NOT NULL,
    PRIMARY KEY(service_requestor_id, client_id),
    FOREIGN KEY(client_id) references client(id),
    FOREIGN KEY(service_requestor_id) references service_requestor(id)
);

DROP TABLE IF EXISTS profile;
CREATE TABLE profile(
    id serial,
    name VARCHAR (255) NOT NULL,
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS admin;
CREATE TABLE admin(
    id serial,
    name VARCHAR (255) NOT NULL,
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS volunteer;
CREATE TABLE volunteer(
    id serial,
    name VARCHAR (255) NOT NULL,
    approval_status bool NOT NULL,
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS account;
CREATE TABLE account(
    id serial,
    type VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL,
    created_at timestamp default current_timestamp,
    profile_id INT NOT NULL,
    account_id INT,
    client_id INT,
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS admin_accounts;
CREATE TABLE admin_accounts(
    account_id INT NOT NULL,
    admin_id INT NOT NULL,
    PRIMARY KEY(account_id, admin_id),
    FOREIGN KEY(account_id) REFERENCES account(id),
    FOREIGN KEY(admin_id) REFERENCES admin(id)
);

-- DUMMY DATA

INSERT INTO membership(
    type, expiry_date, cost, status, free_sessions_remaining
) VALUES
    ('corporate', now(), 9.9, 'test_status', 10);

INSERT INTO client(
    name
) VALUES
    ('sadeaf_client'),
    ('another_sadeaf_client');

INSERT INTO service_requestor(
    membership_id, organisation
) VALUES
    (1, 'SADEAF');

INSERT INTO service_requestor_clients(
    service_requestor_id, client_id
) VALUES
    (1, 1),
    (1, 2);

INSERT INTO admin(
    name
) VALUES
    ('test_admin');

INSERT INTO profile(
    name
) VALUES
    ('test_profile');

INSERT INTO account(
    type, password, profile_id, account_id
) VALUES
    ('admin', 'abc', 1, 1);

INSERT INTO admin_accounts(
    account_id, admin_id
) VALUES
    (1, 1);
