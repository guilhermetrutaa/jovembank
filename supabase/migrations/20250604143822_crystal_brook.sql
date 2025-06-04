/*
  # Create Pix payments table

  1. New Tables
    - `pix_payments`
      - `id` (uuid, primary key)
      - `installment_id` (integer)
      - `amount` (decimal)
      - `status` (text)
      - `pix_code` (text)
      - `qr_code` (text)
      - `created_at` (timestamp)
      - `paid_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `pix_payments` table
    - Add policies for authenticated users to:
      - Create their own payments
      - Read their own payments
      - Update their own payments
*/

CREATE TABLE IF NOT EXISTS pix_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  installment_id integer NOT NULL,
  amount decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  pix_code text NOT NULL,
  qr_code text NOT NULL,
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz,
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE pix_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own payments"
  ON pix_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own payments"
  ON pix_payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments"
  ON pix_payments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);