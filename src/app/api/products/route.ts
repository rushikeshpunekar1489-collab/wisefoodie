import { NextRequest, NextResponse } from 'next/server';
import { packagedFoodDb } from '@/lib/db/packagedFoodDb';
import type { ProductFilters } from '@/types/packaged-food';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const categoriesParam = searchParams.get('categories') || searchParams.get('category');
    const brandsParam = searchParams.get('brands') || searchParams.get('brand');

    const filters: ProductFilters = {
      search: searchParams.get('search') || searchParams.get('q') || undefined,
      categories: categoriesParam ? categoriesParam.split(',').map(c => c.trim()).filter(Boolean) : undefined,
      brands: brandsParam ? brandsParam.split(',').map(b => b.trim()).filter(Boolean) : undefined,
      minCalories: searchParams.get('minCalories') ? Number(searchParams.get('minCalories')) : undefined,
      maxCalories: searchParams.get('maxCalories') ? Number(searchParams.get('maxCalories')) : undefined,
      minProtein: searchParams.get('minProtein') ? Number(searchParams.get('minProtein')) : undefined,
      maxProtein: searchParams.get('maxProtein') ? Number(searchParams.get('maxProtein')) : undefined,
      minCarbs: searchParams.get('minCarbs') ? Number(searchParams.get('minCarbs')) : undefined,
      maxCarbs: searchParams.get('maxCarbs') ? Number(searchParams.get('maxCarbs')) : undefined,
      minFat: searchParams.get('minFat') ? Number(searchParams.get('minFat')) : undefined,
      maxFat: searchParams.get('maxFat') ? Number(searchParams.get('maxFat')) : undefined,
      minSugar: searchParams.get('minSugar') ? Number(searchParams.get('minSugar')) : undefined,
      maxSugar: searchParams.get('maxSugar') ? Number(searchParams.get('maxSugar')) : undefined,
      minSodium: searchParams.get('minSodium') ? Number(searchParams.get('minSodium')) : undefined,
      maxSodium: searchParams.get('maxSodium') ? Number(searchParams.get('maxSodium')) : undefined,
      minFiber: searchParams.get('minFiber') ? Number(searchParams.get('minFiber')) : undefined,
      maxFiber: searchParams.get('maxFiber') ? Number(searchParams.get('maxFiber')) : undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'sno',
      sortOrder: (searchParams.get('sortOrder') as any) || 'asc',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 24,
    };

    const result = packagedFoodDb.filter(filters);

    return NextResponse.json({
      success: true,
      data: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = packagedFoodDb.create(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, item: result.item },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
