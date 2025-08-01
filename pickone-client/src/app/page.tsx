'use client';

import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import ProductCarousel from '@/components/reusable/ProductCarousel';
import HeroSection from '@/components/pages-components/HeroSection';
import PromotionBanner from '@/components/pages-components/PromotionBanner';
import FeatureSection from '@/components/pages-components/FeatureSection';
import { config } from '@/config/env';

const Home: FC = () => {
    const [products, setProducts] = useState([]);
    const [bestSales, setBestSales] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [productsRes, bestSalesRes] = await Promise.all([
                    axios.get(`${config.BASE_URL}/api/v1/product/list?limit=20&page=1`),
                    axios.get(`${config.BASE_URL}/api/v1/product/best-sales`),
                ]);

                setProducts(productsRes.data?.data || []);
                setBestSales(bestSalesRes.data?.data || []);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Using fallback data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6">
            <HeroSection />

            {loading && <div className="text-center text-gray-500">Loading...</div>}

            {error && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-md shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-yellow-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                {products.length > 0 && <ProductCarousel products={products} title="New Arrivals" showSeeAllButton />}

                {bestSales.length > 0 && <ProductCarousel products={bestSales} title="Best Sales" showSeeAllButton />}
            </div>

            <PromotionBanner />
            <FeatureSection />
        </div>
    );
};

export default Home;
