import { Step1 } from '@/types/v2/Wizzard/Step1';
import { Step2 } from '@/types/v2/Wizzard/Step2';
import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';
import { CetStep3 } from '@/types/v2/Wizzard/step3/CetStep3';
import { CetStep5 } from '@/types/v2/Wizzard/step5/CetStep5';
import { CombleStep3 } from '@/types/v2/Wizzard/step3/CombleStep3';
import { CombleStep5 } from '@/types/v2/Wizzard/step5/CombleStep5';
import { SolStep3 } from '@/types/v2/Wizzard/step3/SolStep3';
import { SolStep5 } from '@/types/v2/Wizzard/step5/SolStep5';
import { PgStep5 } from '@/types/v2/Wizzard/step5/PgStep5';
import { PacRoStep3 } from '@/types/v2/Wizzard/step3/PacRoStep3';
import { PacRoStep5 } from '@/types/v2/Wizzard/step5/PacRoStep5';
import { PacRrStep3 } from '@/types/v2/Wizzard/step3/PacRrStep3';
import { PacRrStep5 } from '@/types/v2/Wizzard/step5/PacRrStep5';
import { PbStep5 } from '@/types/v2/Wizzard/step5/PbStep5';
import { PvStep5 } from '@/types/v2/Wizzard/step5/PvStep5';
import { PacRrStep4 } from '@/types/v2/Wizzard/step4/PacRrStep4';
import { PacRoStep4 } from '@/types/v2/Wizzard/step4/PacRoStep4';
import { PbStep4 } from '@/types/v2/Wizzard/step4/PbStep4';
import { BaseStep3 } from '@/types/v2/Wizzard/step3/BaseStep3';

export interface CetFileStep extends Step1, Step2, CetStep3, BaseStep4, CetStep5 {}

export interface PgFileStep extends Step1, Step2, BaseStep3, BaseStep4, PgStep5 {}

export interface PbFileStep extends Step1, Step2, BaseStep3, PbStep4, PbStep5 {}

export interface PvFileStep extends Step1, Step2, BaseStep3, BaseStep4, PvStep5 {}

export interface PacRoFileStep extends Step1, Step2, PacRoStep3, PacRoStep4, PacRoStep5 {}

export interface PacRrFileStep extends Step1, Step2, PacRrStep3, PacRrStep4, PacRrStep5 {}

export interface CombleFileStep extends Step1, Step2, CombleStep3, BaseStep4, CombleStep5 {}

export interface SolFileStep extends Step1, Step2, SolStep3, BaseStep4, SolStep5 {}
