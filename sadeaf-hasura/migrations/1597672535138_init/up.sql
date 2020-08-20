CREATE FUNCTION public.ensure_at_most_one_active_membership() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE membership_id INT;
DECLARE active_count INT;
BEGIN
    SELECT id, COUNT(*) INTO membership_id, active_count FROM membership WHERE account_id = NEW.account_id AND status = 'ACTIVE' GROUP BY id;
    IF NEW.id != membership_id AND NEW.status = 'ACTIVE' AND active_count > 0 THEN
        RAISE EXCEPTION 'Cannot have more than 1 active membership for account %',  NEW.account_id;
    END IF;
    RETURN NEW;
END;
$$;
CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
CREATE TABLE public.account (
    id integer NOT NULL,
    username character varying(30) NOT NULL,
    password character varying(30) NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    contact character varying(20),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.account_id_seq OWNED BY public.account.id;
CREATE TABLE public.admin (
    id integer NOT NULL,
    account_id integer NOT NULL
);
CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;
CREATE TABLE public.assignment (
    id integer NOT NULL,
    event_id integer NOT NULL,
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    start_dt timestamp without time zone NOT NULL,
    end_dt timestamp without time zone NOT NULL,
    address_line_one character varying(255),
    address_line_two character varying(255),
    room_number character varying(20),
    postal character varying(6),
    latitude double precision,
    longitude double precision,
    volunteer_id integer NOT NULL,
    honorarium_amount double precision,
    attendance_id integer
);
CREATE SEQUENCE public.assignment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.assignment_id_seq OWNED BY public.assignment.id;
CREATE TABLE public.attendance (
    id integer NOT NULL,
    has_dispute boolean NOT NULL,
    dispute_comment text,
    attended boolean NOT NULL
);
CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;
CREATE TABLE public.client (
    id integer NOT NULL,
    organisation character varying(255),
    designation character varying(50),
    preferred_comm_mode character varying(30) NOT NULL,
    additional_notes text,
    service_requestor_id integer,
    account_id integer NOT NULL
);
CREATE SEQUENCE public.client_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.client_id_seq OWNED BY public.client.id;
CREATE TABLE public.email_information (
    id integer NOT NULL,
    email_address character varying(255) NOT NULL,
    notification_setting_id integer NOT NULL
);
CREATE SEQUENCE public.email_information_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.email_information_id_seq OWNED BY public.email_information.id;
CREATE TABLE public.event (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    client_id integer NOT NULL,
    description text,
    purpose character varying(100),
    quotation numeric NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.event_id_seq OWNED BY public.event.id;
CREATE TABLE public.feedback (
    id integer NOT NULL,
    notetaker_punctual boolean NOT NULL,
    notetaker_conduct character varying(50) NOT NULL,
    live_comments text,
    live_information_understanding character varying(50) NOT NULL,
    live_interaction character varying(50) NOT NULL,
    post_session_comments text,
    post_session_understanding character varying(50) NOT NULL,
    post_session_interaction character varying(50) NOT NULL,
    general_feedback text,
    training_privacy_preference boolean NOT NULL,
    confidentiality_privacy_preference boolean NOT NULL,
    client_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    assignment_id integer
);
CREATE SEQUENCE public.feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;
CREATE TABLE public.interpretation_details (
    id integer NOT NULL,
    sign_system character varying(255) NOT NULL,
    filming_interpreters boolean NOT NULL,
    allow_trainee_interpreters boolean NOT NULL,
    number_of_deaf integer NOT NULL,
    number_of_hearing integer NOT NULL,
    event_id integer
);
CREATE SEQUENCE public.interpretation_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.interpretation_details_id_seq OWNED BY public.interpretation_details.id;
CREATE TABLE public.invoice (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    amount numeric NOT NULL,
    event_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.invoice_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.invoice_id_seq OWNED BY public.invoice.id;
CREATE TABLE public.membership (
    id integer NOT NULL,
    account_id integer NOT NULL,
    membership_type_id integer NOT NULL,
    status character varying(50) NOT NULL,
    free_sessions_remaining numeric NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.membership_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.membership_id_seq OWNED BY public.membership.id;
CREATE TABLE public.membership_renewals (
    id integer NOT NULL,
    membership_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.membership_renewals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.membership_renewals_id_seq OWNED BY public.membership_renewals.id;
CREATE TABLE public.membership_type (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    cost numeric NOT NULL,
    duration_in_days integer NOT NULL,
    description text
);
CREATE SEQUENCE public.membership_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.membership_type_id_seq OWNED BY public.membership_type.id;
CREATE TABLE public.notification_setting (
    id integer NOT NULL,
    account_id integer NOT NULL
);
CREATE SEQUENCE public.notification_setting_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.notification_setting_id_seq OWNED BY public.notification_setting.id;
CREATE TABLE public.service_requestor (
    id integer NOT NULL,
    organisation character varying(255) NOT NULL,
    membership_id integer NOT NULL,
    account_id integer NOT NULL
);
CREATE SEQUENCE public.service_requestor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.service_requestor_id_seq OWNED BY public.service_requestor.id;
CREATE TABLE public.telegram_information (
    id integer NOT NULL,
    chat_id bigint NOT NULL,
    notification_setting_id integer NOT NULL
);
CREATE SEQUENCE public.telegram_information_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.telegram_information_id_seq OWNED BY public.telegram_information.id;
CREATE TABLE public.volunteer (
    id integer NOT NULL,
    approval_status boolean NOT NULL,
    account_id integer NOT NULL
);
CREATE SEQUENCE public.volunteer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.volunteer_id_seq OWNED BY public.volunteer.id;
ALTER TABLE ONLY public.account ALTER COLUMN id SET DEFAULT nextval('public.account_id_seq'::regclass);
ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);
ALTER TABLE ONLY public.assignment ALTER COLUMN id SET DEFAULT nextval('public.assignment_id_seq'::regclass);
ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);
ALTER TABLE ONLY public.client ALTER COLUMN id SET DEFAULT nextval('public.client_id_seq'::regclass);
ALTER TABLE ONLY public.email_information ALTER COLUMN id SET DEFAULT nextval('public.email_information_id_seq'::regclass);
ALTER TABLE ONLY public.event ALTER COLUMN id SET DEFAULT nextval('public.event_id_seq'::regclass);
ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);
ALTER TABLE ONLY public.interpretation_details ALTER COLUMN id SET DEFAULT nextval('public.interpretation_details_id_seq'::regclass);
ALTER TABLE ONLY public.invoice ALTER COLUMN id SET DEFAULT nextval('public.invoice_id_seq'::regclass);
ALTER TABLE ONLY public.membership ALTER COLUMN id SET DEFAULT nextval('public.membership_id_seq'::regclass);
ALTER TABLE ONLY public.membership_renewals ALTER COLUMN id SET DEFAULT nextval('public.membership_renewals_id_seq'::regclass);
ALTER TABLE ONLY public.membership_type ALTER COLUMN id SET DEFAULT nextval('public.membership_type_id_seq'::regclass);
ALTER TABLE ONLY public.notification_setting ALTER COLUMN id SET DEFAULT nextval('public.notification_setting_id_seq'::regclass);
ALTER TABLE ONLY public.service_requestor ALTER COLUMN id SET DEFAULT nextval('public.service_requestor_id_seq'::regclass);
ALTER TABLE ONLY public.telegram_information ALTER COLUMN id SET DEFAULT nextval('public.telegram_information_id_seq'::regclass);
ALTER TABLE ONLY public.volunteer ALTER COLUMN id SET DEFAULT nextval('public.volunteer_id_seq'::regclass);
ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_email_key UNIQUE (email);
ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_username_key UNIQUE (username);
ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_account_id_key UNIQUE (account_id);
ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_account_id_key UNIQUE (account_id);
ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.email_information
    ADD CONSTRAINT email_information_notification_setting_id_key UNIQUE (notification_setting_id);
ALTER TABLE ONLY public.email_information
    ADD CONSTRAINT email_information_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_assignment_id_key UNIQUE (assignment_id);
ALTER TABLE ONLY public.interpretation_details
    ADD CONSTRAINT interpretation_details_event_id_key UNIQUE (event_id);
ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT invoice_event_id_key UNIQUE (event_id);
ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT invoice_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_account_id_membership_type_id_status_key UNIQUE (account_id, membership_type_id, status);
ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.membership_renewals
    ADD CONSTRAINT membership_renewals_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.membership_type
    ADD CONSTRAINT membership_type_name_key UNIQUE (name);
ALTER TABLE ONLY public.membership_type
    ADD CONSTRAINT membership_type_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notification_setting
    ADD CONSTRAINT notification_setting_account_id_key UNIQUE (account_id);
ALTER TABLE ONLY public.notification_setting
    ADD CONSTRAINT notification_setting_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.service_requestor
    ADD CONSTRAINT service_requestor_account_id_key UNIQUE (account_id);
ALTER TABLE ONLY public.service_requestor
    ADD CONSTRAINT service_requestor_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.telegram_information
    ADD CONSTRAINT telegram_information_notification_setting_id_key UNIQUE (notification_setting_id);
ALTER TABLE ONLY public.telegram_information
    ADD CONSTRAINT telegram_information_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.volunteer
    ADD CONSTRAINT volunteer_account_id_key UNIQUE (account_id);
ALTER TABLE ONLY public.volunteer
    ADD CONSTRAINT volunteer_pkey PRIMARY KEY (id);
CREATE TRIGGER ensure_at_most_one_active_membership_trigger BEFORE INSERT OR UPDATE ON public.membership FOR EACH ROW EXECUTE FUNCTION public.ensure_at_most_one_active_membership();
CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.account FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();
CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.event FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();
CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.feedback FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();
CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.invoice FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();
CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON public.membership FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();
ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id);
ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_attendance_id_fkey FOREIGN KEY (attendance_id) REFERENCES public.attendance(id);
ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(id);
ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.volunteer(id);
ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id);
ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_service_requestor_id_fkey FOREIGN KEY (service_requestor_id) REFERENCES public.service_requestor(id);
ALTER TABLE ONLY public.email_information
    ADD CONSTRAINT email_information_notification_setting_id_fkey FOREIGN KEY (notification_setting_id) REFERENCES public.notification_setting(id);
ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(id);
ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignment(id);
ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(id);
ALTER TABLE ONLY public.interpretation_details
    ADD CONSTRAINT interpretation_details_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(id);
ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT invoice_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(id);
ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id);
ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_membership_type_id_fkey FOREIGN KEY (membership_type_id) REFERENCES public.membership_type(id);
ALTER TABLE ONLY public.membership_renewals
    ADD CONSTRAINT membership_renewals_membership_id_fkey FOREIGN KEY (membership_id) REFERENCES public.membership(id);
ALTER TABLE ONLY public.notification_setting
    ADD CONSTRAINT notification_setting_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id);
ALTER TABLE ONLY public.service_requestor
    ADD CONSTRAINT service_requestor_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id);
ALTER TABLE ONLY public.service_requestor
    ADD CONSTRAINT service_requestor_membership_id_fkey FOREIGN KEY (membership_id) REFERENCES public.membership(id);
ALTER TABLE ONLY public.telegram_information
    ADD CONSTRAINT telegram_information_notification_setting_id_fkey FOREIGN KEY (notification_setting_id) REFERENCES public.notification_setting(id);
ALTER TABLE ONLY public.volunteer
    ADD CONSTRAINT volunteer_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id);
