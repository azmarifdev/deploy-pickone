export const dynamic = "force-dynamic";
import {FC} from "react";
import ProductCarousel from "@/components/reusable/ProductCarousel";
import HeroSection from "@/components/pages-components/HeroSection";
import PromotionBanner from "@/components/pages-components/PromotionBanner";
import FeatureSection from "@/components/pages-components/FeatureSection";
import {Suspense} from "react";
import HomePageClient from "@/components/client/HomePageClient";
import {config} from "@/config/env";

const fetchProducts = async () => {
    try {
        const [productsResponse, bestSalesResponse] = await Promise.all([
            fetch(`${config.BASE_URL}/api/v1/product/list?limit=20&page=1`, {
                next: {revalidate: 0}, // Revalidate every minute
                cache: "no-store", // Disable caching completely
            }),
            fetch(`${config.BASE_URL}/api/v1/product/best-sales`, {
                next: {revalidate: 0}, // Revalidate every minute
                cache: "no-store", // Disable caching completely
            }),
        ]);

        const productsData = await productsResponse.json();
        const bestSalesData = await bestSalesResponse.json();

        return {
            products: productsData?.data || [],
            bestSales: bestSalesData?.data || [],
            error: null,
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            products: [],
            bestSales: [],
            error: "Failed to load products. Using fallback data.",
        };
    }
};

// The main component is a server component that fetches data
const Home: FC = async () => {
    const {products, bestSales, error} = await fetchProducts();

    // We wrap the page content in a Suspense boundary with our client component
    // that safely handles search params
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HomePageClient>
                <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6">
                    <HeroSection />

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
                                    <p className="text-sm text-yellow-700">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        {products.length > 0 ? (
                            <ProductCarousel
                                products={products}
                                title="New Arrivals"
                                showSeeAllButton
                            />
                        ) : null}
                        {bestSales.length > 0 ? (
                            <ProductCarousel
                                products={bestSales}
                                title="Best Sales"
                                showSeeAllButton
                            />
                        ) : null}
                    </div>

                    <PromotionBanner />
                    <FeatureSection />
                </div>
            </HomePageClient>
        </Suspense>
    );
};

export default Home;
