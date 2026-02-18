# Database Schema Design

## ER Diagram (Text Representation)

### `profiles` (Public Profile linked to Auth)
- `id` (uuid, pk, fk: auth.users)
- `full_name` (text)
- `role` (enum: 'member', 'staff', 'owner')
- `loyalty_points` (int)
- `tier` (enum: 'bronze', 'silver', 'gold')
- `avatar_url` (text)

### `tables` (Billiard Tables)
- `id` (uuid, pk)
- `name` (text) - e.g., "Meja 01 (VVIP)"
- `status` (enum: 'available', 'occupied', 'reserved', 'maintenance')
- `price_per_hour` (numeric)
- `metadata` (jsonb) - e.g., { "brand": "Gabriels", "size": "9ft" }

### `bookings` (Transactions)
- `id` (uuid, pk)
- `user_id` (uuid, fk: profiles)
- `table_id` (uuid, fk: tables)
- `start_time` (timestamptz)
- `end_time` (timestamptz)
- `total_price` (numeric)
- `status` (enum: 'pending', 'waiting_confirmation', 'confirmed', 'cancelled', 'completed')
- `payment_proof_url` (text)
- `created_at` (timestamptz)

### `audit_logs` (Security & Tracking)
- `id` (uuid, pk)
- `actor_id` (uuid, fk: auth.users)
- `action` (text) - e.g., "approve_booking", "change_table_status"
- `target_id` (uuid)
- `timestamp` (timestamptz)
