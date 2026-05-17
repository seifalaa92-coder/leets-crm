import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sellerId = searchParams.get("seller_id");

    let query = supabase
      .from("marketplace_products")
      .select("*, user_profiles!inner(first_name, last_name)")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }
    if (search) {
      query = query.ilike("title", `%${search}%`);
    }
    if (sellerId) {
      query = query.eq("seller_id", sellerId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const products = (data || []).map((item: any) => ({
      id: item.id,
      seller_id: item.seller_id,
      seller_name: item.user_profiles
        ? `${item.user_profiles.first_name} ${item.user_profiles.last_name}`
        : "Unknown Seller",
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      condition: item.condition,
      images: item.images || [],
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, price, category, condition, images } = body;

    if (!title || !price) {
      return NextResponse.json({ error: "Title and price are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("marketplace_products")
      .insert({
        seller_id: profile.id,
        title,
        description: description || "",
        price: parseFloat(price),
        category: category || "Other",
        condition: condition || "good",
        images: images || [],
        status: "active",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
