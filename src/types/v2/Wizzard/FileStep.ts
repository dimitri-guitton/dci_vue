import { Step1 } from '@/types/v2/Wizzard/Step1';
import { Step2 } from '@/types/v2/Wizzard/Step2';
import { Step3 } from '@/types/v2/Wizzard/Step3';
import { Step4 } from '@/types/v2/Wizzard/Step4';

export interface FileStep extends Step1, Step2, Step3, Step4 {}
