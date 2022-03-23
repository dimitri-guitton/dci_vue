import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';

export interface PacRoStep4 extends BaseStep4 {
    deviceToReplaceType: string;
    deviceToReplaceBrand: string;
    deviceToReplaceModel: string;
    isEcsDeporte: boolean;
    volumeECSDeporte: number;
    volumeECS: number;
    cascadeSystem: boolean;
    discount: number;
}
