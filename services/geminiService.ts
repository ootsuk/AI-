import { GoogleGenAI, Type, type GenerateContentResponse } from "@google/genai";
import { ALL_MOVES, getMoveByName } from "../constants/moves";
import type { Gijimon, Stats, Move } from "../types";
import { GijimonType } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const GijimonTypesArray = Object.values(GijimonType);

const generateTextPrompt = (typeMoves: { [key in GijimonType]: string[] }) => `
あなたは「擬似モン」という、画像からモンスターを生成するゲームのAIです。
提供された画像を分析し、以下の要件に従って一体のユニークなモンスターを創造してください。

# 要件
1. モンスターのタイプを決定してください。タイプは以下の8つの中から、画像の内容に最もふさわしいものを1つだけ選んでください:
   - ${GijimonTypesArray.join(', ')}
2. 決定したタイプに基づいて、モンスターが覚える技を2つから4つ選んでください。各タイプの技候補は以下の通りです。
   - ほのお: ${typeMoves[GijimonType.Fire].join(', ')}
   - みず: ${typeMoves[GijimonType.Water].join(', ')}
   - くさ: ${typeMoves[GijimonType.Grass].join(', ')}
   - でんき: ${typeMoves[GijimonType.Electric].join(', ')}
   - かくとう: ${typeMoves[GijimonType.Fighting].join(', ')}
   - ひこう: ${typeMoves[GijimonType.Flying].join(', ')}
   - エスパー: ${typeMoves[GijimonType.Psychic].join(', ')}
   - ノーマル: ${typeMoves[GijimonType.Normal].join(', ')}
3. モンスターの見た目や特徴を説明する、創造的で短い説明文（description）を80文字以内で作成してください。この説明文は、後の画像生成に使用されます。

# 出力形式
以下のJSONスキーマに従って、キーも指定通り英語で出力してください。他のテキストは含めないでください。
`;

const generateGijimonProperties = async (base64Image: string, mimeType: string): Promise<any> => {
  const typeMoves = ALL_MOVES.reduce((acc, move) => {
    if (!acc[move.type]) {
      acc[move.type] = [];
    }
    if (GijimonTypesArray.includes(move.type)) {
      acc[move.type].push(move.name);
    }
    return acc;
  }, {} as { [key in GijimonType]: string[] });
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType } },
        { text: generateTextPrompt(typeMoves) }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "モンスターのユニークでかっこいい名前" },
          type: { type: Type.STRING, enum: GijimonTypesArray, description: "モンスターのタイプ" },
          stats: {
            type: Type.OBJECT,
            properties: {
              hp: { type: Type.INTEGER, description: "HP (30-100)" },
              attack: { type: Type.INTEGER, description: "こうげき (30-100)" },
              defense: { type: Type.INTEGER, description: "ぼうぎょ (30-100)" },
              specialAttack: { type: Type.INTEGER, description: "とくこう (30-100)" },
              specialDefense: { type: Type.INTEGER, description: "とくぼう (30-100)" },
              speed: { type: Type.INTEGER, description: "すばやさ (30-100)" },
            },
            required: ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"]
          },
          moves: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "覚える技のリスト"
          },
          description: { type: Type.STRING, description: "モンスターの見た目や特徴の説明文" }
        },
        required: ["name", "type", "stats", "moves", "description"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse JSON from Gemini:", response.text);
    throw new Error("AIからの応答が不正な形式です。");
  }
};

const generateGijimonImage = async (description: string, type: string): Promise<string> => {
    const prompt = `A Pokémon-style creature, ${description}. It is a ${type} type. Full body, vibrant colors, clean lines, white background, digital art.`;
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;
};


export const evolveGijimonImage = async (gijimon: Gijimon): Promise<{ newImage: string, newName: string }> => {
  const evolutionPrompt = `An evolved, more powerful, final-evolution version of a Pokémon-style creature, ${gijimon.description}. It is a ${gijimon.type} type. Make it look majestic and stronger. Full body, dynamic pose, vibrant colors, clean lines, white background, digital art.`;
  const imageResponse = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: evolutionPrompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/png',
      aspectRatio: '1:1',
    },
  });
  const newImage = `data:image/png;base64,${imageResponse.generatedImages[0].image.imageBytes}`;

  const namePrompt = `The creature named "${gijimon.name}" has evolved. Come up with a cool, new, evolved name for it. Respond with only the new name.`;
  const nameResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: namePrompt,
  });
  const newName = nameResponse.text.trim().replace(/['"]+/g, ''); // Remove quotes

  return { newImage, newName };
}

export const createGijimonFromImage = async (file: File): Promise<Omit<Gijimon, 'id' | 'level' | 'exp' | 'expToNextLevel' | 'currentHp'>> => {
  const mimeType = file.type;
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
  const baseImage = await base64Promise;

  const properties = await generateGijimonProperties(baseImage, mimeType);
  
  const gijimonImage = await generateGijimonImage(properties.description, properties.type);

  const moves = properties.moves
    .map((name: string) => getMoveByName(name))
    .filter((move): move is Move => move !== undefined);

  // ステータスのキーを変換
  const stats: Stats = {
    hp: properties.stats.hp,
    attack: properties.stats.attack,
    defense: properties.stats.defense,
    specialAttack: properties.stats.specialAttack,
    specialDefense: properties.stats.specialDefense,
    speed: properties.stats.speed,
  };

  return {
    name: properties.name,
    baseImage,
    gijimonImage,
    type: properties.type as GijimonType,
    stats: stats,
    moves,
    description: properties.description,
  };
};
