import { ApiResponse, CharacterBasic, Guild, Boss } from '@/interfaces';

const MAPLE_API_KEY = process.env.NEXT_PUBLIC_MAPLE_API_KEY;
const MAPLE_API_BASE_URL = 'https://open.api.nexon.com/maplestory/v1';

// 어제 날짜를 YYYY-MM-DD 형식으로 반환
function getYesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
}

// Helper function to make API calls
async function fetchMapleAPI(endpoint: string, params: Record<string, string> = {}) {
  try {
    // Create query string manually without encoding
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    const url = `${MAPLE_API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    console.log('Making API request to:', url);
    
    const response = await fetch(url, {
      headers: {
        'x-nxopen-api-key': MAPLE_API_KEY || ''
      }
    });

    const responseText = await response.text();
    console.log('API Response:', endpoint + '' + responseText);

    if (!response.ok) {
      throw new Error(`API request failed (${response.status}): ${responseText}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Get character's OCID
async function getCharacterOCID(characterName: string) {
    console.log("getCharacterOCID", characterName);
  try {
    const data = await fetchMapleAPI('/id', { character_name: characterName });
    console.log('OCID Response:', data);
    return data.ocid;
  } catch (error) {
    console.error('Failed to get OCID:', error);
    throw error;
  }
}

// Fetch all character data
export async function searchCharacter(characterName: string) {
  if (!MAPLE_API_KEY) {
    throw new Error('API key is not configured');
  }

  try {
    console.log('Searching for character:', characterName);
    const ocid = await getCharacterOCID(characterName);
    const date = getYesterday();

    console.log('Found OCID:', ocid, 'Fetching character data for date:', date);

    // Fetch all character data in parallel
    const [
      basicInfo,
      statInfo,
      popularityInfo,
      itemEquipment,
      cashItemEquipment,
      symbols,
    //   skills,
      linkSkills,
      vMatrix,
      hexaMatrix,
      dojang,
      union,
      unionRaider
    ] = await Promise.all([
      fetchMapleAPI('/character/basic', { ocid, date }),
      fetchMapleAPI('/character/stat', { ocid, date }),
      fetchMapleAPI('/character/popularity', { ocid, date }),
      fetchMapleAPI('/character/item-equipment', { ocid, date }),
      fetchMapleAPI('/character/cashitem-equipment', { ocid, date }),
      fetchMapleAPI('/character/symbol-equipment', { ocid, date }),
    //   fetchMapleAPI('/character/skill', { ocid, date }),
      fetchMapleAPI('/character/link-skill', { ocid, date }),
      fetchMapleAPI('/character/vmatrix', { ocid, date }),
      fetchMapleAPI('/character/hexamatrix', { ocid, date }),
      fetchMapleAPI('/character/dojang', { ocid, date }),
      fetchMapleAPI('/user/union', { ocid, date }),
      fetchMapleAPI('/user/union-raider', { ocid, date })
    ]);

    // Combine all data
    return {
      ...basicInfo,
      stats: statInfo,
      popularity: popularityInfo,
      items: itemEquipment,
      cashItems: cashItemEquipment,
      symbols: symbols,
    //   skills: skills,
      linkSkills: linkSkills,
      vMatrix: vMatrix,
      hexaMatrix: hexaMatrix,
      dojang: dojang,
      union: union,
      unionRaider: unionRaider
    };
  } catch (error) {
    console.error('Error in searchCharacter:', error);
    throw error;
  }
}

export async function getCharacterBosses(ocid: string): Promise<Boss[]> {
    try {
        const response = await fetch(
            `${MAPLE_API_BASE_URL}/character/weekly-bosses?ocid=${ocid}&date=${getYesterday()}`,
            {
                headers: {
                    'accept': 'application/json',
                    'x-nxopen-api-key': MAPLE_API_KEY!
                }
            }
        );

        if (!response.ok) {
            throw new Error('보스 정보를 가져올 수 없습니다.');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('보스 정보 조회 중 오류 발생:', error);
        throw error;
    }
}

export const fetchGuildData = async (page: number, searchType: string, parameter: string, guildName: string) => {
    try {
        let url = `${MAPLE_API_BASE_URL}/ranking/guild?page=${page}&date=${getYesterday()}&ranking_type=0`;

        switch (searchType) {
            case 'server':
                url += `&world_name=${parameter}`;
                break;
            case 'guild':
                url += `&guild_name=${guildName}`;
                break;
            default:
               
        }

        const response = await fetch(url, {
            headers: {
                'x-nxopen-api-key': MAPLE_API_KEY || ''
            }
        });

        const data = await response.json();
        console.log('fetchGuildData:', data);
        return {
            data: data.ranking,
            totalPages: Math.ceil(data.ranking.length / 20)
        };
    } catch (error) {
        console.error('Error fetching guild data:', error);
        throw error;
    }
};
