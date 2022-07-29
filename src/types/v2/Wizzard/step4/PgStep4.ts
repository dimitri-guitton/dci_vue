import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';

export interface PgStep4 extends BaseStep4 {
    outsideSocket: boolean;
    smoke: string;
}
