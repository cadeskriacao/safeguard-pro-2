import { GoogleGenAI, Type } from "@google/genai";
import { RiskControl } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestRisksAndControls = async (taskDescription: string): Promise<RiskControl[]> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing, returning mock data");
    return [
      { risk: "Queda de nível", control: "Uso de cinto de segurança e linha de vida", ppe: ["Cinto Paraquedista", "Capacete com jugular"] },
      { risk: "Ruído excessivo", control: "Rodízio de atividades", ppe: ["Protetor Auricular"] }
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analise a seguinte atividade de trabalho e liste 3 principais riscos, medidas de controle (EPC/Adm) e EPIs obrigatórios. Atividade: "${taskDescription}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              risk: { type: Type.STRING, description: "Descrição do risco" },
              control: { type: Type.STRING, description: "Medida de controle coletiva ou administrativa" },
              ppe: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "Lista de EPIs necessários" 
              }
            },
            required: ["risk", "control", "ppe"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as RiskControl[];
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};
