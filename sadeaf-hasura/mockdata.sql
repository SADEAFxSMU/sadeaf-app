----------------------[ DUMMY DATA ]----------------------
DELETE FROM volunteer_assignment_opt_in;
DELETE FROM telegram_information;
DELETE FROM email_information;
DELETE FROM attendance;
DELETE FROM assignment;
DELETE FROM invoice;
DELETE FROM feedback;
DELETE FROM interpretation_details;
DELETE FROM event;
DELETE FROM notification_setting;
DELETE FROM volunteer;
DELETE FROM client;
DELETE FROM service_requestor;
DELETE FROM admin;
DELETE FROM membership_renewals;
DELETE FROM membership;
DELETE FROM membership_type;
DELETE FROM account;
DELETE FROM quotation;

-- Sources: https://sadeaf.org.sg/join-us/be-our-member/
--          https://sadeaf.org.sg/wp-content/uploads/2018/08/SADeaf-Membership-Factsheet.pdf
INSERT INTO membership_type(
    id, name, cost, duration_in_days, description
) VALUES
(1, 'ordinary', 15, 360, 'Only for Singapore citizens and permanent residents who are over the age of sixteen years'),
(2, 'corporate', 500, 360, 'For business organisations.'),
(3, 'associate', 30, 360, 'For non-Singapore citizens over the age of sixteen years.'),
(4, 'junior', 5, 360, 'For deaf and hard-of-hearing Singapore citizens and permanent residents under the age of sixteen years.'),
(5, 'life', 150, -1, 'For Ordinary Members who have been members of the Association for at least five years.'),
(6, 'honorary', 0, -1, 'Honorary membership shall be conferred on individuals who, in the opinion of the Executive Council, have rendered meritorious service to the Deaf of Singapore. Honorary members shall not be required to fill application forms or to pay any subscriptions.');

INSERT INTO account(
    id, email, name, contact, role, cognito_id, profile_pic_url, is_enabled
) VALUES
(1, 'admin@gmail.com', 'Admin Guy', '88888888', 'admin', null, null, true),
(2, 'donnyyen@gmail.com', 'Donny Yen', '88888888', 'service_requestor', null, null, true),
(3, 'bobbylei@gmail.com', 'Bobby Lei', '88888888', 'service_requestor', null, null, true),
(4, 'cattywantutree@gmail.com', 'Catty Wan', '88888888', 'service_requestor', null, null, true),
(5, 'mammymay@gmail.com', 'Mammy May', '88888888', 'service_requestor', null, null, true),
(6, 'jonlee@gmail.com', 'Jon Lee', '88888888', 'client', null, null, true),
(7, 'xiaoming@gmail.com', 'Lee Xiao Ming, Jonathan', '88888888', 'client', null, null, true),
(8, 'ednatan@gmail.com', 'Edna Tan', '88888888', 'client', null, null, true),
(9, 'reginald@gmail.com', 'Reginald James', '88888888', 'client', null, null, true),
(10, 'jolinetoh@gmail.com', 'Joline Toh', '88888888', 'client', null, null, true),
(11, 'nathantan@gmail.com', 'Nathan Tan', '88888888', 'client', null, null, true),
(12, 'nurhafiqa@gmail.com', 'Nur Hafiqa Binte Ismail', '88888888', 'client', null, null, true),
(13, 'yilai@gmail.com', 'Yi Lai Wang', '88888888', 'client', null, null, true),
(14, 'mohali@gmail.com', 'Mohamed Ali Bin Shafiq', '88888888', 'client', null, null, true),
(15, 'bremnath@gmail.com', 'Bremnath Suriyamurthy', '88888888', 'client', null, null, true),
(16, 'weiyuan@gmail.com', 'Lee Wei Yuan', '88888888', 'client', '3e2c1e46-d461-4a42-91e9-a11e8a240adb', 'https://images.unsplash.com/photo-1485528562718-2ae1c8419ae2?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTN8fHBlb3BsZXxlbnwwfDJ8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', true),
(17, 'waynetoh@gmail.com', 'Toh Jin Wee Wayne', '88888888', 'volunteer', null, 'https://images.unsplash.com/photo-1485893226355-9a1c32a0c81e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTR8fHBlb3BsZXxlbnwwfDJ8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', true),
(18, 'claudchua@gmail.com', 'Claudia Chua Pei Si', '88888888', 'volunteer', null, 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8cGVvcGxlfGVufDB8MnwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', true),
(19, 'tedmundtan@gmail.com', 'Tedmund Tan Zhi Peng', '88888888', 'volunteer', null, 'https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cGVvcGxlfGVufDB8MnwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', true),
(20, 'austinwoon@gmail.com', 'Austin Woon Quan', '88888888', 'volunteer', null, 'https://images.unsplash.com/photo-1484611941511-3628849e90f7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8cGVvcGxlfGVufDB8MnwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', true),
(21, 'fuxing@gmail.com', 'Loh Fuxing', '88888888', 'volunteer', null, 'https://images.unsplash.com/photo-1504376379689-8d54347b26c6?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTF8fHBlb3BsZXxlbnwwfDJ8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', true),
(22, 'elilim@gmail.com', 'Eli Lim', '88888888', 'volunteer', '1b56339d-bb43-4089-a896-c31336c682f9', 'https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTJ8fHBlb3BsZXxlbnwwfDJ8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', true),
(23, 'sunnylim@gmail.com', 'Sunny Lim', '88888888', 'volunteer', null, null, true),
(24, 'sadeaf-admin@huansen.dev', 'Test Admin', '81118111', 'admin', '0cdec2cc-901a-4809-be95-0bdfbf829bc1', 'https://images.unsplash.com/photo-1518577915332-c2a19f149a75?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mzd8fHBlb3BsZXxlbnwwfDJ8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', true),
(25, 'sadeaf-volunteer@huansen.dev', 'Test Volunteer', '98889000', 'volunteer', 'f0a6bb18-fd6f-41fe-8786-1945038c076f', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjN8fHBlb3BsZXxlbnwwfDJ8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', true),
(26, 'sadeaf-client@huansen.dev', 'Test Client', '99990000', 'client', '56055e1c-9884-420a-88b5-d5add81fea47', 'https://images.unsplash.com/photo-1520451644838-906a72aa7c86?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDJ8fHBlb3BsZXxlbnwwfDJ8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', true),
(27, 'sadeaf-servicerequestor@huansen.dev', 'Test ServiceRequestor', '91239123', 'service_requestor', '610256ce-6120-4cd2-867b-385d719deab1', null, true),
(28, 'sadeaf-user@huansen.dev', 'Test Pending', '92349234', 'pending', '0fd7f5f6-1f53-4c8e-9588-dd3f1d8bf29f', null, false);

INSERT INTO membership(
    id, account_id, membership_type_id, status, free_sessions_remaining, created_at, updated_at
) VALUES
(1, 1, 3, 'EXPIRED', 0, '2016-04-12', '2018-10-31'),
(2, 3, 1, 'ACTIVE', 18, '2017-06-05', '2020-06-20'), -- renewed on 2020-05-08
(3, 5, 3, 'ACTIVE', 0, '2017-06-05', '2020-01-01'), -- renewed on 2020-01-01, not eligible for free sessions
(4, 6, 4, 'EXPIRED', 17, '2017-06-05', '2017-08-23'),
(5, 2, 3, 'EXPIRED', 0, '2018-10-31', '2019-03-20'),
(6, 2, 1, 'ACTIVE', 5, '2019-04-06', '2020-06-06'), -- account 2 upgraded from 'associate' to 'ordinary' membership
(7, 7, 5, 'ACTIVE', 16, '2019-01-01', '2019-01-01'); -- Lifetime

INSERT INTO membership_renewals(
    id, membership_id, created_at
) VALUES
(1, 2, '2020-05-08'),
(2, 3, '2020-01-01');

INSERT INTO admin(
    id, account_id
) VALUES
(1, 1),
(2, 24);

INSERT INTO service_requestor(
    id, organisation, membership_id, account_id
) VALUES
(1, 'SMU', 1, 2),
(2, 'NTU', 1, 3),
(3, 'NUS', 1, 4),
(4, 'DBS', 1, 5),
(5, 'SMU', 1, 27);

INSERT INTO quotation(
    id,  requestor_type, first_block_duration_m, fee_for_first_block, subsequent_block_duration_m, fee_per_subsequent_block
) VALUES
(1, 'Affiliates', 120, 20, 30, 5),
(2, 'SADeaf Staff', 120, 20, 30, 5),
(3, 'Registered Client', 120, 20, 30, 5),
(4, 'Voluntary Welfare Organisations', 120, 60, 30, 15),
(5, 'Institutes of Higher Learning (New Category)', 120, 80, 30, 20),
(6, 'Medical (New Category)', 120, 80, 30, 20),
(7, 'Government Boards & Agencies', 120, 80, 30, 20),
(8, 'Legal', 120, 80, 30, 20),
(9, 'Corporates/Groups', 120, 80, 30, 20),
(10, 'Syariah Court', 120, 80, 30, 20),
(11, 'Unregistered Individual', 120, 80, 30, 20),
(12, 'Tourist', 120, 100, 30, 25);

INSERT INTO client(
    id, organisation, designation, preferred_comm_mode, additional_notes, service_requestor_id, account_id, quotation_id
) VALUES
(1, 'Singapore Management University', 'student', 'Sign Language', null, 1, 6, 3),
(2, 'Singapore Management University', 'student', 'Speech', null, 1, 7, 3),
(3, 'Singapore Management University', 'student', 'Speech', null, 1, 8, 3),
(4, 'Nanyang Technological University', 'student', 'Sign Language', null, 2, 9, 3),
(5, 'Nanyang Technological University', 'student', 'Speech', null, 2, 10, 3),
(6, 'National University of Singapore', 'student', 'Speech', null, 3, 11, 3),
(7, 'DBS Pte Ltd', 'associate', 'Sign Language', null, 4, 12, 9),
(8, 'DBS Pte Ltd', 'vice president', 'Sign Language', null, 4, 13, 9),
(9, 'CreditSuisse Pte Ltd', 'analyst', 'Speech', null, null, 14, 9),
(10, null, 'self-employed', 'Sign Language', null, null, 15, 3),
(11, 'Shopee Pte Ltd', 'intern', 'Speech', null, null, 16, 9),
(12, 'Singapore Management University', 'student', 'Speech', null, null, 26, 5);

INSERT INTO volunteer(
    id, account_id
) VALUES
(1, 17),
(2, 18),
(3, 19),
(4, 20),
(5, 21),
(6, 22),
(7, 23),
(8, 25);

-- INSERT INTO profile(
--     id, account_id
-- ) VALUES
--     (1, 1);

INSERT INTO notification_setting(
    id, account_id
) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

INSERT INTO telegram_information(
    id, chat_id, notification_setting_id, user_handle
) VALUES
(1, 1111111111, 1, '@admin'),
(2, 2222222222, 2, '@donny'),
(3, 3333333333, 3, '@bobby');

INSERT INTO email_information(
    id, notification_setting_id
) VALUES
(1, 1),
(2, 2),
(3, 4);

INSERT INTO event (
    id, name, client_id, description, purpose, notetaker_required, interpreter_required
) VALUES
(1, 'IS111 - Intro to Programming', 1, 'Introductory programming class - very hands-on', 'School', true, false),
(2, 'IS113 - Web Application Development', 12, 'Introductory programming class - very hands-on', 'School', false, true),
(3, 'JPMorgan Winning Women', 3, 'Event promoting gender equality at JPMorgan', 'Workshop', false, true),
(4, 'CodeIT Suisse', 3, 'Annual hackathon for recruitment and campus outreach', 'Workshop', true, true),
(5, 'COMM169 - Management Communication', 3, 'CORE SMU module', 'School', true, false),
(6, 'COMM169 - Management Communication', 4, 'CORE SMU module', 'School', false, true),
(7, 'COMM169 - Management Communication', 5, 'CORE SMU module', 'School', false, true),
(8, 'Feedback Event', 12, 'CORE SMU module', 'School', false, true);

INSERT INTO assignment (
    id, event_id, status, start_dt, end_dt,
    address_line_one, address_line_two, postal, room_number, latitude, longitude,
    volunteer_id, honorarium_amount
) VALUES
(1, 1, 'MATCHED', CURRENT_TIMESTAMP + interval '2 hour', CURRENT_TIMESTAMP + interval '10 day',
 '1 Stanford Road', null, '123821', 'Haven 1A', 1.93821, 2.3247,
 1, 100),

(2, 1, 'PENDING', CURRENT_TIMESTAMP + interval '50 hour', CURRENT_TIMESTAMP + interval '4 day',
 '1 Stanford Road', null, '123821', 'Haven 1A', 1.93821, 2.3247,
 null, 100),

(3, 1, 'MATCHED', CURRENT_TIMESTAMP + interval '24 hour', CURRENT_TIMESTAMP + interval '10 day',
 '1 Stanford Road', null, '123821', 'Haven 1A', 1.93821, 2.3247,
 1, 100),

(4, 1, 'CANCELLED', CURRENT_TIMESTAMP - interval '1 day', CURRENT_TIMESTAMP,
 '12 Geyland St', '#03-54', '603482', 'Room 2C', 1.93821, 2.3247,
 null, 200),

(5, 2, 'CANCELLED', '2020-07-30T12:30:00.000Z', '2020-07-30T18:30:00.000Z',
 '11 Jalan Run St', '#01-23', '603482', 'Room 2B', 1.0123, 2.5962,
 8, 100),

(6, 3, 'COMPLETE', '2020-08-05T15:00:00.000Z', '2020-08-05T18:30:00.000Z',
 '300 West, New York', '#38-01', '213029', 'Conf. 1', 1.8231, 2.3051,
 1, 500),

(7, 3, 'MATCHED', '2020-08-05T15:00:00.000Z', '2020-08-05T18:30:00.000Z',
 '300 West, New York', '#38-01', '213029', 'Conf. 1', 1.8231, 2.3051,
 1, 500),

(8, 3, 'COMPLETE', '2020-08-12T15:00:00.000Z', '2020-08-12T18:30:00.000Z',
 '300 West, New York', '#38-01', '213029', 'Conf. 1', 1.8231, 2.3051,
 null, 500),

(9, 2, 'MATCHED', CURRENT_TIMESTAMP + interval '29 hour', CURRENT_TIMESTAMP + interval '4 day',
 '1 Stanford Road', null, '123821', 'Haven 1A', 1.93821, 2.3247,
 8, 100),

(10, 2, 'MATCHED', CURRENT_TIMESTAMP + interval '29 hour', CURRENT_TIMESTAMP + interval '4 day',
 '1 Stanford Road', null, '123821', 'Haven 1A', 1.93821, 2.3247,
 2, 100),

(11, 2, 'MATCHED', CURRENT_TIMESTAMP + interval '29 hour', CURRENT_TIMESTAMP + interval '4 day',
 '1 Stanford Road', null, '123821', 'Haven 1A', 1.93821, 2.3247,
 2, 100),

(12, 2, 'MATCHED', CURRENT_TIMESTAMP + interval '29 hour', CURRENT_TIMESTAMP + interval '4 day',
 '1 Stanford Road', null, '123821', 'Haven 1A', 1.93821, 2.3247,
 2, 100),

(13, 2, 'PENDING', CURRENT_TIMESTAMP + interval '4 day', CURRENT_TIMESTAMP + interval '194 hour',
 '18 Cashew Ave', null, '123405', null, null, null,
 null, 100),

(14, 8, 'MATCHED', CURRENT_TIMESTAMP + interval '24 hour', CURRENT_TIMESTAMP + interval '27 hour',
 '18 Cashew Ave', null, '123405', null, null, null,
 8, 100);

UPDATE assignment SET status = 'COMPLETE' WHERE id = 10;
UPDATE assignment SET status = 'COMPLETE' WHERE id = 9;
UPDATE assignment SET status = 'COMPLETE' WHERE id = 14;


-- TODO: Add more assignments for the other clients + volunteers

INSERT INTO volunteer_assignment_opt_in (
    id, volunteer_id, assignment_id, status
) VALUES
(3, 2, 2, 'OPTED_IN'),
(4, 3, 2, 'OPTED_IN'),
(5, 3, 3, 'OPTED_IN'),
(6, 4, 4, 'OPTED_IN'),
(7, 5, 4, 'OPTED_OUT');

-- Check feedback id value before inserting / updating feedback manually. It takes into account previous feedback\'s that have been added and increments it by 1.
--UPDATE feedback SET feedback_given = 1, notetaker_punctual = '2' , notetaker_conduct = '5', live_information_understanding = '5', live_interaction = '5', post_session_understanding = '4' where id = 33;
--UPDATE feedback SET feedback_given = 1, notetaker_punctual = '2' , notetaker_conduct = '5', live_information_understanding = '5', live_interaction = '5', post_session_understanding = '4' where id = 34;

INSERT INTO interpretation_details (
    id, sign_system, filming_interpreters, allow_trainee_interpreters,number_of_deaf,
    number_of_hearing,event_id
) VALUES
(1, 'home system', true, true, 5, 100, 1);

INSERT INTO attendance(
    id, assignment_id, attended, dispute_comment, has_dispute
) VALUES
(1, 1, true, null, false),
(2, 2, true, null, false),
(3, 3, true, null, false),
(4, 4, false, null, true);

SELECT setval(pg_get_serial_sequence('telegram_information', 'id'), coalesce(max(id) + 1, 1), false) FROM telegram_information;
SELECT setval(pg_get_serial_sequence('email_information', 'id'), coalesce(max(id) + 1, 1), false) FROM email_information;
SELECT setval(pg_get_serial_sequence('attendance', 'id'), coalesce(max(id) + 1, 1), false) FROM attendance;
SELECT setval(pg_get_serial_sequence('assignment', 'id'), coalesce(max(id) + 1, 1), false) FROM assignment;
SELECT setval(pg_get_serial_sequence('invoice', 'id'), coalesce(max(id) + 1, 1), false) FROM invoice;
SELECT setval(pg_get_serial_sequence('feedback', 'id'), coalesce(max(id) + 1, 1), false) FROM feedback;
SELECT setval(pg_get_serial_sequence('interpretation_details', 'id'), coalesce(max(id) + 1, 1), false) FROM interpretation_details;
SELECT setval(pg_get_serial_sequence('event', 'id'), coalesce(max(id) + 1, 1), false) FROM event;
SELECT setval(pg_get_serial_sequence('notification_setting', 'id'), coalesce(max(id) + 1, 1), false) FROM notification_setting;
SELECT setval(pg_get_serial_sequence('volunteer', 'id'), coalesce(max(id) + 1, 1), false) FROM volunteer;
SELECT setval(pg_get_serial_sequence('client', 'id'), coalesce(max(id) + 1, 1), false) FROM client;
SELECT setval(pg_get_serial_sequence('service_requestor', 'id'), coalesce(max(id) + 1, 1), false) FROM service_requestor;
SELECT setval(pg_get_serial_sequence('admin', 'id'), coalesce(max(id) + 1, 1), false) FROM admin;
SELECT setval(pg_get_serial_sequence('membership_renewals', 'id'), coalesce(max(id) + 1, 1), false) FROM membership_renewals;
SELECT setval(pg_get_serial_sequence('membership', 'id'), coalesce(max(id) + 1, 1), false) FROM membership;
SELECT setval(pg_get_serial_sequence('membership_type', 'id'), coalesce(max(id) + 1, 1), false) FROM membership_type;
SELECT setval(pg_get_serial_sequence('account', 'id'), coalesce(max(id) + 1, 1), false) FROM account;
SELECT setval(pg_get_serial_sequence('quotation', 'id'), coalesce(max(id) + 1, 1), false) FROM quotation;
SELECT setval(pg_get_serial_sequence('volunteer_assignment_opt_in', 'id'), coalesce(max(id) + 1, 1), false) FROM volunteer_assignment_opt_in;


UPDATE volunteer SET notetaker = false, interpreter = true where id = 1;
UPDATE volunteer SET notetaker = true, interpreter = false where id = 2;
UPDATE volunteer SET notetaker = true, interpreter = false where id = 3;
UPDATE volunteer SET notetaker = true, interpreter = true where id = 4;
UPDATE volunteer SET notetaker = false, interpreter = true where id = 5;
UPDATE volunteer SET notetaker = true, interpreter = true where id = 6;
UPDATE volunteer SET notetaker = true, interpreter = false where id = 7;
UPDATE volunteer SET notetaker = true, interpreter = true where id = 8;
