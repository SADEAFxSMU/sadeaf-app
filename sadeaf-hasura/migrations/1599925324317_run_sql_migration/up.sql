CREATE TYPE rating_enum as enum('1', '2', '3', '4', '5', 'n.a.');
CREATE TYPE privacy_enum as enum('anonymous', 'public', 'no');

ALTER TABLE "public"."feedback"
    ADD "notetaker_punctual_temp" rating_enum;

ALTER TABLE public.feedback
    DROP "notetaker_punctual";

ALTER TABLE public.feedback
RENAME COLUMN notetaker_punctual_temp TO notetaker_punctual;

ALTER TABLE public.feedback
    ADD "notetaker_conduct_temp" rating_enum;

ALTER TABLE public.feedback
    DROP "notetaker_conduct";

ALTER TABLE public.feedback
RENAME COLUMN notetaker_conduct_temp TO notetaker_conduct;

ALTER TABLE public.feedback
    ADD "live_information_understanding_temp" rating_enum;

ALTER TABLE public.feedback
    DROP "live_information_understanding";

ALTER TABLE public.feedback
RENAME COLUMN live_information_understanding_temp TO live_information_understanding;

ALTER TABLE public.feedback
    ADD "live_interactiont" rating_enum;

ALTER TABLE public.feedback
    DROP "live_interaction";

ALTER TABLE public.feedback
RENAME COLUMN live_interactiont TO live_interaction;

ALTER TABLE public.feedback
    ADD "post_session_understandingt" rating_enum;

ALTER TABLE public.feedback
    DROP "post_session_understanding";

ALTER TABLE public.feedback
RENAME COLUMN post_session_understandingt TO post_session_understanding;

ALTER TABLE public.feedback
    drop "post_session_interaction";

ALTER TABLE public.feedback
    ADD "training_privacy_preferencet" privacy_enum;

ALTER TABLE public.feedback
    DROP "training_privacy_preference";

ALTER TABLE public.feedback
RENAME COLUMN training_privacy_preferencet TO training_privacy_preference;

ALTER TABLE public.feedback
    ADD "confidentiality_privacy_preferencet" privacy_enum;

ALTER TABLE public.feedback
    DROP "confidentiality_privacy_preference";

ALTER TABLE public.feedback
RENAME COLUMN confidentiality_privacy_preferencet TO confidentiality_privacy_preference;
