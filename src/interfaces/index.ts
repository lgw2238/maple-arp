// API Response Interfaces
export interface ApiResponse<T> {
    date?: string;
    message?: string;
    status?: number;
    data?: T;
}

// Maple API Response Interfaces
export interface CharacterBasic {
    date: string;
    character_name: string;
    world_name: string;
    character_gender: string;
    character_class: string;
    character_class_level: string;
    character_level: number;
    character_exp: number;
    character_exp_rate: string;
    character_guild_name: string;
    character_image: string;
    character_date_create: string;
    access_flag: string;
    liberation_quest_clear_flag: string;
}

export interface CharacterStat {
    date: string;
    character_class: string;
    final_stat: Array<{
        stat_name: string;
        stat_value: string;
    }>;
    stats: {
        str: string;
        dex: string;
        int: string;
        luk: string;
        hp: string;
        mp: string;
        ap: string;
        sp: string;
        power: string;
        defense: string;
        speed: string;
        jump: string;
        boss_damage: string;
        ignore_defense: string;
        damage: string;
        final_damage: string;
        buff_duration: string;
        resistance: string;
        stance: string;
        critical_damage: string;
        critical_rate: string;
    };
    hyper_stats: {
        str: number;
        dex: number;
        int: number;
        luk: number;
        hp: number;
        mp: number;
        damage: number;
        boss_damage: number;
        critical_damage: number;
        critical_rate: number;
        defense_ignore: number;
        status_resistance: number;
        stance: number;
        attack_power: number;
        exp: number;
    };
}

export interface CharacterPopularity {
    date: string;
    popularity: number;
}

export interface CharacterItemEquipment {
    date: string;
    character_gender: string;
    character_class: string;
    preset_no: number;
    item_equipment: Array<{
        item_equipment_part: string;
        item_equipment_slot: string;
        item_name: string;
        item_icon: string;
        item_description: string | null;
        item_shape_name: string;
        item_shape_icon: string;
        item_gender: string | null;
        item_total_option: {
            str: string;
            dex: string;
            int: string;
            luk: string;
            max_hp: string;
            max_mp: string;
            attack_power: string;
            magic_power: string;
            armor: string;
            speed: string;
            jump: string;
            boss_damage: string;
            ignore_monster_armor: string;
            all_stat: string;
            damage: string;
            equipment_level_decrease: number;
            max_hp_rate: string;
            max_mp_rate: string;
        };
        item_base_option: {
            str: string;
            dex: string;
            int: string;
            luk: string;
            max_hp: string;
            max_mp: string;
            attack_power: string;
            magic_power: string;
            armor: string;
            speed: string;
            jump: string;
            boss_damage: string;
            ignore_monster_armor: string;
            all_stat: string;
            max_hp_rate: string;
            max_mp_rate: string;
            base_equipment_level: number;
        };
        potential_option_grade: string;
        additional_potential_option_grade: string;
        potential_option_flag: string;
        potential_option_1: string;
        potential_option_2: string;
        potential_option_3: string;
        additional_potential_option_flag: string;
        additional_potential_option_1: string;
        additional_potential_option_2: string;
        additional_potential_option_3: string;
        equipment_level_increase: number;
        item_exceptional_option: {
            str: string;
            dex: string;
            int: string;
            luk: string;
            max_hp: string;
            max_mp: string;
            attack_power: string;
            magic_power: string;
            exceptional_upgrade: number;
        };
        item_add_option: {
            str: string;
            dex: string;
            int: string;
            luk: string;
            max_hp: string;
            max_mp: string;
            attack_power: string;
            magic_power: string;
            armor: string;
            speed: string;
            jump: string;
            boss_damage: string;
            damage: string;
            all_stat: string;
            equipment_level_decrease: number;
        };
        growth_exp: number;
        growth_level: number;
        scroll_upgrade: string;
        cuttable_count: string;
        golden_hammer_flag: string;
        scroll_resilience_count: string;
        scroll_upgradeable_count: string;
        soul_name: string | null;
        soul_option: string | null;
        item_etc_option: {
            str: string;
            dex: string;
            int: string;
            luk: string;
            max_hp: string;
            max_mp: string;
            attack_power: string;
            magic_power: string;
            armor: string;
            speed: string;
            jump: string;
        };
        starforce: string;
        starforce_scroll_flag: string;
        item_starforce_option: {
            str: string;
            dex: string;
            int: string;
            luk: string;
            max_hp: string;
            max_mp: string;
            attack_power: string;
            magic_power: string;
            armor: string;
            speed: string;
            jump: string;
        };
        special_ring_level: number;
        date_expire: string | null;
    }>;
}

export interface CharacterCashItemEquipment {
    date: string;
    cash_item_equipment_preset_no: number;
    cash_item_equipment: Array<{
        cash_item_equipment_part: string;
        cash_item_equipment_slot: string;
        cash_item_name: string;
        cash_item_icon: string;
        cash_item_description: string;
        cash_item_label: string;
        date_expire: string | null;
        date_option_expire: string | null;
        cash_item_option: string[];
        base_preset_item_disable_flag: string;
    }>;
}

export interface CharacterSymbol {
    date: string;
    character_class: string;
    symbol: Array<{
        symbol_name: string;
        symbol_icon: string;
        symbol_description: string;
        symbol_force: string;
        symbol_level: number;
        symbol_str: string;
        symbol_dex: string;
        symbol_int: string;
        symbol_luk: string;
        symbol_hp: string;
        symbol_drop_rate: string;
        symbol_meso_rate: string;
        symbol_exp_rate: string;
        symbol_growth_count: number;
        symbol_require_growth_count: number;
    }>;
}

export interface CharacterSkill {
    date: string;
    character_class: string;
    character_skill_grade: string;
    character_skill: Array<{
        skill_name: string;
        skill_description: string;
        skill_level: number;
        skill_effect: string;
        skill_icon: string;
    }>;
}

export interface CharacterLinkSkill {
    date: string;
    character_class: string;
    character_link_skill: Array<{
        skill_name: string;
        skill_description: string;
        skill_level: number;
        skill_effect: string;
        skill_icon: string;
    }>;
}

export interface CharacterVMatrix {
    date: string;
    character_class: string;
    character_v_core_equipment: Array<{
        slot_id: string;
        slot_level: number;
        v_core_name: string;
        v_core_type: string;
        v_core_level: number;
        v_core_skill_1: string;
        v_core_skill_2: string | null;
        v_core_skill_3: string | null;
    }>;
}

export interface CharacterHexaMatrix {
    date: string;
    character_class: string;
    character_hexa_core_equipment: Array<{
        hexa_core_name: string;
        hexa_core_level: number;
        hexa_core_type: string;
    }>;
}

export interface CharacterDojang {
    date: string;
    dojang_best_floor: number;
    date_dojang_record: string;
    dojang_best_time: number;
}

export interface CharacterUnion {
    date: string;
    union_level: number;
    union_grade: string;
    union_artifact_level: number;
    union_artifact_exp: number;
    union_artifact_point: number;
}

export interface CharacterUnionRaider {
    date: string;
    union_raider_stat: Array<{
        stat_field_id: string;
        stat_field_effect: string;
    }>;
    union_occupied_stat: Array<{
        stat_field_id: string;
        stat_field_effect: string;
    }>;
    union_block: Array<{
        block_type: string;
        block_class: string;
        block_level: string;
        block_control_point: {
            x: number;
            y: number;
        };
        block_position: Array<{
            x: number;
            y: number;
        }>;
    }>;
}

export interface ExtendedCharacterData extends CharacterBasic {
    stats: CharacterStat;
    popularity: CharacterPopularity;
    items: CharacterItemEquipment;
    cashItems: CharacterCashItemEquipment;
    symbols: CharacterSymbol;
    skills: CharacterSkill;
    linkSkills: CharacterLinkSkill;
    vMatrix: CharacterVMatrix;
    hexaMatrix: CharacterHexaMatrix;
    dojang: CharacterDojang;
    union: CharacterUnion;
    unionRaider: CharacterUnionRaider;
}

// Boss Related Interfaces
export interface Boss {
    id: string;
    name: string;
    crystalValue: number;
    difficulty: string;
}

export interface Character {
    id: string;
    name: string;
    world: string;
    level: number;
    class: string;
}

export interface CharacterBosses {
    [characterId: string]: {
        [bossId: string]: boolean;
    };
}

export interface BossCalculatorProps {
    characters: Character[];
    bossList: Boss[];
}

// Guild Related Interfaces
export interface Guild {
    date: string;
    world_name: string;
    guild_name: string;
    guild_level: number;
    guild_mark: string;
    guild_point: number;
    ranking: number;
    guild_master_name: string;
}
