-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create base tables
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL,
    status TEXT NOT NULL,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    payment_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- in cents
    platform_fee INTEGER NOT NULL, -- in cents
    status TEXT NOT NULL,
    payer_id UUID REFERENCES auth.users(id),
    recipient_id UUID REFERENCES auth.users(id),
    payment_method_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payment_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own subscriptions"
    ON subscriptions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can view their payments"
    ON payments FOR SELECT
    USING (payer_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can view their payment logs"
    ON payment_logs FOR SELECT
    USING (
        payment_id IN (
            SELECT id FROM payments
            WHERE payer_id = auth.uid() OR recipient_id = auth.uid()
        )
    );

-- Functions
CREATE OR REPLACE FUNCTION calculate_platform_fee(payment_amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- 3% platform fee
    RETURN FLOOR(payment_amount * 0.03);
END;
$$;