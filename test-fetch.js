require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testFetch() {
    console.log("Testing fetch relation...");
    const { data, error } = await supabase
        .from('memberships')
        .select(`
        *,
        profiles:user_id ( full_name, email )
    `)
        .eq('status', 'pending')
        .limit(1);

    if (error) {
        console.error("Fetch Error:", JSON.stringify(error, null, 2));
    } else {
        console.log("Fetch Success:", data);
    }
}

testFetch();
