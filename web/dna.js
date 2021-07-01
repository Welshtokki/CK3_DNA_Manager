import { Converter } from './converter.js'

class DNA {

    constructor(code) {
        this.code = code
        this.detectCodeType(code)
        this.parse()
    }

    detectCodeType(code) {
        let type = 'Unknown'
        type = code.includes("ruler_designer") ? "RulerDesigner" : "Base64"

        this.type = type
    }

    parse() {
        const parser = new Parser(this)
        this.data = parser.parse()
    }

    convert() {
        return Converter.convert(this)
    }
}

class Parser {

    constructor(dna) {
        this.dna = dna
    }

    parse() {

        const dnaArray = [];

        if(this.dna.type === 'Base64') {
            const hexString = decodeBase64(this.dna.code);

            for(let i=0; i< hexString.length; i=i+2 ) {
                const dec = parseInt( Number(`0x${hexString.slice(i, i+2)}`) , 10);
                dnaArray.push(dec);
            }
        }
        else if(this.dna.type === 'RulerDesigner') {
            let geneKeys = ['hair_color', 'skin_color', 'eye_color'].concat( Object.keys(geneIndex) );

            let lines = this.dna.code.split('\n')
                        .map( (e) => { return e.trim().replace(/^\t+/gm, ''); })
                        .filter( (e) => { return e.length > 0; });

            for(let gene of geneKeys) {
                let re = new RegExp(`${gene}={\\s*(.+?)\\s+(.+?)\\s+(.+?)\\s+(.+?)\\s*}`);

                for(let line of lines) {
                    let r_line = re.exec(line);

                    if(r_line != null) {

                        let value1 = undefined;
                        let value2 = Number(r_line[2]);
                        let value3 = undefined;
                        let value4 = Number(r_line[4]);


                        if( isNaN(Number(r_line[1])) ) {
                            let k = r_line[1].replace(/"/g, '');
                            value1 = geneIndex[gene][k];
                        } else {
                            value1 = Number(r_line[1]);
                        }

                        if( isNaN(Number(r_line[3])) ) {
                            let k = r_line[3].replace(/"/g, '');
                            value3 = geneIndex[gene][k];
                        } else {
                            value3 = Number(r_line[3]);
                        }

                        if( (value1===undefined) || (value2===undefined) || (value3===undefined) || (value4===undefined)) {
                            console.log(`Parsing Error at ${gene} -> ${value1}, ${value2}, ${value3}, ${value4}`);
                        }

                        value1 = (value1 === undefined) ? 0 : value1
                        value3 = (value3 === undefined) ? 0 : value3

                        dnaArray.push(value1);
                        dnaArray.push(value2);
                        dnaArray.push(value3);
                        dnaArray.push(value4);

                        break;
                    }
                }
            }
        }
        else {

        }

        return dnaArray

        function decodeBase64(base64code) {
            const raw = atob(base64code);

            let result = ''

            for(let i in raw) {
                const hex = raw.charCodeAt(i).toString(16).padStart(2, '0')
                result += hex
            }

            return result.toUpperCase();
        }
    }
}

/*
    Refer to the following path and files

    Path
     - Crusader Kings III/game/common/genes
    Files
     - 01_genes_morph.txt
     - 02_genes_accessories_hairstyles.txt
     - 03_genes_accessories_beards.txt
     - 04_genes_accessories_misc.txt
*/

var geneIndex = {
    gene_chin_forward : {
        "chin_forward_neg" : 0,
        "chin_forward_pos" : 1
    },
    gene_chin_height : {
        "chin_height_neg" : 0,
        "chin_height_pos" : 1
    },
    gene_chin_width : {
        "chin_width_neg" : 0,
        "chin_width_pos" : 1
    },
    gene_eye_angle : {
        "eye_angle_neg" : 0,
        "eye_angle_pos" : 1
    },
    gene_eye_depth : {
        "eye_depth_neg" : 0,
        "eye_depth_pos" : 1
    },
    gene_eye_height : {
        "eye_height_neg" : 0,
        "eye_height_pos" : 1
    },
    gene_eye_distance : {
        "eye_distance_neg" : 0,
        "eye_distance_pos" : 1
    },
    gene_eye_shut : {
        "eye_shut_neg" : 0,
        "eye_shut_pos" : 1
    },
    gene_forehead_angle : {
        "forehead_angle_neg" : 0,
        "forehead_angle_pos" : 1
    },
    gene_forehead_brow_height : {
        "forehead_brow_height_neg" : 0,
        "forehead_brow_height_pos" : 1
    },
    gene_forehead_roundness : {
        "forehead_roundness_neg" : 0,
        "forehead_roundness_pos" : 1
    },
    gene_forehead_width : {
        "forehead_width_neg" : 0,
        "forehead_width_pos" : 1
    },
    gene_forehead_height : {
        "forehead_height_neg" : 0,
        "forehead_height_pos" : 1
    },
    gene_head_height : {
        "head_height_neg" : 0,
        "head_height_pos" : 1
    },
    gene_head_width : {
        "head_width_neg" : 0,
        "head_width_pos" : 1
    },
    gene_head_profile : {
        "head_profile_neg" : 0,
        "head_profile_pos" : 1
    },
    gene_head_top_height : {
        "head_top_height_neg" : 0,
        "head_top_height_pos" : 1
    },
    gene_head_top_width : {
        "head_top_width_neg" : 0,
        "head_top_width_pos" : 1
    },
    gene_jaw_angle : {
        "jaw_angle_neg" : 0,
        "jaw_angle_pos" : 1
    },
    gene_jaw_forward : {
        "jaw_forward_neg" : 0,
        "jaw_forward_pos" : 1
    },
    gene_jaw_height : {
        "jaw_height_neg" : 0,
        "jaw_height_pos" : 1
    },
    gene_jaw_width : {
        "jaw_width_neg" : 0,
        "jaw_width_pos" : 1
    },
    gene_mouth_corner_depth : {
        "mouth_corner_depth_neg" : 0,
        "mouth_corner_depth_pos" : 1
    },
    gene_mouth_corner_height : {
        "mouth_corner_height_neg" : 0,
        "mouth_corner_height_pos" : 1
    },
    gene_mouth_forward : {
        "mouth_forward_neg" : 0,
        "mouth_forward_pos" : 1
    },
    gene_mouth_height : {
        "mouth_height_neg" : 0,
        "mouth_height_pos" : 1
    },
    gene_mouth_width : {
        "mouth_width_neg" : 0,
        "mouth_width_pos" : 1
    },
    gene_mouth_upper_lip_size : {
        "mouth_upper_lip_size_neg" : 0,
        "mouth_upper_lip_size_pos" : 1
    },
    gene_mouth_lower_lip_size : {
        "mouth_lower_lip_size_neg" : 0,
        "mouth_lower_lip_size_pos" : 1
    },
    gene_mouth_open : {
        "mouth_open_neg" : 0,
        "mouth_open_pos" : 1
    },
    gene_neck_length : {
        "neck_length_neg" : 0,
        "neck_length_pos" : 1
    },
    gene_neck_width : {
        "neck_width_neg" : 0,
        "neck_width_pos" : 1
    },
    gene_bs_cheek_forward : {
        "cheek_forward_neg" : 0,
        "cheek_forward_pos" : 1
    },
    gene_bs_cheek_height : {
        "cheek_height_neg" : 0,
        "cheek_height_pos" : 1
    },
    gene_bs_cheek_width : {
        "cheek_width_neg" : 0,
        "cheek_width_pos" : 1
    },
    gene_bs_ear_angle : {
        "ear_angle_neg" : 0,
        "ear_angle_pos" : 1
    },
    gene_bs_ear_inner_shape : {
        "ear_inner_shape_pos" : 0
    },
    gene_bs_ear_bend : {
        "ear_lower_bend_pos" : 0,
        "ear_upper_bend_pos" : 1,
        "ear_both_bend_pos" : 2
    },
    gene_bs_ear_outward : {
        "ear_outward_neg" : 0,
        "ear_outward_pos" : 1
    },
    gene_bs_ear_size : {
        "ear_size_neg" : 0,
        "ear_size_pos" : 1
    },
    gene_bs_eye_corner_depth : {
        "eye_corner_depth_neg" : 0,
        "eye_corner_depth_pos" : 1
    },
    gene_bs_eye_fold_shape : {
        "eye_fold_shape_neg" : 0,
        "eye_fold_shape_pos" : 1
    },
    gene_bs_eye_size : {
        "eye_size_neg" : 0,
        "eye_size_pos" : 1
    },
    gene_bs_eye_upper_lid_size : {
        "eye_upper_lid_size_neg" : 0,
        "eye_upper_lid_size_pos" : 1
    },
    gene_bs_forehead_brow_curve : {
        "forehead_brow_curve_neg" : 0,
        "forehead_brow_curve_pos" : 1
    },
    gene_bs_forehead_brow_forward : {
        "forehead_brow_forward_neg" : 0,
        "forehead_brow_forward_pos" : 1
    },
    gene_bs_forehead_brow_inner_height : {
        "forehead_brow_inner_height_neg" : 0,
        "forehead_brow_inner_height_pos" : 1
    },
    gene_bs_forehead_brow_outer_height : {
        "forehead_brow_outer_height_neg" : 0,
        "forehead_brow_outer_height_pos" : 1
    },
    gene_bs_forehead_brow_width : {
        "forehead_brow_width_neg" : 0,
        "forehead_brow_width_pos" : 1
    },
    gene_bs_jaw_def : {
        "jaw_def_neg" : 0,
        "jaw_def_pos" : 1
    },
    gene_bs_mouth_lower_lip_def : {
        "mouth_lower_lip_def_pos" : 0
    },
    gene_bs_mouth_lower_lip_full : {
        "mouth_lower_lip_full_neg" : 0,
        "mouth_lower_lip_full_pos" : 1
    },
    gene_bs_mouth_lower_lip_pad : {
        "mouth_lower_lip_pad_neg" : 0,
        "mouth_lower_lip_pad_pos" : 1
    },
    gene_bs_mouth_lower_lip_width : {
        "mouth_lower_lip_width_neg" : 0,
        "mouth_lower_lip_width_pos" : 1
    },
    gene_bs_mouth_philtrum_def : {
        "mouth_philtrum_def_pos" : 0
    },
    gene_bs_mouth_philtrum_shape : {
        "mouth_philtrum_shape_neg" : 0,
        "mouth_philtrum_shape_pos" : 1
    },
    gene_bs_mouth_philtrum_width : {
        "mouth_philtrum_width_neg" : 0,
        "mouth_philtrum_width_pos" : 1
    },
    gene_bs_mouth_upper_lip_def : {
        "mouth_upper_lip_def_pos" : 0
    },
    gene_bs_mouth_upper_lip_full : {
        "mouth_upper_lip_full_neg" : 0,
        "mouth_upper_lip_full_pos" : 1
    },
    gene_bs_mouth_upper_lip_profile : {
        "mouth_upper_lip_profile_neg" : 0,
        "mouth_upper_lip_profile_pos" : 1
    },
    gene_bs_mouth_upper_lip_width : {
        "mouth_upper_lip_width_neg" : 0,
        "mouth_upper_lip_width_pos" : 1
    },
    gene_bs_nose_forward : {
        "nose_forward_neg" : 0,
        "nose_forward_pos" : 1
    },
    gene_bs_nose_height : {
        "nose_height_neg" : 0,
        "nose_height_pos" : 1
    },
    gene_bs_nose_length : {
        "nose_length_neg" : 0,
        "nose_length_pos" : 1
    },
    gene_bs_nose_nostril_height : {
        "nose_nostril_height_neg" : 0,
        "nose_nostril_height_pos" : 1
    },
    gene_bs_nose_nostril_width : {
        "nose_nostril_width_neg" : 0,
        "nose_nostril_width_pos" : 1
    },
    gene_bs_nose_profile : {
        "nose_profile_neg" : 0,
        "nose_profile_pos" : 1,
        "nose_profile_hawk" : 2,
        "nose_profile_hawk_pos" : 3
    },
    gene_bs_nose_ridge_angle : {
        "nose_ridge_angle_neg" : 0,
        "nose_ridge_angle_pos" : 1
    },
    gene_bs_nose_ridge_width : {
        "nose_ridge_width_neg" : 0,
        "nose_ridge_width_pos" : 1
    },
    gene_bs_nose_size : {
        "nose_size_neg" : 0,
        "nose_size_pos" : 1
    },
    gene_bs_nose_tip_angle : {
        "nose_tip_angle_neg" : 0,
        "nose_tip_angle_pos" : 1
    },
    gene_bs_nose_tip_forward : {
        "nose_tip_forward_neg" : 0,
        "nose_tip_forward_pos" : 1
    },
    gene_bs_nose_tip_width : {
        "nose_tip_width_neg" : 0,
        "nose_tip_width_pos" : 1
    },
    face_detail_cheek_def : {
        "cheek_def_01" : 0,
        "cheek_def_02" : 1
    },
    face_detail_cheek_fat : {
        "cheek_fat_01_pos" : 0,
        "cheek_fat_02_pos" : 1,
        "cheek_fat_03_pos" : 2,
        "cheek_fat_04_pos" : 3,
        "cheek_fat_01_neg" : 4
    },
    face_detail_chin_cleft : {
        "chin_cleft" : 0,
        "chin_dimple" : 1
    },
    face_detail_chin_def : {
        "chin_def" : 0
    },
    face_detail_eye_lower_lid_def : {
        "eye_lower_lid_def" : 0
    },
    face_detail_eye_socket : {
        "eye_socket_01" : 0,
        "eye_socket_02" : 1,
        "eye_socket_03" : 2
    },
    face_detail_nasolabial : {
        "nasolabial_01" : 0,
        "nasolabial_02" : 1,
        "nasolabial_03" : 2,
        "nasolabial_04" : 3,
    },
    face_detail_nose_ridge_def : {
        "nose_ridge_def_pos" : 0,
        "nose_ridge_def_neg" : 1,
    },
    face_detail_nose_tip_def : {
        "nose_tip_def" : 0
    },
    face_detail_temple_def : {
        "temple_def" : 0
    },
    expression_brow_wrinkles : {
        "brow_wrinkles_01" : 0,
        "brow_wrinkles_02" : 1,
        "brow_wrinkles_03" : 2,
        "brow_wrinkles_04" : 3,
    },
    expression_eye_wrinkles : {
        "eye_wrinkles_01" : 0,
        "eye_wrinkles_02" : 1,
        "eye_wrinkles_03" : 2,
    },
    expression_forehead_wrinkles : {
        "forehead_wrinkles_01" : 0,
        "forehead_wrinkles_02" : 1,
        "forehead_wrinkles_03" : 2,
    },
    expression_other : {
        "cheek_wrinkles_left_01" : 0,
        "cheek_wrinkles_right_01" : 1,
        "cheek_wrinkles_both_01" : 2,
        "nose_wrinkles_01" : 3
    },
    complexion : {
        "complexion_1" : 0,
        "complexion_2" : 1,
        "complexion_3" : 2,
        "complexion_4" : 3,
        "complexion_5" : 4,
        "complexion_6" : 5,
        "complexion_7" : 6,
        "complexion_beauty_1" : 7,
        "complexion_ugly_1" : 8,
        "complexion_no_face" : 9
    },
    gene_height : {
        "full_height" : 0,
        "normal_height" : 1,
        "dwarf_height" : 2,
        "giant_height" : 3
    },
    gene_bs_body_type : {
        "body_average" : 0,
        "body_fat_head_fat_low" : 1,
        "body_fat_head_fat_medium" : 2,
        "body_fat_head_fat_full" : 3,
        "no_portrait" : 4
    },
    gene_bs_body_shape : {
        "body_shape_average_clothed" : 0,
        "body_shape_average" : 1,
        "body_shape_apple_half" : 2,
        "body_shape_apple_full" : 3,
        "body_shape_hourglass_half" : 4,
        "body_shape_hourglass_full" : 5,
        "body_shape_pear_half" : 6,
        "body_shape_pear_full" : 7,
        "body_shape_rectangle_half" : 8,
        "body_shape_rectangle_full" : 9,
        "body_shape_triangle_half" : 10,
        "body_shape_triangle_full" : 11
    },
    gene_bs_bust : {
        "bust_clothes" : 0,
        "bust_default" : 1,
        "bust_shape_1_half" : 2,
        "bust_shape_1_full" : 3,
        "bust_shape_2_half" : 4,
        "bust_shape_2_full" : 5,
        "bust_shape_3_half" : 6,
        "bust_shape_3_full" : 7,
        "bust_shape_4_half" : 8,
        "bust_shape_4_full" : 9
    },
    gene_age : {
        "old_1" : 0,
        "old_2" : 1,
        "old_3" : 2,
        "old_4" : 3,
        "old_beauty_1" : 4,
        "no_aging" : 5
    },
    gene_eyebrows_shape : {
        "no_eyebrows" : 0,
        "avg_spacing_avg_thickness" : 1,
        "avg_spacing_high_thickness" : 2,
        "avg_spacing_low_thickness" : 3,
        "avg_spacing_lower_thickness" : 4,
        "far_spacing_avg_thickness" : 5,
        "far_spacing_high_thickness" : 6,
        "far_spacing_low_thickness" : 7,
        "far_spacing_lower_thickness" : 8,
        "close_spacing_avg_thickness" : 9,
        "close_spacing_high_thickness" : 10,
        "close_spacing_low_thickness" : 11,
        "close_spacing_lower_thickness" : 12
    },
    gene_eyebrows_fullness : {
        "no_eyebrows" : 0,
        "layer_2_avg_thickness" : 1,
        "layer_2_high_thickness" : 2,
        "layer_2_low_thickness" : 3,
        "layer_2_lower_thickness" : 4
    },
    gene_body_hair : {
        "body_hair_sparse" : 0,
        "body_hair_avg" : 1,
        "body_hair_dense" : 2,
        "body_hair_sparse_low_stubble" : 3,
        "body_hair_avg_low_stubble" : 4,
        "body_hair_dense_low_stubble" : 5
    },
    /*
    hairstyles : {
        "all_hairstyles" : 0,
        "no_hairstyles" : 1,
        "western_hairstyles" : 2,
        "mena_hairstyles" : 3,
        "byzantine_hairstyles" : 4,
        "sub_saharan_hairstyles" : 5,
        "rtt_hairstyles" : 6,
        "indian_hairstyles" : 7,
        "northern_hairstyles" : 8,
        "steppe_hairstyles" : 9,
        "catholic_devoted_hairstyles" : 10,
        "western_baby_hairstyles" : 11,
        "sub_saharan_baby_hairstyles" : 12
    },
    */

    hairstyles : {
        /* OLD Version Compatible */
        "all_hairstyles" : 0,
        "no_hairstyles" : 1,
        "western_hairstyles" : 2,
        "mena_hairstyles" : 3,
        "byzantine_hairstyles" : 4,
        "sub_saharan_hairstyles" : 5,
        "rtt_hairstyles" : 6,
        "indian_hairstyles" : 7,
        "northern_hairstyles" : 8,
        "steppe_hairstyles" : 9,
        "catholic_devoted_hairstyles" : 10,
        "western_baby_hairstyles" : 11,
        "sub_saharan_baby_hairstyles" : 12,

        /* 1.3 */

        "all_hairstyles" : 0,
        "legacy_dna_hairstyles" : 100,
        "no_hairstyles" : 1,
        "western_hairstyles_straight" : 2,
        "western_hairstyles_wavy" : 3,
        "western_hairstyles_curly" : 4,
        "western_hairstyles_afro" : 5,
        "mena_hairstyles_straight" : 6,
        "mena_hairstyles_wavy" : 7,
        "mena_hairstyles_curly" : 8,
        "mena_hairstyles_afro" : 9,
        "byzantine_hairstyles_straight" : 10,
        "byzantine_hairstyles_wavy" : 11,
        "byzantine_hairstyles_curly" : 12,
        "byzantine_hairstyles_afro" : 13,
        "sub_saharan_hairstyles_straight" : 14,
        "sub_saharan_hairstyles_wavy" : 15,
        "sub_saharan_hairstyles_curly" : 16,
        "sub_saharan_hairstyles_afro" : 17,
        "indian_hairstyles_straight" : 18,
        "indian_hairstyles_wavy" : 19,
        "indian_hairstyles_curly" : 20,
        "indian_hairstyles_afro" : 21,
        "northern_hairstyles_straight" : 22,
        "northern_hairstyles_wavy" : 23,
        "northern_hairstyles_curly" : 24,
        "northern_hairstyles_afro" : 25,
        "steppe_hairstyles_straight" : 26,
        "steppe_hairstyles_wavy" : 27,
        "steppe_hairstyles_curly" : 28,
        "steppe_hairstyles_afro" : 29,
        "catholic_devoted_hairstyles" : 30,
        "western_baby_hairstyles" : 31,
        "sub_saharan_baby_hairstyles" : 32,
        "rtt_hairstyles" : 33,
        "fp1_hairstyles_straight" : 34,
        "fp1_hairstyles_wavy" : 35,
        "scripted_character_hairstyles_01" : 36,
        "scripted_character_hairstyles_02" : 37
    },

    beards : {
        "no_beard" : 0,
        "all_beards" : 1,
        "western_beards" : 2,
        "rtt_beards" : 3,
        "mena_beards" : 4,
        "northern_beards" : 5,
        "steppe_beards" : 6,
        "sub_saharan_beards" : 7,
        "indian_beards" : 8
    },
    eye_accessory : {
        "normal_eyes" : 0,
        "normal_eyes_no_shadow" : 1,
        "normal_eyes_dark_iris" : 2,
        "normal_eyes_asian" : 3,
        "bloodshot_eyes" : 4,
        "blind_eyes" : 5,
        "no_eyes" : 6
    },
    teeth_accessory : {
        "normal_teeth" : 0,
        "no_teeth" : 1
    },
    eyelashes_accessory : {
        "no_eyelashes" : 0,
        "normal_eyelashes" : 1,
        "asian_eyelashes" : 2
    }
};


export { DNA, geneIndex }