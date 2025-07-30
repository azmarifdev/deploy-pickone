import React from 'react';

interface OrderSuccessProps {
    savingsPercentage: number;
    savings: number;
    hasProduct: boolean;
    orderDetails?: any; // Add order details from API response
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ savingsPercentage, savings, hasProduct, orderDetails }) => {
    return (
        <div className="text-center py-4">
            <div className="mb-2">
                <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Order Placed Successfully!</h3>
            <div className="bg-green-50 p-3 rounded-lg border border-green-100 mb-3 max-w-md mx-auto">
                <p className="text-gray-700 text-sm mb-1">
                    Thank you for your order. A confirmation SMS will be sent to your phone shortly.
                </p>
                <p className="text-gray-600 text-xs mb-1">
                    Your order will be delivered within 24-48 hours. Please keep your phone on.
                </p>
                {orderDetails && (
                    <div className="mt-2 p-2 bg-white rounded-md border border-green-100 text-left">
                        {/* Order ID and Status Section */}
                        <div className="mb-2">
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-medium text-gray-700">
                                    Order ID:
                                    <span className="ml-1 font-bold text-green-700">{orderDetails._id}</span>
                                </p>
                                <p className="text-xs font-semibold text-gray-800">
                                    Status: <span className="font-medium capitalize">{orderDetails.status}</span>
                                </p>
                            </div>
                        </div>

                        {/* Order Items Section - Show quantities and attributes */}
                        {orderDetails.order_items && orderDetails.order_items.length > 0 && (
                            <div className="mb-2 pb-2 border-b border-gray-100">
                                <h4 className="text-xs font-medium text-gray-700 mb-1">Order Items:</h4>
                                {orderDetails.order_items.map((item: any, index: number) => (
                                    <div key={index} className="mb-1 pl-2 border-l-2 border-green-200">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs font-medium text-gray-700">{item.product_name}</p>
                                            <p className="text-xs text-gray-600">
                                                <span className="font-medium">{item.quantity}x</span>
                                                {item.price && (
                                                    <span className="ml-1 font-medium">৳{item.price.toFixed(0)}</span>
                                                )}
                                            </p>
                                        </div>
                                        {/* Display product attributes if available */}
                                        {item.attributes && Object.keys(item.attributes).length > 0 && (
                                            <div className="text-xs text-gray-500">
                                                {Object.entries(item.attributes).map(
                                                    ([key, value]: [string, any], i: number) => (
                                                        <span key={i} className="mr-2">
                                                            <span className="italic">{key}:</span>{' '}
                                                            <span className="font-medium">{value}</span>
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Price Breakdown Section - Compact layout */}
                        <div className="mb-2 pb-1 border-b border-gray-100">
                            <div className="grid grid-cols-2 gap-1 text-xs">
                                <p className="text-gray-500">Subtotal:</p>
                                <p className="text-right font-medium">৳{orderDetails.subtotal?.toFixed(0) || '0'}</p>
                                <p className="text-gray-500">Delivery:</p>
                                <p className="text-right font-medium">৳{orderDetails.delivery_charge?.toFixed(0) || '0'}</p>
                                <p className="text-gray-700 font-medium">Total:</p>
                                <p className="text-right font-bold text-green-600">
                                    ৳{orderDetails.total_price?.toFixed(0) || '0'}
                                </p>
                            </div>
                        </div>

                        {/* Customer Details Section - Compact display */}
                        {orderDetails.address && (
                            <div>
                                <h4 className="text-xs font-medium text-gray-700 mb-1">Delivery Info:</h4>
                                <div className="bg-gray-50 p-1 rounded-md border border-gray-100">
                                    <div className="flex justify-between">
                                        <p className="text-xs text-gray-800 font-medium">{orderDetails.address.name}</p>
                                        <p className="text-xs text-gray-600">
                                            <span className="font-medium">{orderDetails.address.phone}</span>
                                        </p>
                                    </div>
                                    {orderDetails.address.address && (
                                        <p className="text-xs text-gray-600 leading-tight truncate">
                                            {orderDetails.address.address}
                                            {orderDetails.address.area && `, ${orderDetails.address.area}`}
                                            {orderDetails.address.city && `, ${orderDetails.address.city}`}
                                            {orderDetails.address.postal_code && ` - ${orderDetails.address.postal_code}`}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {hasProduct && (
                <div className="mt-2 bg-blue-50 p-2 rounded-lg max-w-md mx-auto">
                    <p className="font-medium text-blue-700 text-sm">You saved {savingsPercentage}% on this purchase!</p>
                    <p className="text-xs text-blue-600">Total savings: ৳{savings.toFixed(0)}</p>
                </div>
            )}
        </div>
    );
};

export default OrderSuccess;
