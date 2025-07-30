"use client";
import {
    FaPencilAlt,
    FaLock,
    FaCalendarAlt,
    FaEnvelope,
    FaShieldAlt,
    FaShoppingCart,
    FaBoxOpen,
    FaStar,
    FaArrowUp,
    FaArrowDown,
    FaPlus,
} from "react-icons/fa";
import {MdDashboard, MdTrendingUp, MdCategory} from "react-icons/md";
import {TbLogout, TbMenuOrder} from "react-icons/tb";
import {useAppSelector} from "@/redux/hooks";
import Image from "next/image";
import {logout} from "@/redux/features/authSlice";
import {useLogoutMutation} from "@/redux/api/authApi";
import {useRouter} from "next/navigation";
import UpdateProfileModal from "./UpdateProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import {useState, useEffect} from "react";
import {useGetOrdersQuery} from "@/redux/api/orderApi";
import {useProductListsQuery} from "@/redux/api/productApi";
import Link from "next/link";
import SimpleChart from "@/components/shared/Analytics/SimpleChart";
import DashboardSkeleton from "@/components/shared/Loading/DashboardSkeleton";

// Statistics Card Component
const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "blue",
    href,
}: {
    title: string;
    value: string | number;
    icon: any;
    trend?: "up" | "down";
    trendValue?: string;
    color?: "blue" | "green" | "purple" | "orange" | "red";
    href?: string;
}) => {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600 bg-blue-50 text-blue-600",
        green: "from-green-500 to-green-600 bg-green-50 text-green-600",
        purple: "from-purple-500 to-purple-600 bg-purple-50 text-purple-600",
        orange: "from-orange-500 to-orange-600 bg-orange-50 text-orange-600",
        red: "from-red-500 to-red-600 bg-red-50 text-red-600",
    };

    const CardContent = (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                        {title}
                    </p>
                    <div className="flex items-baseline">
                        <p className="text-2xl font-bold text-gray-900">
                            {value}
                        </p>
                        {trend && trendValue && (
                            <div
                                className={`flex items-center ml-2 text-sm ${
                                    trend === "up"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}>
                                {trend === "up" ? (
                                    <FaArrowUp className="h-3 w-3 mr-1" />
                                ) : (
                                    <FaArrowDown className="h-3 w-3 mr-1" />
                                )}
                                {trendValue}
                            </div>
                        )}
                    </div>
                </div>
                <div
                    className={`p-3 rounded-lg ${colorClasses[color]
                        .split(" ")
                        .slice(2)
                        .join(" ")}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );

    return href ? <Link href={href}>{CardContent}</Link> : CardContent;
};

// Quick Action Button Component
const QuickActionButton = ({
    title,
    description,
    icon: Icon,
    href,
    color = "blue",
}: {
    title: string;
    description: string;
    icon: any;
    href: string;
    color?: "blue" | "green" | "purple" | "orange";
}) => {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
        green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
        purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
        orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    };

    return (
        <Link href={href}>
            <div
                className={`bg-gradient-to-r ${colorClasses[color]} text-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
                <div className="flex items-center">
                    <Icon className="h-8 w-8 mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <p className="text-blue-100 text-sm">{description}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const Dashboard = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] =
        useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
        useState(false);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    });

    const {data: ordersData, isLoading: ordersLoading} = useGetOrdersQuery({
        query: "limit=1000",
    });
    const {data: productsData, isLoading: productsLoading} =
        useProductListsQuery({queries: {limit: 1000}});

    const [logoutMutation] = useLogoutMutation();
    const router = useRouter();

    // Calculate statistics
    useEffect(() => {
        if (ordersData?.data) {
            const orders = ordersData.data;
            const totalOrders = orders.length;
            const pendingOrders = orders.filter(
                (order: any) => order.status === "pending"
            ).length;
            const totalRevenue = orders.reduce(
                (sum: number, order: any) => sum + (order.total_amount || 0),
                0
            );

            setStats((prev) => ({
                ...prev,
                totalOrders,
                pendingOrders,
                totalRevenue,
            }));
        }

        if (productsData?.data) {
            setStats((prev) => ({
                ...prev,
                totalProducts: productsData.data.length,
            }));
        }
    }, [ordersData, productsData]);

    // Get initials for avatar fallback
    const getInitials = (name: string): string => {
        return name
            ?.split(" ")
            ?.map((n: string) => n?.[0])
            ?.join("")
            ?.toUpperCase();
    };

    const handleLogout = async () => {
        await logoutMutation({});
        logout();
        router.push("/login");
    };

    // Format date to be more readable
    const formatDate = (dateString: string): string => {
        return new Date(dateString)?.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Show loading skeleton while data is being fetched
    if (ordersLoading || productsLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 animate-fade-in-up">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome back, {user?.name}!
                        </h1>
                        <p className="text-blue-100">
                            Here&apos;s what&apos;s happening with your business
                            today.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <MdDashboard className="h-16 w-16 text-blue-200" />
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-animation">
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={TbMenuOrder}
                    trend="up"
                    trendValue="+12%"
                    color="blue"
                    href="/orders"
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={FaBoxOpen}
                    trend="up"
                    trendValue="+5%"
                    color="green"
                    href="/product/manage-product"
                />
                <StatCard
                    title="Total Revenue"
                    value={`৳${stats.totalRevenue.toLocaleString()}`}
                    icon={MdTrendingUp}
                    trend="up"
                    trendValue="+18%"
                    color="purple"
                />
                <StatCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon={FaShoppingCart}
                    trend={stats.pendingOrders > 5 ? "up" : "down"}
                    trendValue={stats.pendingOrders > 5 ? "High" : "Low"}
                    color={stats.pendingOrders > 5 ? "orange" : "green"}
                    href="/orders"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-animation">
                <QuickActionButton
                    title="Add Product"
                    description="Create a new product listing"
                    icon={FaPlus}
                    href="/product/add-product"
                    color="blue"
                />
                <QuickActionButton
                    title="Manage Orders"
                    description="View and process orders"
                    icon={TbMenuOrder}
                    href="/orders"
                    color="green"
                />
                <QuickActionButton
                    title="Categories"
                    description="Manage product categories"
                    icon={MdCategory}
                    href="/category"
                    color="purple"
                />
                <QuickActionButton
                    title="Reviews"
                    description="Check customer feedback"
                    icon={FaStar}
                    href="/reviews"
                    color="orange"
                />
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-scale-in">
                <SimpleChart
                    title="Order Status Distribution"
                    type="doughnut"
                    data={[
                        {
                            label: "Completed",
                            value:
                                ordersData?.data?.filter(
                                    (order: any) => order.status === "completed"
                                ).length || 0,
                            color: "#10b981",
                        },
                        {
                            label: "Processing",
                            value:
                                ordersData?.data?.filter(
                                    (order: any) =>
                                        order.status === "processing"
                                ).length || 0,
                            color: "#3b82f6",
                        },
                        {
                            label: "Pending",
                            value:
                                ordersData?.data?.filter(
                                    (order: any) => order.status === "pending"
                                ).length || 0,
                            color: "#f59e0b",
                        },
                        {
                            label: "Cancelled",
                            value:
                                ordersData?.data?.filter(
                                    (order: any) => order.status === "cancelled"
                                ).length || 0,
                            color: "#ef4444",
                        },
                    ]}
                />
                <SimpleChart
                    title="Monthly Performance"
                    type="bar"
                    data={[
                        {
                            label: "Orders",
                            value: stats.totalOrders,
                            color: "#3b82f6",
                        },
                        {
                            label: "Products",
                            value: stats.totalProducts,
                            color: "#10b981",
                        },
                        {label: "Reviews", value: 45, color: "#8b5cf6"},
                        {
                            label: "Revenue (K)",
                            value: Math.round(stats.totalRevenue / 1000),
                            color: "#f59e0b",
                        },
                    ]}
                />
            </div>

            {/* User Profile Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Profile Header with Background */}
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                            {/* Avatar - Positioned to overlap the header and content */}
                            <div className="absolute -bottom-16 left-8">
                                <div className="p-1 bg-white rounded-full shadow-lg">
                                    {user?.profile_image ? (
                                        <Image
                                            src={
                                                user?.profile_image ||
                                                "/placeholder.svg"
                                            }
                                            alt={user?.name}
                                            width={100}
                                            height={100}
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl font-bold text-gray-700 border-4 border-white">
                                            {getInitials(user?.name)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Section with spacing for the avatar */}
                        <div className="pt-20 px-8 pb-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                        {user?.name}
                                    </h2>
                                    <div className="flex items-center text-gray-500 mb-4">
                                        <FaShieldAlt className="w-4 h-4 mr-2" />
                                        <span className="capitalize font-medium">
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-200">
                                    <TbLogout size={18} />
                                    Logout
                                </button>
                            </div>

                            {/* User Info Grid */}
                            <div className="space-y-4">
                                {/* Email */}
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                        <FaEnvelope className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Email Address
                                        </p>
                                        <p className="text-base font-medium text-gray-900">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Member Since */}
                                <div className="flex items-center">
                                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                                        <FaCalendarAlt className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Member Since
                                        </p>
                                        <p className="text-base font-medium text-gray-900">
                                            {formatDate(user?.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <button
                                    onClick={() =>
                                        setIsUpdateProfileModalOpen(true)
                                    }
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
                                    <FaPencilAlt className="h-4 w-4" />
                                    Update Profile
                                </button>
                                <button
                                    onClick={() =>
                                        setIsChangePasswordModalOpen(true)
                                    }
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300">
                                    <FaLock className="h-4 w-4" />
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Sidebar */}
                <div className="space-y-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Recent Orders
                            </h3>
                            <Link
                                href="/orders"
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {ordersData?.data
                                ?.slice(0, 3)
                                .map((order: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                #{order?.orderNo}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order?.address?.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">
                                                ৳{order.total_price}
                                            </p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    order.status === "completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : order.status ===
                                                          "processing"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : order.status ===
                                                          "pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                )) || (
                                <div className="text-center py-4 text-gray-500">
                                    <p className="text-sm">No recent orders</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <FaBoxOpen className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        New product added
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        2 hours ago
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <TbMenuOrder className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        Order processed
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        4 hours ago
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                    <FaStar className="h-4 w-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        New review received
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        6 hours ago
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* System Health */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            System Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Server Status
                                </span>
                                <span className="flex items-center text-green-600 text-sm font-medium">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    Online
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Database
                                </span>
                                <span className="flex items-center text-green-600 text-sm font-medium">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    Connected
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    API Status
                                </span>
                                <span className="flex items-center text-green-600 text-sm font-medium">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isUpdateProfileModalOpen && (
                <UpdateProfileModal
                    isOpen={isUpdateProfileModalOpen}
                    setIsOpen={setIsUpdateProfileModalOpen}
                    userData={user}
                />
            )}
            {isChangePasswordModalOpen && (
                <ChangePasswordModal
                    isOpen={isChangePasswordModalOpen}
                    setIsOpen={setIsChangePasswordModalOpen}
                />
            )}
        </div>
    );
};

export default Dashboard;
