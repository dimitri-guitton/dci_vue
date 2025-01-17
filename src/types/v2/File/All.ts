import { CetFile } from '@/types/v2/File/Cet/CetFile';
import { CombleFile } from '@/types/v2/File/Comble/CombleFile';
import { PbFile } from '@/types/v2/File/Pb/PbFile';
import { PgFile } from '@/types/v2/File/Pg/PgFile';
import { PvFile } from '@/types/v2/File/Pv/PvFile';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { SolFile } from '@/types/v2/File/Sol/SolFile';
import { CombleQuotation } from '@/types/v2/File/Comble/CombleQuotation';
import { SolQuotation } from '@/types/v2/File/Sol/SolQuotation';
import { RoQuotation } from '@/types/v2/File/Ro/RoQuotation';
import { RrQuotation } from '@/types/v2/File/Rr/RrQuotation';
import { CetQuotation } from '@/types/v2/File/Cet/CetQuotation';
import { PgQuotation } from '@/types/v2/File/Pg/PgQuotation';
import { PbQuotation } from '@/types/v2/File/Pb/PbQuotation';
import { PvQuotation } from '@/types/v2/File/Pv/PvQuotation';
import { CpvFile } from '@/types/v2/File/Cpv/CpvFile';
import { CpvQuotation } from '@/types/v2/File/Cpv/CpvQuotation';
import { BrveFile } from '@/types/v2/File/Brve/BrveFile';
import { BrveQuotation } from '@/types/v2/File/Brve/BrveQuotation';
import { VeFile } from '@/types/v2/File/Ve/VeFile';
import { VeQuotation } from '@/types/v2/File/Ve/VeQuotation';

export type AllFile =
    CetFile
    | CombleFile
    | PbFile
    | PgFile
    | PvFile
    | RoFile
    | RrFile
    | SolFile
    | CpvFile
    | BrveFile
    | VeFile;

export type AllQuotation =
    CombleQuotation
    | SolQuotation
    | RoQuotation
    | RrQuotation
    | CetQuotation
    | PgQuotation
    | PbQuotation
    | PvQuotation
    | CpvQuotation
    | BrveQuotation
    | VeQuotation;
