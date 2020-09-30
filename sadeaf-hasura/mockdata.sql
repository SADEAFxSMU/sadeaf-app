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
    id, email, name, contact, role, cognito_id, profile_pic_url
) VALUES
(1, 'admin@gmail.com', 'Admin Guy', '88888888', 'admin', null, null),
(2, 'donnyyen@gmail.com', 'Donny Yen', '88888888', 'svcreq', null, null),
(3, 'bobbylei@gmail.com', 'Bobby Lei', '88888888', 'svcreq', null, null),
(4, 'cattywantutree@gmail.com', 'Catty Wan', '88888888', 'svcreq', null, null),
(5, 'mammymay@gmail.com', 'Mammy May', '88888888', 'svcreq', null, null),
(6, 'jonlee@gmail.com', 'Jon Lee', '88888888', 'client', null, null),
(7, 'xiaoming@gmail.com', 'Lee Xiao Ming, Jonathan', '88888888', 'client', null, null),
(8, 'ednatan@gmail.com', 'Edna Tan', '88888888', 'client', null, null),
(9, 'reginald@gmail.com', 'Reginald James', '88888888', 'client', null, null),
(10, 'jolinetoh@gmail.com', 'Joline Toh', '88888888', 'client', null, null),
(11, 'nathantan@gmail.com', 'Nathan Tan', '88888888', 'client', null, null),
(12, 'nurhafiqa@gmail.com', 'Nur Hafiqa Binte Ismail', '88888888', 'client', null, null),
(13, 'yilai@gmail.com', 'Yi Lai Wang', '88888888', 'client', null, null),
(14, 'mohali@gmail.com', 'Mohamed Ali Bin Shafiq', '88888888', 'client', null, null),
(15, 'bremnath@gmail.com', 'Bremnath Suriyamurthy', '88888888', 'client', null, null),
(16, 'weiyuan@gmail.com', 'Lee Wei Yuan', '88888888', 'client', '3e2c1e46-d461-4a42-91e9-a11e8a240adb', 'https://media-exp1.licdn.com/dms/image/C5603AQGQHsAl3P_VDA/profile-displayphoto-shrink_400_400/0?e=1605744000&v=beta&t=tqpHXRlBQ4TEMnZcZFH8OF34uBADdSNNcL_WlH1FKg8'),
(17, 'waynetoh@gmail.com', 'Toh Jin Wee Wayne', '88888888', 'volunteer', null, 'https://media-exp1.licdn.com/dms/image/C5603AQEoomKi9Ky-1Q/profile-displayphoto-shrink_400_400/0?e=1605744000&v=beta&t=pyR-hk8Qhb3l21dZ7i8Ao0KlmW5If4fhWh0lAMusVeE'),
(18, 'claudchua@gmail.com', 'Claudia Chua Pei Si', '88888888', 'volunteer', null, 'https://media-exp1.licdn.com/dms/image/C5103AQGLM28N3fuaPw/profile-displayphoto-shrink_400_400/0?e=1605744000&v=beta&t=r2VaMBTlEcc8feZagzouPFOgUvvsWGn-OKK-zu4CgVk'),
(19, 'tedmundtan@gmail.com', 'Tedmund Tan Zhi Peng', '88888888', 'volunteer', null, 'https://media-exp1.licdn.com/dms/image/C5103AQHlCmi1sznkng/profile-displayphoto-shrink_800_800/0?e=1605744000&v=beta&t=BruGLDUNS4ONFFly2PIV3fw1GjNaRCZJZXx-0ctFUq8'),
(20, 'austinwoon@gmail.com', 'Austin Woon Quan', '88888888', 'volunteer', null, 'https://media-exp1.licdn.com/dms/image/C5103AQH9nm5CFMJ9GA/profile-displayphoto-shrink_400_400/0?e=1605744000&v=beta&t=IQdOsCf8Ivwni7Fy5Jgj35z6trijEwpCpH6JIw7rNCo'),
(21, 'fuxing@gmail.com', 'Loh Fuxing', '88888888', 'volunteer', null, 'https://media-exp1.licdn.com/dms/image/C5103AQEOkJn5C0PnoA/profile-displayphoto-shrink_800_800/0?e=1605744000&v=beta&t=9a-IEiG1_YyioaZYpbTxSZyIo0gmS7GRgBKlKQ7F1EY'),
(22, 'elilim@gmail.com', 'Eli Lim', '88888888', 'volunteer', '1b56339d-bb43-4089-a896-c31336c682f9', 'https://media-exp1.licdn.com/dms/image/C5603AQHl_BixhF9QOw/profile-displayphoto-shrink_400_400/0?e=1605744000&v=beta&t=8gkea6Yttezgjn5FA50MMl7DlKLBZ_M0ce-Bzj2E5U8'),
(23, 'sadeaf-admin@huansen.dev', 'admin2', '88888888', 'admin', '3bf5eeb7-a4d1-40f7-a7a8-1a05e28c41e9', null);

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
(2, 23);

INSERT INTO service_requestor(
    id, organisation, membership_id, account_id
) VALUES
(1, 'SMU', 1, 2),
(2, 'NTU', 1, 3),
(3, 'NUS', 1, 4),
(4, 'DBS', 1, 5);

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
(11, 'Shopee Pte Ltd', 'intern', 'Speech', null, null, 16, 9);

INSERT INTO volunteer(
    id, approval_status, account_id
) VALUES
(1, TRUE, 17),
(2, TRUE, 18),
(3, TRUE, 19),
(4, TRUE, 20),
(5, TRUE, 21),
(6, TRUE, 22);

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
    id, email_address, notification_setting_id
) VALUES
(1, 'admin_notification_email@gmail.com', 1),
(2, 'email_me_at_this_email@email.com', 2),
(3, 'bobby@gmail.com', 4);

INSERT INTO event (
    id, name, client_id, description, purpose
) VALUES
(1, 'IS111 - Intro to Programming', 1, 'Introductory programming class - very hands-on', 'School'),
(2, 'IS113 - Web Application Development', 2, 'Introductory programming class - very hands-on', 'School'),
(3, 'JPMorgan Winning Women', 1, 'Event promoting gender equality at JPMorgan', 'Workshop'),
(4, 'CodeIT Suisse', 3, 'Annual hackathon for recruitment and campus outreach', 'Workshop'),
(5, 'COMM169 - Management Communication', 3, 'CORE SMU module', 'School'),
(6, 'COMM169 - Management Communication', 4, 'CORE SMU module', 'School'),
(7, 'COMM169 - Management Communication', 5, 'CORE SMU module', 'School');

INSERT INTO assignment (
    id, event_id, status, start_dt, end_dt,
    address_line_one, address_line_two, postal, room_number, latitude, longitude,
    volunteer_id, honorarium_amount
) VALUES
(1, 1, 'MATCHED', CURRENT_TIMESTAMP + interval '2 hour', CURRENT_TIMESTAMP + interval '10 day',
 '1 Stanford Road', null, '123821', 'Haven 1A', 1.93821, 2.3247,
 1, 100),

(2, 1, 'PENDING', CURRENT_TIMESTAMP + interval '29 hour', CURRENT_TIMESTAMP + interval '4 day',
 '1 Stanford Road', null, '123821', 'Haven 1A', 1.93821, 2.3247,
 null, 100),

(3, 1, 'MATCHED', CURRENT_TIMESTAMP + interval '24 hour', CURRENT_TIMESTAMP + interval '10 day',
 '1 Stanford Road', null, '123821', 'Haven 1A', 1.93821, 2.3247,
 1, 100),

(4, 1, 'CANCELLED', CURRENT_TIMESTAMP - interval '1 day', CURRENT_TIMESTAMP,
 '12 Geyland St', '#03-54', '603482', 'Room 2C', 1.93821, 2.3247,
 null, 200),

(5, 2, 'COMPLETE', '2020-07-30T12:30:00.000Z', '2020-07-30T18:30:00.000Z',
 '11 Jalan Run St', '#01-23', '603482', 'Room 2B', 1.0123, 2.5962,
 1, 100),

(6, 3, 'COMPLETE', '2020-08-05T15:00:00.000Z', '2020-08-05T18:30:00.000Z',
 '300 West, New York', '#38-01', '213029', 'Conf. 1', 1.8231, 2.3051,
 1, 500),

(7, 3, 'MATCHED', '2020-08-05T15:00:00.000Z', '2020-08-05T18:30:00.000Z',
 '300 West, New York', '#38-01', '213029', 'Conf. 1', 1.8231, 2.3051,
 1, 500),

(8, 3, 'COMPLETE', '2020-08-12T15:00:00.000Z', '2020-08-12T18:30:00.000Z',
 '300 West, New York', '#38-01', '213029', 'Conf. 1', 1.8231, 2.3051,
 null, 500);

-- TODO: Add more assignments for the other clients + volunteers

INSERT INTO volunteer_assignment_opt_in (
    id, volunteer_id, assignment_id, status
) VALUES
(3, 2, 2, 'OPTED_IN'),
(4, 3, 2, 'OPTED_IN'),
(5, 3, 3, 'OPTED_IN'),
(6, 4, 4, 'OPTED_IN');

INSERT INTO feedback (
    id, event_id, volunteer_id, notetaker_punctual, notetaker_conduct, live_comments, live_information_understanding,
    live_interaction, post_session_comments, post_session_understanding, post_session_interaction,
    general_feedback, training_privacy_preference, confidentiality_privacy_preference
) VALUES
(1, 1, 1, true, 'good', 'very punctual', 'good', 'very good', 'neutral', 'good', 'very good', 'NA',
 true, true);

INSERT INTO interpretation_details (
    id, sign_system, filming_interpreters, allow_trainee_interpreters,number_of_deaf,
    number_of_hearing,event_id
) VALUES
(1, 'home system', true, true, 5, 100, 1);

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
