DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

DROP TABLE IF EXISTS account;
CREATE TABLE account(
    id serial PRIMARY KEY,
    -- type VARCHAR (255) NOT NULL, -- Not needed since an account can have multiple types
    username VARCHAR (30) UNIQUE NOT NULL,
    password VARCHAR (30) NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,
    name VARCHAR (255) NOT NULL, -- ELI: Not sure if this should be in profile instead
    contact VARCHAR(20), -- ELI: Not sure if this should be in profile instead
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS membership;
CREATE TABLE membership(
    id serial PRIMARY KEY,
    type VARCHAR (50) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    cost NUMERIC NOT NULL,
    status VARCHAR (50) NOT NULL,
    free_sessions_remaining NUMERIC NOT NULL
);

DROP TABLE IF EXISTS service_requestor;
CREATE TABLE service_requestor(
    id serial PRIMARY KEY,
    organisation VARCHAR (255) NOT NULL,
    membership_id INT NOT NULL REFERENCES membership(id),
    account_id INT NOT NULL REFERENCES account(id)
);

DROP TABLE IF EXISTS client;
CREATE TABLE client(
    id serial PRIMARY KEY,
    organisation VARCHAR(255),
    designation VARCHAR(50),
    preferred_comm_mode VARCHAR(30) NOT NULL,
    additional_notes TEXT,
    service_requestor_id INT REFERENCES service_requestor(id),
    account_id INT NOT NULL REFERENCES account(id)
);

-- ELI: Assuming the purpose of this table is to capture all the 
--      SADEAF-specific stuff, I think should split this up into 
--      client_profile, volunteer_profile since not much commonalities
DROP TABLE IF EXISTS profile;
CREATE TABLE profile(
    id serial PRIMARY KEY,
    -- TODO: Add remaining fields
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    account_id INT NOT NULL REFERENCES account(id)
);

DROP TABLE IF EXISTS admin;
CREATE TABLE admin(
    id serial PRIMARY KEY,
    account_id INT NOT NULL REFERENCES account(id)
);

DROP TABLE IF EXISTS volunteer;
CREATE TABLE volunteer(
    id serial PRIMARY KEY,
    approval_status bool NOT NULL,
    account_id INT NOT NULL REFERENCES account(id)
);

DROP TABLE IF EXISTS attendance;
CREATE TABLE attendance (
    id serial,
    has_dispute BOOLEAN DEFAULT FALSE,
    dispute_comment TEXT,
    attended BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS invoice;
CREATE TABLE invoice (
    id serial PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount NUMERIC NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS event;
CREATE TABLE event (
    id serial PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    client_id INT NOT NULL REFERENCES client(id),
    description TEXT,
    purpose VARCHAR(100),
    quotation NUMERIC NOT NULL,
    invoice_id INT REFERENCES invoice(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS assignment;
CREATE TABLE assignment (
    id serial,
    event_id INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    start_dt TIMESTAMP NOT NULL,
    end_dt TIMESTAMP NOT NULL,

    -- Location:
    address_line_one VARCHAR(255),
    address_line_two VARCHAR(255),
    room_number VARCHAR(20),
    postal VARCHAR(6),
    latitude float,
    longitude float,

    -- Volunteer-related
    volunteer_id INT NOT NULL,
    honorarium_amount float,
    attendance_id INT,

    PRIMARY KEY (id),
    FOREIGN KEY (event_id) REFERENCES event(id),
    FOREIGN KEY (volunteer_id) REFERENCES volunteer(id),
    FOREIGN KEY (attendance_id) REFERENCES attendance(id)

    -- TODO: Create with trigger on insert:
    --   > attendance document 
);


----------------------[ TRIGGERS & PROCEDURES ]----------------------

-- Create an invoice for the new event, setting the new event's invoice_id field to the new invoice's id
CREATE OR REPLACE FUNCTION create_invoice() RETURNS trigger AS
$$
BEGIN
    INSERT INTO invoice (name, amount) VALUES (NEW.id, 0) RETURNING id INTO NEW.invoice_id;
    RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER create_invoice_trigger
    BEFORE INSERT ON event
    FOR EACH ROW
    EXECUTE PROCEDURE create_invoice();
    
-- Updates the table's updated_at timestamps on row update
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

    -- Set for all tables with updated_at field
    DO $$
    DECLARE
        t text;
    BEGIN
        FOR t IN
            SELECT table_name FROM information_schema.columns WHERE column_name = 'updated_at'
        LOOP
            EXECUTE format('CREATE TRIGGER trigger_update_timestamp
                            BEFORE UPDATE ON %I
                            FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp()', t, t);
        END LOOP;
    END;
    $$ LANGUAGE 'plpgsql';


----------------------[ DUMMY DATA ]----------------------

INSERT INTO membership(
    type, expiry_date, cost, status, free_sessions_remaining
) VALUES
    ('corporate', now() + interval '360 days', 9.9, 'ACTIVE', 10);
    
INSERT INTO account(
    id, username, password, email, name, contact
) VALUES
    (1, 'admin', 'password', 'admin@gmail.com', 'Admin Guy', '88888888'),
    (2, 'donnyyen', 'password', 'donnyyen@gmail.com', 'Donny Yen', '88888888'),
    (3, 'bobbylei', 'password', 'bobbylei@gmail.com', 'Bobby Lei', '88888888'),
    (4, 'cattywantutree', 'password', 'cattywantutree@gmail.com', 'Catty Wan', '88888888'),
    (5, 'mammymay', 'password', 'mammymay@gmail.com', 'Mammy May', '88888888'),
    (6, 'jonlee', 'password', 'jonlee@gmail.com', 'Jon Lee', '88888888'),
    (7, 'xiaoming', 'password', 'xiaoming@gmail.com', 'Lee Xiao Ming, Jonathan', '88888888'),
    (8, 'ednatan', 'password', 'ednatan@gmail.com', 'Edna Tan', '88888888'),
    (9, 'reginald', 'password', 'reginald@gmail.com', 'Reginald James', '88888888'),
    (10, 'jolinetoh', 'password', 'jolinetoh@gmail.com', 'Joline Toh', '88888888'),
    (11, 'nathantan', 'password', 'nathantan@gmail.com', 'Nathan Tan', '88888888'),
    (12, 'nurhafiqa', 'password', 'nurhafiqa@gmail.com', 'Nur Hafiqa Binte Ismail', '88888888'),
    (13, 'yilai', 'password', 'yilai@gmail.com', 'Yi Lai Wang', '88888888'),
    (14, 'mohali', 'password', 'mohali@gmail.com', 'Mohamed Ali Bin Shafiq', '88888888'),
    (15, 'bremnath', 'password', 'bremnath@gmail.com', 'Bremnath Suriyamurthy', '88888888'),
    (16, 'weiyuan', 'password', 'weiyuan@gmail.com', 'Lee Wei Yuan', '88888888'),
    (17, 'waynetoh', 'password', 'waynetoh@gmail.com', 'Toh Jin Wee Wayne', '88888888'),
    (18, 'claudchua', 'password', 'claudchua@gmail.com', 'Claudia Chua Pei Si', '88888888'),
    (19, 'tedmundtan', 'password', 'tedmundtan@gmail.com', 'Tedmund Tan Zhi Peng', '88888888'),
    (20, 'austinwoon', 'password', 'austinwoon@gmail.com', 'Austin Woon Quan', '88888888'),
    (21, 'fuxing', 'password', 'fuxing@gmail.com', 'Loh Fuxing', '88888888'),
    (22, 'elilim', 'password', 'elilim@gmail.com', 'Eli Lim', '88888888'),
    (23, 'sunnylim', 'password', 'sunnylim@gmail.com', 'Sunny Lim', '88888888');

INSERT INTO admin(
    id, account_id 
) VALUES
    (1, 1);

INSERT INTO service_requestor(
    id, organisation, membership_id, account_id
) VALUES
    (1, 'SMU', 1, 2),
    (2, 'NTU', 1, 3),
    (3, 'NUS', 1, 4),
    (4, 'DBS', 1, 5);

INSERT INTO client(
    id, organisation, designation, preferred_comm_mode, additional_notes, service_requestor_id, account_id
) VALUES
    (1, 'Singapore Management University', 'student', 'Sign Language', null, 1, 6),
    (2, 'Singapore Management University', 'student', 'Speech', null, 1, 7),
    (3, 'Singapore Management University', 'student', 'Speech', null, 1, 8),
    (4, 'Nanyang Technological University', 'student', 'Sign Language', null, 2, 9),
    (5, 'Nanyang Technological University', 'student', 'Speech', null, 2, 10),
    (6, 'National University of Singapore', 'student', 'Speech', null, 3, 11),
    (7, 'DBS Pte Ltd', 'associate', 'Sign Language', null, 4, 12),
    (8, 'DBS Pte Ltd', 'vice president', 'Sign Language', null, 4, 13),
    (9, 'CreditSuisse Pte Ltd', 'analyst', 'Speech', null, null, 14),
    (10, null, 'self-employed', 'Sign Language', null, null, 15),
    (11, 'Shopee Pte Ltd', 'intern', 'Speech', null, null, 16);
    
INSERT INTO volunteer(
    id, approval_status, account_id
) VALUES
    (1, TRUE, 17), 
    (2, TRUE, 18),
    (3, TRUE, 19),
    (4, TRUE, 20),
    (5, TRUE, 21),
    (6, TRUE, 22),
    (7, TRUE, 23);

INSERT INTO profile(
    id, account_id 
) VALUES
    (1, 1);

INSERT INTO event (
    id, name, client_id, description, purpose, quotation 
) VALUES 
    (1, 'IS111 - Intro to Programming', 1, 'Introductory programming class - very hands-on', 'School', 188),
    (2, 'IS113 - Web Application Development', 2, 'Introductory programming class - very hands-on', 'School', 103),
    (3, 'JPMorgan Winning Women', 1, 'Event promoting gender equality at JPMorgan', 'Workshop', 88),
    (4, 'CodeIT Suisse', 3, 'Annual hackathon for recruitment and campus outreach', 'Workshop', 100),
    (5, 'COMM169 - Management Communication', 3, 'CORE SMU module', 'School', 100),
    (6, 'COMM169 - Management Communication', 4, 'CORE SMU module', 'School', 100),
    (7, 'COMM169 - Management Communication', 5, 'CORE SMU module', 'School', 100);

INSERT INTO assignment (
    id, event_id, status, start_dt, end_dt,
    address_line_one, address_line_two, postal, room_number, latitude, longitude,
    volunteer_id, honorarium_amount, attendance_id
) VALUES
    (1, 1, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + interval '10 day', 
     '1 Stanford Road', null, '123821', 'Haven 1A', 1.93821, 2.3247,
     1, 100, null),
     
    (2, 1, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + interval '4 day', 
     '1 Stanford Road', null, '123821', 'Haven 1A', 1.93821, 2.3247,
     2, 100, null),
     
    (3, 1, 'COMPLETE', CURRENT_TIMESTAMP - interval '1 day', CURRENT_TIMESTAMP, 
     '12 Geyland St', '#03-54', '603482', 'Room 2C', 1.93821, 2.3247,
     2, 200, null),
     
    (4, 2, 'COMPLETE', CURRENT_TIMESTAMP - interval '3 day', CURRENT_TIMESTAMP - interval '1 day', 
     '11 Jalan Run St', '#01-23', '603482', 'Room 2B', 1.0123, 2.5962,
     1, 100, null),
     
    (5, 3, 'COMPLETE', CURRENT_TIMESTAMP - interval '5 day', CURRENT_TIMESTAMP - interval '3 day', 
     '300 West, New York', '#38-01', '213029', 'Conf. 1', 1.8231, 2.3051,
     1, 500, null);

    -- TODO: Add more assignments for the other clients + volunteers 
     