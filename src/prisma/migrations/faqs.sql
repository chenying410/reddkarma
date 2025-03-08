/*
 Navicat Premium Data Transfer

 Source Server         : postgresql
 Source Server Type    : PostgreSQL
 Source Server Version : 170002 (170002)
 Source Host           : localhost:5432
 Source Catalog        : postgres
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 170002 (170002)
 File Encoding         : 65001

 Date: 20/02/2025 02:28:43
*/


-- ----------------------------
-- Table structure for faqs
-- ----------------------------
DROP TABLE IF EXISTS "public"."faqs";
CREATE TABLE "public"."faqs" (
  "id" int4 NOT NULL DEFAULT nextval('faqs_id_seq'::regclass),
  "question" text COLLATE "pg_catalog"."default" NOT NULL,
  "answer" text COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of faqs
-- ----------------------------
INSERT INTO "public"."faqs" VALUES (4, 'How do I create an account?', 'Click on the "Sign Up" button and follow the instructions to register.', '2025-02-18 00:44:40.009', '2025-02-18 00:44:22');
INSERT INTO "public"."faqs" VALUES (5, 'I forgot my password. How can I reset it?', ' Click on "Forgot Password?" on the login page and follow the steps to reset it.', '2025-02-18 00:44:59.77', '2025-02-18 00:44:44');
INSERT INTO "public"."faqs" VALUES (6, 'How do I delete my account?', 'Please contact our support team at [email/contact] to request account deletion.', '2025-02-18 00:45:26.188', '2025-02-18 00:45:02');
INSERT INTO "public"."faqs" VALUES (1, 'How can I contact customer support?', 'Q: What services do you offer?
A: We offer [list services], including [examples of your key services].

Q: Do you offer membership or subscriptions?
A: Yes, we have membership plans that provide exclusive benefits.

Q: Can I customize my experience on your platform?
A: Yes, you can personalize your profile and settings as per your preferences.', '2025-02-18 00:43:54.247', '2025-02-18 00:43:52');
INSERT INTO "public"."faqs" VALUES (3, 'What are your operating hours?', 'Q: What services do you offer?
A: We offer [list services], including [examples of your key services].

Q: Do you offer membership or subscriptions?
A: Yes, we have membership plans that provide exclusive benefits.

Q: Can I customize my experience on your platform?
A: Yes, you can personalize your profile and settings as per your preferences.', '2025-02-18 00:44:19.855', '2025-02-18 00:43:56');

-- ----------------------------
-- Primary Key structure for table faqs
-- ----------------------------
ALTER TABLE "public"."faqs" ADD CONSTRAINT "faqs_pkey" PRIMARY KEY ("id");
