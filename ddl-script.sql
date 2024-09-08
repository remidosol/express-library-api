--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4 (Debian 15.4-2.pgdg120+1)
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-07 18:01:34 +03

SET statement_timeout
= 0;
SET lock_timeout
= 0;
SET idle_in_transaction_session_timeout
= 0;
SET client_encoding
= 'UTF8';
SET standard_conforming_strings
= on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies
= false;
SET xmloption
= content;
SET client_min_messages
= warning;
SET row_security
= off;

SET default_tablespace
= '';

SET default_table_access_method
= heap;

--
-- TOC entry 215 (class 1259 OID 16390)
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books
(
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    score double precision DEFAULT '0'
    ::double precision NOT NULL
);


    ALTER TABLE public.books OWNER TO postgres;

    --
    -- TOC entry 214 (class 1259 OID 16389)
    -- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
    --

    CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


    ALTER SEQUENCE public.books_id_seq
    OWNER TO postgres;

    --
    -- TOC entry 3369 (class 0 OID 0)
    -- Dependencies: 214
    -- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
    --

    ALTER SEQUENCE public.books_id_seq
    OWNED BY public.books.id;


    --
    -- TOC entry 217 (class 1259 OID 16397)
    -- Name: borrow_records; Type: TABLE; Schema: public; Owner: postgres
    --

    CREATE TABLE public.borrow_records
    (
        id integer NOT NULL,
        "isReturned" boolean DEFAULT false NOT NULL,
        "userScore" integer DEFAULT 0 NOT NULL,
        "userId" integer,
        "bookId" integer
    );


    ALTER TABLE public.borrow_records OWNER TO postgres;

    --
    -- TOC entry 216 (class 1259 OID 16396)
    -- Name: borrow_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
    --

    CREATE SEQUENCE public.borrow_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


    ALTER SEQUENCE public.borrow_records_id_seq
    OWNER TO postgres;

    --
    -- TOC entry 3370 (class 0 OID 0)
    -- Dependencies: 216
    -- Name: borrow_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
    --

    ALTER SEQUENCE public.borrow_records_id_seq
    OWNED BY public.borrow_records.id;


    --
    -- TOC entry 219 (class 1259 OID 16406)
    -- Name: users; Type: TABLE; Schema: public; Owner: postgres
    --

    CREATE TABLE public.users
    (
        id integer NOT NULL,
        name character varying(100) NOT NULL
    );


    ALTER TABLE public.users OWNER TO postgres;

    --
    -- TOC entry 218 (class 1259 OID 16405)
    -- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
    --

    CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


    ALTER SEQUENCE public.users_id_seq
    OWNER TO postgres;

    --
    -- TOC entry 3371 (class 0 OID 0)
    -- Dependencies: 218
    -- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
    --

    ALTER SEQUENCE public.users_id_seq
    OWNED BY public.users.id;


    --
    -- TOC entry 3206 (class 2604 OID 16393)
    -- Name: books id; Type: DEFAULT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.books
    ALTER COLUMN id
    SET
    DEFAULT nextval
    ('public.books_id_seq'::regclass);


    --
    -- TOC entry 3208 (class 2604 OID 16400)
    -- Name: borrow_records id; Type: DEFAULT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.borrow_records
    ALTER COLUMN id
    SET
    DEFAULT nextval
    ('public.borrow_records_id_seq'::regclass);


    --
    -- TOC entry 3211 (class 2604 OID 16409)
    -- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.users
    ALTER COLUMN id
    SET
    DEFAULT nextval
    ('public.users_id_seq'::regclass);


    --
    -- TOC entry 3217 (class 2606 OID 16411)
    -- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY
    (id);


    --
    -- TOC entry 3215 (class 2606 OID 16404)
    -- Name: borrow_records PK_b403bf5f85354e7a86867585152; Type: CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.borrow_records
    ADD CONSTRAINT "PK_b403bf5f85354e7a86867585152" PRIMARY KEY
    (id);


    --
    -- TOC entry 3213 (class 2606 OID 16395)
    -- Name: books PK_f3f2f25a099d24e12545b70b022; Type: CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.books
    ADD CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY
    (id);


    --
    -- TOC entry 3219 (class 2606 OID 16423)
    -- Name: users UQ_51b8b26ac168fbe7d6f5653e6cf; Type: CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE
    (name);


    --
    -- TOC entry 3220 (class 2606 OID 16412)
    -- Name: borrow_records FK_9d017dbb09f6e3cd8f15002e354; Type: FK CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.borrow_records
    ADD CONSTRAINT "FK_9d017dbb09f6e3cd8f15002e354" FOREIGN KEY
    ("userId") REFERENCES public.users
    (id);


    --
    -- TOC entry 3221 (class 2606 OID 16417)
    -- Name: borrow_records FK_c52344b2e6920513d0bdeeca111; Type: FK CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.borrow_records
    ADD CONSTRAINT "FK_c52344b2e6920513d0bdeeca111" FOREIGN KEY
    ("bookId") REFERENCES public.books
    (id);


-- Completed on 2024-09-07 18:01:34 +03

--
-- PostgreSQL database dump complete
--