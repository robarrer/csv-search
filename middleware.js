import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Solo proteger rutas /api/
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const apiKey = request.headers.get("x-api-key");
  const validKey = process.env.API_KEY;

  if (!validKey) {
    return NextResponse.json(
      { detail: "API_KEY no configurada en el servidor." },
      { status: 500 }
    );
  }

  if (!apiKey || apiKey !== validKey) {
    return NextResponse.json(
      { detail: "No autorizado. Debes enviar el header x-api-key." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
