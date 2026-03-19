import { NextResponse } from "next/server";

export function checkApiKey(request) {
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

  return null; // autorizado
}
