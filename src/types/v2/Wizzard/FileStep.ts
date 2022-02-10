import { Step1 } from '@/types/v2/Wizzard/Step1';
import { Step2 } from '@/types/v2/Wizzard/Step2';
import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';
import { CetStep3 } from '@/types/v2/Wizzard/step3/CetStep3';

// export interface FileStep extends Step1, Step2, BaseStep3, Step4 {}

export interface CetFileStep extends Step1, Step2, CetStep3, BaseStep4 {}
