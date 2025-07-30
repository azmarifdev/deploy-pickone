import {config} from "@/config/env";
// import ProductDetails from "./ProductDetails";

import {Metadata} from "next";
import dynamic from "next/dynamic";

const ProductDetails = dynamic(() => import("./ProductDetails"), {
    ssr: false,
});

interface ProductPageProps {
    params: {
        slug: string;
    };
}

// Generate dynamic metadata based on product data
export async function generateMetadata({
    params,
}: ProductPageProps): Promise<Metadata> {
    // Fetch product data
    const response = await fetch(
        `${config.BASE_URL}/api/v1/product/by-slug/${params.slug}`,
        {
            next: {revalidate: 0}, // Revalidate every 10 minutes
        }
    );

    const productData = await response.json();
    const product = productData?.data;

    if (!product) {
        return {
            title: "Product Not Found | Ekhoni Kinbo",
            description: "The requested product could not be found.",
        };
    }

    // Use meta_desc from API or fall back to product description
    const description =
        product.meta_desc ||
        product.desc ||
        `${product.title} - Shop at Ekhoni Kinbo`;

    // Format meta keywords as a comma-separated string
    const keywords = Array.isArray(product.meta_keywords)
        ? product.meta_keywords.join(", ")
        : "";

    return {
        title: `${product.title} | Ekhoni Kinbo`,
        description: description,
        keywords: keywords,
        openGraph: {
            title: `${product.title} | Ekhoni Kinbo`,
            description: description,
            images: [
                {
                    url: product.thumbnail || "",
                    width: 800,
                    height: 600,
                    alt: product.title,
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${product.title} | Ekhoni Kinbo`,
            description: description,
            images: [product.thumbnail || ""],
        },
    };
}

const ProductDetailsPage = async ({params}: ProductPageProps) => {
    const response = await fetch(
        `${config.BASE_URL}/api/v1/product/by-slug/${params.slug}`,
        {
            next: {revalidate: 0}, // Revalidate every 10 minutes
        }
    );
    console.log(response);
    const product = await response.json();
    return <ProductDetails product={product?.data} />;
};

export default ProductDetailsPage;
