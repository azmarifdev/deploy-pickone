/* eslint-disable @typescript-eslint/no-unused-vars */
import { config } from '@/config/env';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import client-side only component
const ProductDetails = dynamic(() => import('./ProductDetails'), {
    ssr: false,
});

interface ProductPageProps {
    params: {
        slug: string;
    };
}

// SSR Metadata without cache
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    try {
        const response = await fetch(`${config.BASE_URL}/api/v1/product/by-slug/${params.slug}`, { cache: 'no-store' });

        const productData = await response.json();
        const product = productData?.data;

        if (!product) {
            return {
                title: 'Product Not Found | Ekhoni Kinbo',
                description: 'The requested product could not be found.',
            };
        }

        const description = product.meta_desc || product.desc || `${product.title} - Shop at Ekhoni Kinbo`;

        const keywords = Array.isArray(product.meta_keywords) ? product.meta_keywords.join(', ') : '';

        return {
            title: `${product.title} | Ekhoni Kinbo`,
            description,
            keywords,
            openGraph: {
                title: `${product.title} | Ekhoni Kinbo`,
                description,
                images: [
                    {
                        url: product.thumbnail || '',
                        width: 800,
                        height: 600,
                        alt: product.title,
                    },
                ],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${product.title} | Ekhoni Kinbo`,
                description,
                images: [product.thumbnail || ''],
            },
        };
    } catch (error: any) {
        return {
            title: 'Error | Ekhoni Kinbo',
            description: 'An unexpected error occurred while generating metadata.',
        };
    }
}

// Main SSR page — no cache
const ProductDetailsPage = async ({ params }: ProductPageProps) => {
    try {
        const response = await fetch(
            `${config.BASE_URL}/api/v1/product/by-slug/${params.slug}`,
            { cache: 'no-store' }, // No cache at all
        );

        const product = await response.json();

        return <ProductDetails product={product?.data} />;
    } catch (error: any) {
        return <div className="text-center text-red-500 py-10">Product could not be loaded. {error.message}</div>;
    }
};

export default ProductDetailsPage;
