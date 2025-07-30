import {NextRequest, NextResponse} from "next/server";
import {verifyToken} from "./utils/jwt";

const publicRoutes = ["/login", "/"];
const RESTRICTED_IF_AUTHENTICATED = ["/login"];

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    const isPublicRoute = publicRoutes.includes(pathname);
    const shouldRestrictForAuthenticated =
        RESTRICTED_IF_AUTHENTICATED.includes(pathname);

    const token = request.cookies.get("pickone_access_token")?.value;
    console.log("token: ", token);

    // Verify token properly with signature verification
    const {isValid, decoded} = await verifyToken(token);
    console.log("isValid, decoded: ", isValid, decoded);
    const isAuthenticated = isValid && decoded?.role === "admin";

    // Redirect authenticated users away from restricted routes (like login)
    if (isAuthenticated && shouldRestrictForAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Handle unauthenticated access to private routes
    if (!isPublicRoute && !isAuthenticated) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
