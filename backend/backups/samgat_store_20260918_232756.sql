--
-- PostgreSQL database dump
--

\restrict 5yCo1E25iIkbR2NI70B0cVeuPKdhAcQEOIPRrPgLPpudsqmvAhWjODzZaQdoznB

-- Dumped from database version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)
-- Dumped by pg_dump version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: samgat_user
--

CREATE TYPE public.order_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public.order_status OWNER TO samgat_user;

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: samgat_user
--

CREATE TYPE public.payment_status AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public.payment_status OWNER TO samgat_user;

--
-- Name: stock_movement_type; Type: TYPE; Schema: public; Owner: samgat_user
--

CREATE TYPE public.stock_movement_type AS ENUM (
    'IN',
    'OUT',
    'ADJUSTMENT'
);


ALTER TYPE public.stock_movement_type OWNER TO samgat_user;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: samgat_user
--

CREATE TYPE public.user_role AS ENUM (
    'CUSTOMER',
    'ADMIN'
);


ALTER TYPE public.user_role OWNER TO samgat_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: samgat_user
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.cart_items OWNER TO samgat_user;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: samgat_user
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO samgat_user;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: samgat_user
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: samgat_user
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.carts OWNER TO samgat_user;

--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: samgat_user
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_id_seq OWNER TO samgat_user;

--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: samgat_user
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: samgat_user
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(120) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.categories OWNER TO samgat_user;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: samgat_user
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO samgat_user;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: samgat_user
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: samgat_user
--

CREATE TABLE public.inventory (
    id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT inventory_quantity_check CHECK ((quantity >= 0))
);


ALTER TABLE public.inventory OWNER TO samgat_user;

--
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: samgat_user
--

CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_id_seq OWNER TO samgat_user;

--
-- Name: inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: samgat_user
--

ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: samgat_user
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    price numeric(12,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT order_items_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT order_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.order_items OWNER TO samgat_user;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: samgat_user
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO samgat_user;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: samgat_user
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: samgat_user
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    status public.order_status DEFAULT 'PENDING'::public.order_status NOT NULL,
    payment_status public.payment_status DEFAULT 'PENDING'::public.payment_status NOT NULL,
    total numeric(12,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT orders_total_check CHECK ((total >= (0)::numeric))
);


ALTER TABLE public.orders OWNER TO samgat_user;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: samgat_user
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO samgat_user;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: samgat_user
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: samgat_user
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    slug character varying(180) NOT NULL,
    description text,
    price numeric(12,2) NOT NULL,
    category_id integer NOT NULL,
    image_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT products_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.products OWNER TO samgat_user;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: samgat_user
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO samgat_user;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: samgat_user
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: stock_movements; Type: TABLE; Schema: public; Owner: samgat_user
--

CREATE TABLE public.stock_movements (
    id integer NOT NULL,
    product_id integer NOT NULL,
    type public.stock_movement_type NOT NULL,
    quantity integer NOT NULL,
    reason character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT stock_movements_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.stock_movements OWNER TO samgat_user;

--
-- Name: stock_movements_id_seq; Type: SEQUENCE; Schema: public; Owner: samgat_user
--

CREATE SEQUENCE public.stock_movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_movements_id_seq OWNER TO samgat_user;

--
-- Name: stock_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: samgat_user
--

ALTER SEQUENCE public.stock_movements_id_seq OWNED BY public.stock_movements.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: samgat_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    role public.user_role DEFAULT 'CUSTOMER'::public.user_role NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO samgat_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: samgat_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO samgat_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: samgat_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: stock_movements id; Type: DEFAULT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.stock_movements ALTER COLUMN id SET DEFAULT nextval('public.stock_movements_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: samgat_user
--

COPY public.cart_items (id, cart_id, product_id, quantity, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: samgat_user
--

COPY public.carts (id, user_id, created_at, updated_at) FROM stdin;
1	1	2026-09-03 15:22:07.645	2026-09-03 15:22:07.645
2	4	2026-09-14 22:47:51.95	2026-09-14 22:47:51.95
3	5	2026-09-16 17:21:26.478	2026-09-16 17:21:26.478
4	6	2026-09-16 23:15:48.505	2026-09-16 23:15:48.505
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: samgat_user
--

COPY public.categories (id, name, slug, description, created_at, updated_at) FROM stdin;
1	Eletrônicos	eletronicos	Produtos eletrônicos	2026-09-03 14:44:10.825	2026-09-03 14:44:10.825
2	TECNO	Melhores da marca Tecno	Telemóveis da marca tecno\n	2026-09-14 22:16:02.183	2026-09-14 22:16:02.183
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: samgat_user
--

COPY public.inventory (id, product_id, quantity, updated_at) FROM stdin;
4	2	0	2026-09-14 22:26:53.362
3	3	5	2026-09-18 22:08:51.477
1	1	133	2026-09-18 22:08:51.512
5	4	0	2026-09-18 22:08:51.531
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: samgat_user
--

COPY public.order_items (id, order_id, product_id, quantity, price, created_at) FROM stdin;
4	4	1	2	250000.00	2026-09-03 16:17:52.732
5	5	1	1	250000.00	2026-09-12 19:36:14.71
6	6	3	1	1000000.00	2026-09-16 17:21:46.179
7	7	1	1	250000.00	2026-09-16 23:15:48.761
8	8	1	1	250000.00	2026-09-17 00:05:30.871
9	9	1	1	250000.00	2026-09-17 00:15:36.307
10	10	3	1	1000000.00	2026-09-17 00:18:26.692
11	11	3	3	1000000.00	2026-09-18 22:08:51.447
12	11	1	17	250000.00	2026-09-18 22:08:51.458
13	11	4	1	1000.00	2026-09-18 22:08:51.465
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: samgat_user
--

COPY public.orders (id, user_id, status, payment_status, total, created_at, updated_at) FROM stdin;
4	1	CANCELLED	PAID	500000.00	2026-09-03 16:17:52.729	2026-09-14 23:23:09.351
6	5	CONFIRMED	PAID	1000000.00	2026-09-16 17:21:46.165	2026-09-16 17:49:14.444
5	1	CANCELLED	FAILED	250000.00	2026-09-12 19:36:14.696	2026-09-16 17:49:39.669
7	6	PENDING	PENDING	250000.00	2026-09-16 23:15:48.747	2026-09-16 23:15:48.747
8	4	PENDING	PENDING	250000.00	2026-09-17 00:05:30.859	2026-09-17 00:05:30.859
9	4	PENDING	PENDING	250000.00	2026-09-17 00:15:36.298	2026-09-17 00:15:36.298
10	4	PENDING	PENDING	1000000.00	2026-09-17 00:18:26.684	2026-09-17 00:18:26.684
11	5	PENDING	PENDING	7251000.00	2026-09-18 22:08:51.421	2026-09-18 22:08:51.421
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: samgat_user
--

COPY public.products (id, name, slug, description, price, category_id, image_url, is_active, created_at, updated_at) FROM stdin;
1	Smartphone XYZ	smartphone-xyz	Smartphone de última geração	250000.00	1	https://example.com/smartphone.jpg	t	2026-09-03 14:44:10.924	2026-09-03 14:44:10.924
3	TECNO	tecno	Melhores	1000000.00	2	\N	t	2026-09-14 22:12:41.765	2026-09-14 22:12:41.765
2	Iphone 17	iphone-17	Os mais recentes	120000.00	1	https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800	f	2026-09-12 22:38:58.419	2026-09-12 22:38:58.419
4	Produto Teste XSS	produto-teste-xss	<script>alert('XSS')</script>	1000.00	1	\N	t	2026-09-16 22:44:50.2	2026-09-16 22:44:50.2
\.


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: samgat_user
--

COPY public.stock_movements (id, product_id, type, quantity, reason, created_at) FROM stdin;
1	1	IN	50	Reposição	2026-09-12 16:31:20.308
2	1	OUT	1	Venda - Pedido #5	2026-09-12 19:36:14.738
3	1	IN	1	Entrada de stock por admin #1	2026-09-14 22:05:05.951
4	3	IN	10	Stock inicial na criação do produto	2026-09-14 22:12:41.828
5	1	IN	2	Devolução - Pedido #4 cancelado	2026-09-14 23:23:09.409
6	3	OUT	1	Venda - Pedido #6	2026-09-16 17:21:46.208
7	1	IN	1	Devolução - Pedido #5 cancelado	2026-09-16 17:49:24.012
8	4	IN	1	Stock inicial na criação do produto	2026-09-16 22:44:50.384
9	1	OUT	1	Venda - Pedido #7	2026-09-16 23:15:48.816
10	1	OUT	1	Venda - Pedido #8	2026-09-17 00:05:30.897
11	1	OUT	1	Venda - Pedido #9	2026-09-17 00:15:36.328
12	3	OUT	1	Venda - Pedido #10	2026-09-17 00:18:26.716
13	3	OUT	3	Venda - Pedido #11	2026-09-18 22:08:51.49
14	1	OUT	17	Venda - Pedido #11	2026-09-18 22:08:51.522
15	4	OUT	1	Venda - Pedido #11	2026-09-18 22:08:51.539
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: samgat_user
--

COPY public.users (id, name, email, password, role, created_at, updated_at) FROM stdin;
1	Samuel	samuel@teste.com	$2a$12$MU/Y1GoL9dtTwzpj1xEnw.0dqFh.gybJTJnkavxmTbRf8mdEjVIXK	ADMIN	2026-09-03 13:59:40.629	2026-09-03 13:59:40.629
2	Teste User	teste2@exemplo.com	$2a$12$MzwqQDMD7Cwgu.o/8coF2OoHMz8KjEK9F7G6aSJiLdxJeUp3i/xFC	CUSTOMER	2026-09-12 23:11:36.587	2026-09-12 23:11:36.587
3	Teste Novo	novo.teste@exemplo.com	$2a$12$3U.HiVJvL1AvRrOby4068.Lc01rNp1Mvi2umrLSWzov1VnI/9PDuq	CUSTOMER	2026-09-14 22:25:52.288	2026-09-14 22:25:52.288
4	Miguel	samuelviegas467@gmail.com	$2a$12$js/Yv4YXIvXAyM6S1uKmuOhsl8aHG4AOL5QuVDhwK4.5gcPMlvH9e	CUSTOMER	2026-09-14 22:47:26.079	2026-09-14 22:47:26.079
5	Luís	eu@gmail.com	$2a$12$LsNI4aVJ9F9u64PLDJHJ2uY0fuYzAS5jCkfZIF5dNRQnMb1ORKcwK	CUSTOMER	2026-09-16 16:32:14.778	2026-09-16 16:32:14.778
6	Maria Silva	maria@teste.com	$2a$12$fyqVdBeBoUh2LNDJo.EnMe7z5xvJF4ygqDwj8caqUYAHb34DwfBY.	CUSTOMER	2026-09-16 23:12:25.876	2026-09-16 23:12:25.876
\.


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: samgat_user
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 12, true);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: samgat_user
--

SELECT pg_catalog.setval('public.carts_id_seq', 4, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: samgat_user
--

SELECT pg_catalog.setval('public.categories_id_seq', 2, true);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: samgat_user
--

SELECT pg_catalog.setval('public.inventory_id_seq', 5, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: samgat_user
--

SELECT pg_catalog.setval('public.order_items_id_seq', 13, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: samgat_user
--

SELECT pg_catalog.setval('public.orders_id_seq', 11, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: samgat_user
--

SELECT pg_catalog.setval('public.products_id_seq', 4, true);


--
-- Name: stock_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: samgat_user
--

SELECT pg_catalog.setval('public.stock_movements_id_seq', 15, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: samgat_user
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: carts carts_user_id_key; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_key UNIQUE (user_id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_product_id_key; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_id_key UNIQUE (product_id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- Name: stock_movements stock_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_pkey PRIMARY KEY (id);


--
-- Name: cart_items unique_cart_product; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cart_items fk_cart_item_cart; Type: FK CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: cart_items fk_cart_item_product; Type: FK CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk_cart_item_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: carts fk_cart_user; Type: FK CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: inventory fk_inventory_product; Type: FK CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: order_items fk_order_item_order; Type: FK CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items fk_order_item_product; Type: FK CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: orders fk_order_user; Type: FK CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: products fk_product_category; Type: FK CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT;


--
-- Name: stock_movements fk_stock_product; Type: FK CONSTRAINT; Schema: public; Owner: samgat_user
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT fk_stock_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 5yCo1E25iIkbR2NI70B0cVeuPKdhAcQEOIPRrPgLPpudsqmvAhWjODzZaQdoznB

