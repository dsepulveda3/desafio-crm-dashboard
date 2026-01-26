import * as XLSX from "xlsx";

const FILE_ID = "1W7YM4hv3iS1dN7m4bJBrKmZQ_p6ImL0-";

export interface SheetData {
  sheetName: string;
  data: Record<string, unknown>[];
}

export async function fetchExcelFromDrive(): Promise<Buffer> {
  // URL para descargar archivo de Google Drive compartido públicamente
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${FILE_ID}`;

  const response = await fetch(downloadUrl);

  if (!response.ok) {
    throw new Error(`Error descargando archivo: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function readExcelData(): Promise<SheetData[]> {
  const buffer = await fetchExcelFromDrive();

  const workbook = XLSX.read(buffer, { type: "buffer" });

  const result: SheetData[] = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    result.push({
      sheetName,
      data: jsonData as Record<string, unknown>[],
    });
  }

  return result;
}

export async function getSheetByName(
  name: string
): Promise<Record<string, unknown>[] | null> {
  const sheets = await readExcelData();
  const sheet = sheets.find(
    (s) => s.sheetName.toLowerCase() === name.toLowerCase()
  );
  return sheet?.data ?? null;
}
