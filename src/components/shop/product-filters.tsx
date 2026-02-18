"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function ProductFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [brands, setBrands] = useState<string[]>([]);

    useEffect(() => {
        const brandParam = searchParams.get('brand');
        if (brandParam) {
            setBrands(brandParam.split(','));
        } else {
            setBrands([]);
        }
    }, [searchParams]);

    const handleBrandChange = (brand: string, checked: boolean) => {
        let newBrands = [...brands];
        if (checked) {
            newBrands.push(brand);
        } else {
            newBrands = newBrands.filter((b) => b !== brand);
        }
        setBrands(newBrands);

        const params = new URLSearchParams(searchParams.toString());
        if (newBrands.length > 0) {
            params.set('brand', newBrands.join(','));
        } else {
            params.delete('brand');
        }
        router.push(`/shop?${params.toString()}`);
    };

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', value);
        router.push(`/shop?${params.toString()}`);
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-4 text-lg font-semibold">Brand</h3>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="brand-iphone"
                            checked={brands.includes('iPhone')}
                            onCheckedChange={(checked) => handleBrandChange('iPhone', checked === true)}
                        />
                        <Label htmlFor="brand-iphone">iPhone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="brand-samsung"
                            checked={brands.includes('Samsung')}
                            onCheckedChange={(checked) => handleBrandChange('Samsung', checked === true)}
                        />
                        <Label htmlFor="brand-samsung">Samsung</Label>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-lg font-semibold">Sort By</h3>
                <Select onValueChange={handleSortChange} defaultValue={searchParams.get('sort') || 'newest'}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
