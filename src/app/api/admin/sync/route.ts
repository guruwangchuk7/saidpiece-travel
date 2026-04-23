import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
    try {
        const { table, data, conflictCol } = await req.json();
        const supabase = createSupabaseAdminClient();

        // Perform the upsert using the admin client (bypasses RLS)
        const { error } = await supabase
            .from(table)
            .upsert(data, { onConflict: conflictCol });

        if (error) {
            console.error(`Sync error for table ${table}:`, error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Unexpected sync error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
