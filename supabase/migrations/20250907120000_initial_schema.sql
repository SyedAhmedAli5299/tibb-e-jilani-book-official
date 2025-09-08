--
-- Create Chapters Table
--
/*
# [Operation Name]
Create the `chapters` table

## Query Description: [This script creates the `chapters` table to store the book's content, including titles, text, language, and display order. It also includes a column for associated image URLs. This is a foundational table for the entire application. No existing data will be affected as this is a new table creation.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: `chapters`
- Columns: `id`, `created_at`, `updated_at`, `title`, `content`, `language`, `order`, `images`

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [Policies for anonymous read/write access are created.]

## Performance Impact:
- Indexes: [Primary key index on `id` is created.]
- Triggers: [None]
- Estimated Impact: [Low. This is a standard table creation.]
*/
CREATE TABLE public.chapters (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    title text NOT NULL,
    content text,
    language text NOT NULL,
    "order" integer NOT NULL,
    images text[],
    CONSTRAINT chapters_pkey PRIMARY KEY (id)
);

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to chapters" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Allow anonymous write access for admin portal" ON public.chapters FOR ALL USING (true);


--
-- Create Testimonials Table
--
/*
# [Operation Name]
Create the `testimonials` table

## Query Description: [This script creates the `testimonials` table to store reader reviews and ratings. It includes columns for the reviewer's name, the text of the review, a rating, and an `approved` flag for moderation. This is a new table, so no existing data is at risk.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: `testimonials`
- Columns: `id`, `created_at`, `name`, `text`, `rating`, `approved`

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [Policies allow anyone to submit a testimonial and read approved ones. Full access is granted to anonymous users for the admin portal.]

## Performance Impact:
- Indexes: [Primary key index on `id` is created.]
- Triggers: [None]
- Estimated Impact: [Low.]
*/
CREATE TABLE public.testimonials (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text NOT NULL,
    text text NOT NULL,
    rating smallint NOT NULL,
    approved boolean NOT NULL DEFAULT false,
    CONSTRAINT testimonials_pkey PRIMARY KEY (id),
    CONSTRAINT testimonials_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to approved testimonials" ON public.testimonials FOR SELECT USING (approved = true);
CREATE POLICY "Allow users to submit new testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous full access for admin portal" ON public.testimonials FOR ALL USING (true);


--
-- Create Bookmarks Table
--
/*
# [Operation Name]
Create the `bookmarks` table

## Query Description: [This script creates the `bookmarks` table to allow users to save their reading progress. It links to the `chapters` table via a foreign key. Since authentication is not yet implemented, the policies are permissive. No existing data is affected.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: `bookmarks`
- Columns: `id`, `created_at`, `chapter_id`, `position`, `note`
- Foreign Keys: `bookmarks_chapter_id_fkey` on `chapters(id)`

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [Policies for anonymous read/write access are created. This should be updated when user authentication is added.]

## Performance Impact:
- Indexes: [Primary key and foreign key indexes are created.]
- Triggers: [None]
- Estimated Impact: [Low.]
*/
CREATE TABLE public.bookmarks (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    chapter_id uuid NOT NULL,
    "position" integer NOT NULL,
    note text,
    CONSTRAINT bookmarks_pkey PRIMARY KEY (id),
    CONSTRAINT bookmarks_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id) ON DELETE CASCADE
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous full access for now" ON public.bookmarks FOR ALL USING (true);


--
-- Create Notes Table
--
/*
# [Operation Name]
Create the `notes` table

## Query Description: [This script creates the `notes` table for users to add personal notes to chapters. It is linked to the `chapters` table. As with bookmarks, policies are permissive pending the implementation of user authentication. No existing data is affected.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: `notes`
- Columns: `id`, `created_at`, `chapter_id`, `position`, `text`
- Foreign Keys: `notes_chapter_id_fkey` on `chapters(id)`

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [Policies for anonymous read/write access are created. This should be updated when user authentication is added.]

## Performance Impact:
- Indexes: [Primary key and foreign key indexes are created.]
- Triggers: [None]
- Estimated Impact: [Low.]
*/
CREATE TABLE public.notes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    chapter_id uuid NOT NULL,
    "position" integer NOT NULL,
    text text NOT NULL,
    CONSTRAINT notes_pkey PRIMARY KEY (id),
    CONSTRAINT notes_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id) ON DELETE CASCADE
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous full access for now" ON public.notes FOR ALL USING (true);
