"use client";

import Loader from "@/components/reusable/Loader/Loader";
import {useLoadUserQuery} from "@/redux/api/authApi";
import {useAppSelector} from "@/redux/hooks";
import {useRouter} from "next/navigation";

const Dashboard = () => {
    const {data: profileData, isLoading} = useLoadUserQuery({});
    const {user} = useAppSelector((state) => state.auth);

    const router = useRouter();

    if (isLoading) return <Loader />;

    if (user.role === "admin" || profileData?.data?.role == "admin") {
        router.push("/dashboard");
    } else router.push("/login");

    return null;
};

export default Dashboard;
