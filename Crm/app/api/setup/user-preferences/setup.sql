-- SQL function to create the user_preferences table
CREATE OR REPLACE FUNCTION create_user_preferences_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'user_preferences'
  ) THEN
    -- Create the user_preferences table
    CREATE TABLE public.user_preferences (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      preference_type VARCHAR(50) NOT NULL,
      preference_key VARCHAR(100) NOT NULL,
      preference_value JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, preference_type, preference_key)
    );

    -- Add RLS policies
    ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

    -- Policy for users to read only their own preferences
    CREATE POLICY "Users can read their own preferences"
      ON public.user_preferences
      FOR SELECT
      USING (auth.uid() = user_id);

    -- Policy for users to insert their own preferences
    CREATE POLICY "Users can insert their own preferences"
      ON public.user_preferences
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    -- Policy for users to update their own preferences
    CREATE POLICY "Users can update their own preferences"
      ON public.user_preferences
      FOR UPDATE
      USING (auth.uid() = user_id);

    -- Policy for users to delete their own preferences
    CREATE POLICY "Users can delete their own preferences"
      ON public.user_preferences
      FOR DELETE
      USING (auth.uid() = user_id);

    -- Create a trigger to update the updated_at timestamp
    CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_user_preferences_updated_at();
  END IF;
END;
$$;
