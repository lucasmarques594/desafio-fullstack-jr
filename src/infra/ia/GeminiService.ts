import { GoogleGenerativeAI } from "@google/generative-ai";
import { IIAExtractorService, ExtractedData } from "./IIAExtractorService";

export class GeminiService implements IIAExtractorService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY não está definida nas variáveis de ambiente."
      );
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private getMimeType(base64: string): string {
    const mime = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length > 1) {
      if (["image/jpeg", "image/png", "application/pdf"].includes(mime[1])) {
        return mime[1];
      }
    }
    throw new Error(
      "Formato de arquivo inválido ou não suportado. Use JPEG, PNG ou PDF em base64."
    );
  }

  async extractDataFromFile(base64File: string): Promise<ExtractedData> {
    const model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const mimeType = this.getMimeType(base64File);
    const fileData = base64File.split("base64,")[1];

    const prompt = `
      Analise a imagem ou PDF deste boleto/fatura e extraia as seguintes informações:
      - nome_cliente: O nome do titular da conta (Pagador).
      - vencimento: A data de vencimento no formato AAAA-MM-DD.
      - valor: O valor total a pagar, como um número (ex: 143.76).
      - tipo: O tipo de conta. Use um dos seguintes valores: "AGUA", "ENERGIA", "INTERNET", ou "OUTRO".
      - descricao: Uma breve descrição da fatura, como "Fatura referente ao mês 06/2025" ou o texto do campo de descrição do boleto.

      Se alguma informação não for encontrada, use o valor null para a chave correspondente.
      O nome do cliente é o "Pagador". Se não encontrar um pagador explícito, procure por "Sacado" ou o nome do destinatário principal.
    `;

    const filePart = {
      inlineData: {
        data: fileData,
        mimeType: mimeType,
      },
    };

    try {
      const result = await model.generateContent([prompt, filePart]);
      const response = result.response;
      const text = response.text();

      const data = JSON.parse(text) as ExtractedData;

      if (!data.nome_cliente || !data.vencimento || !data.valor === null) {
        throw new Error("IA não conseguiu extrair os campos obrigatórios.");
      }
      return data;
    } catch (error) {
      console.error("Erro ao processar com a API do Gemini:", error);
      throw new Error("Falha ao extrair dados do arquivo com a IA.");
    }
  }
}
