'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/reusable/ProductCard';
import { ProductFilters } from '@/app/productPage/components/ProductFilters';
import { ProductPagination } from '@/app/productPage/components/ProductPagination';
import useCategory from '@/hooks/useCategory';
import { useSearchParams } from './SearchParamsProvider';
import { config } from '@/config/env';

const sortOptions = [
    { value: 'createAt', label: 'Newest' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
];

const ProductPageClient: React.FC = () => {
    const { categories } = useCategory();
    const searchParams = useSearchParams();
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage, setProductsPerPage] = useState<number>(20);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedPriceRange, setSelectedPriceRange] = useState<any>({});
    const [selectedSort, setSelectedSort] = useState<string>('createAt');
    const [sortOrder, setSortOrder] = useState<string>('desc');
    const [minRating, setMinRating] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const [initialParamsLoaded, setInitialParamsLoaded] = useState(false);

    // Handle URL params (only once on mount)
    useEffect(() => {
        const categoryId = searchParams.get('category');
        const searchQueryParam = searchParams.get('search');

        if (categoryId) setSelectedCategory(categoryId);
        if (searchQueryParam) setSearchQuery(searchQueryParam);

        setInitialParamsLoaded(true); // Mark as loaded
    }, [searchParams]);

    // Fetch products
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (selectedCategory) params.append('category', selectedCategory);
            if (selectedPriceRange.max) {
                params.append('min_price', selectedPriceRange.min.toString());
                params.append(
                    'max_price',
                    selectedPriceRange.max === 'Infinity' ? '999999999' : selectedPriceRange.max.toString(),
                );
            }

            params.append('sortBy', selectedSort === 'price-high' ? 'price' : selectedSort);
            params.append('sortOrder', sortOrder);
            params.append('page', currentPage.toString());
            params.append('limit', productsPerPage.toString());

            const response = await fetch(`${config.BASE_URL}/api/v1/product/list?${params.toString()}`);
            const data = await response.json();

            setAllProducts(data.data || []);
            setTotalPages(Math.ceil(data.meta.total / productsPerPage));
            setTotalProducts(data.meta.total);
        } catch (err) {
            console.error('Error:', err);
            setAllProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Trigger fetch AFTER initial URL param load
    useEffect(() => {
        if (!initialParamsLoaded) return;

        const timeout = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        searchQuery,
        selectedCategory,
        selectedPriceRange,
        minRating,
        selectedSort,
        sortOrder,
        currentPage,
        productsPerPage,
        initialParamsLoaded,
    ]);

    const paginate = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) paginate(currentPage - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) paginate(currentPage + 1);
    };

    const resetFilters = () => {
        setSelectedCategory('');
        setSelectedPriceRange({});
        setMinRating(0);
        setSearchQuery('');
        setSelectedSort(sortOptions[0].value);
        setSortOrder('desc');
        setCurrentPage(1);
        setProductsPerPage(20);
    };

    const toggleFilters = () => setShowFilters(!showFilters);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mb-4" />
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-0">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 mt-10 lg:mt-14">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {selectedCategory && categories.length > 0
                                ? categories.find((cat) => cat.id === selectedCategory)?.title || 'All Products'
                                : 'All Products'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {totalProducts} {totalProducts === 1 ? 'product' : 'products'} available
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
                        {searchQuery && (
                            <div className="text-sm bg-blue-50 px-4 py-2 rounded-lg">
                                Search results for: <span className="font-semibold">{searchQuery}</span>
                            </div>
                        )}
                        {selectedCategory && categories.length > 0 && (
                            <div className="text-sm bg-green-50 px-4 py-2 rounded-lg">
                                Category:{' '}
                                <span className="font-semibold">
                                    {categories.find((cat) => cat.id === selectedCategory)?.title || 'Selected category'}
                                </span>
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className="ml-2 text-green-700 hover:text-green-900"
                                    aria-label="Clear category filter">
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:hidden mb-6">
                    <button
                        onClick={toggleFilters}
                        className="w-full flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-300 shadow-sm">
                        <span className="flex items-center font-medium">Filter & Sort</span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <ProductFilters
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedPriceRange={selectedPriceRange}
                        setSelectedPriceRange={setSelectedPriceRange}
                        minRating={minRating}
                        setMinRating={setMinRating}
                        resetFilters={resetFilters}
                        showFilters={showFilters}
                        categories={categories}
                    />

                    <div className="flex-1">
                        <div className="hidden md:flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-medium">{allProducts.length}</span> products
                            </div>

                            <div className="flex items-center space-x-4">
                                <input
                                    type="text"
                                    className="border md:w-[300px] border-gray-300 rounded-md px-2 py-1.5 placeholder:text-gray-500 text-gray-900 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Search by product name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <select
                                    value={selectedSort}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedSort(value);
                                        if (value === 'price') {
                                            setSortOrder('asc');
                                        } else if (value === 'price-high') {
                                            setSortOrder('desc');
                                        } else {
                                            setSortOrder('desc');
                                        }
                                    }}
                                    className="text-sm px-2 py-1.5 border bg-transparent border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {allProducts.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
                                <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-6">Try changing your filters or search term</p>
                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Reset All Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-2 mb-8">
                                    {allProducts.map((product) => (
                                        <ProductCard key={product.id} {...product} />
                                    ))}
                                </div>

                                {totalPages > 0 && (
                                    <ProductPagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        productsPerPage={productsPerPage}
                                        paginate={paginate}
                                        goToPreviousPage={goToPreviousPage}
                                        goToNextPage={goToNextPage}
                                        setProductsPerPage={setProductsPerPage}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPageClient;
