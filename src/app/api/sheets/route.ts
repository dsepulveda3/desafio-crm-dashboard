import { NextResponse } from "next/server";
import { readExcelData } from "@/lib/sheets";

export async function GET() {
  try {
    const data = await readExcelData();

    return NextResponse.json({
      success: true,
      sheets: data.map((sheet) => ({
        name: sheet.sheetName,
        rowCount: sheet.data.length,
        data: sheet.data,
      })),
    });
  } catch (error) {
    console.error("Error leyendo Excel:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
